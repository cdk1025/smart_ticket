import { PDFDocument } from 'pdf-lib'
import type { PDFPage, PDFImage } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { UploadedFile } from '../types'
import { rotateImage } from './imageProcessor'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// A4 dimensions in points
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89
const MARGIN = 20
const GAP = 10

// Usable area
const USABLE_WIDTH = A4_WIDTH - MARGIN * 2   // 555.28
const USABLE_HEIGHT = A4_HEIGHT - MARGIN * 2 // 801.89

// Slot dimensions
const SLOT_HALF_HEIGHT = (USABLE_HEIGHT - GAP) / 2  // 395.945
const SLOT_HALF_WIDTH = (USABLE_WIDTH - GAP) / 2    // 272.64

// Slot positions (pdf-lib y is from bottom)
const SLOT_TOP = { x: MARGIN, y: A4_HEIGHT - MARGIN - SLOT_HALF_HEIGHT, width: USABLE_WIDTH, height: SLOT_HALF_HEIGHT }
const SLOT_BOTTOM = { x: MARGIN, y: MARGIN, width: USABLE_WIDTH, height: SLOT_HALF_HEIGHT }

// Four-grid slots
const SLOT_TOP_LEFT = { x: MARGIN, y: A4_HEIGHT - MARGIN - SLOT_HALF_HEIGHT, width: SLOT_HALF_WIDTH, height: SLOT_HALF_HEIGHT }
const SLOT_TOP_RIGHT = { x: MARGIN + SLOT_HALF_WIDTH + GAP, y: A4_HEIGHT - MARGIN - SLOT_HALF_HEIGHT, width: SLOT_HALF_WIDTH, height: SLOT_HALF_HEIGHT }
const SLOT_BOTTOM_LEFT = { x: MARGIN, y: MARGIN, width: SLOT_HALF_WIDTH, height: SLOT_HALF_HEIGHT }
const SLOT_BOTTOM_RIGHT = { x: MARGIN + SLOT_HALF_WIDTH + GAP, y: MARGIN, width: SLOT_HALF_WIDTH, height: SLOT_HALF_HEIGHT }

const FOUR_GRID_SLOTS = [SLOT_TOP_LEFT, SLOT_TOP_RIGHT, SLOT_BOTTOM_LEFT, SLOT_BOTTOM_RIGHT]

interface Slot {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Render the first page of a PDF file to a PNG Uint8Array via canvas.
 */
async function pdfToImage(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)

  // Render at a resolution that gives good quality for half-A4
  const unscaledViewport = page.getViewport({ scale: 1 })
  const targetWidth = USABLE_WIDTH * 2 // 2x for quality
  const scale = targetWidth / unscaledViewport.width
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)

  const ctx = canvas.getContext('2d')!
  await page.render({ canvas, canvasContext: ctx, viewport }).promise

  return new Promise<Uint8Array>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to convert PDF page to image'))
          return
        }
        blob.arrayBuffer().then((ab) => resolve(new Uint8Array(ab))).catch(reject)
      },
      'image/png',
    )
  })
}

/**
 * Process an image file: apply rotation if needed, return bytes and format type.
 */
async function processImage(
  file: File,
  rotation: number,
): Promise<{ bytes: Uint8Array; type: 'jpg' | 'png' }> {
  if (rotation !== 0) {
    // rotateImage returns a PNG Blob
    const rotatedBlob = await rotateImage(file, rotation)
    const ab = await rotatedBlob.arrayBuffer()
    return { bytes: new Uint8Array(ab), type: 'png' }
  }

  const ab = await file.arrayBuffer()
  const mime = file.type.toLowerCase()
  const type = (mime === 'image/jpeg' || mime === 'image/jpg') ? 'jpg' : 'png'
  return { bytes: new Uint8Array(ab), type }
}

/**
 * Embed image bytes into the PDF document, returning a PDFImage.
 */
async function embedImageBytes(
  pdfDoc: PDFDocument,
  bytes: Uint8Array,
  type: 'jpg' | 'png',
): Promise<PDFImage> {
  return type === 'jpg' ? pdfDoc.embedJpg(bytes) : pdfDoc.embedPng(bytes)
}

/**
 * Draw an image centered within the given slot, maintaining aspect ratio.
 */
function drawImageInSlot(page: PDFPage, image: PDFImage, slot: Slot): void {
  const imgRatio = image.width / image.height
  const slotRatio = slot.width / slot.height

  let drawWidth: number
  let drawHeight: number

  if (imgRatio > slotRatio) {
    drawWidth = slot.width
    drawHeight = slot.width / imgRatio
  } else {
    drawHeight = slot.height
    drawWidth = slot.height * imgRatio
  }

  const x = slot.x + (slot.width - drawWidth) / 2
  const y = slot.y + (slot.height - drawHeight) / 2

  page.drawImage(image, { x, y, width: drawWidth, height: drawHeight })
}

/**
 * Embed a PDF-type UploadedFile as image into the target pdfDoc and draw it in the given slot.
 */
async function drawInvoiceInSlot(
  pdfDoc: PDFDocument,
  page: PDFPage,
  uploadedFile: UploadedFile,
  slot: Slot,
): Promise<void> {
  try {
    const pngBytes = await pdfToImage(uploadedFile.file)
    const image = await pdfDoc.embedPng(pngBytes)
    drawImageInSlot(page, image, slot)
  } catch (err) {
    console.warn(`Failed to render PDF as image: ${uploadedFile.name}`, err)
  }
}

/**
 * Embed an image-type UploadedFile into the target pdfDoc and draw it in the given slot.
 */
async function drawBillInSlot(
  pdfDoc: PDFDocument,
  page: PDFPage,
  uploadedFile: UploadedFile,
  slot: Slot,
): Promise<void> {
  try {
    const { bytes, type } = await processImage(uploadedFile.file, uploadedFile.rotation)
    const image = await embedImageBytes(pdfDoc, bytes, type)
    drawImageInSlot(page, image, slot)
  } catch (err) {
    console.warn(`Failed to embed image: ${uploadedFile.name}`, err)
  }
}

/**
 * Merge multiple uploaded files (PDFs and images) into a single PDF
 * with smart layout rules:
 * - Invoices (PDF): 2 per page, top/bottom
 * - Bills (images): 4 per page, 2x2 grid
 * - Mixed: odd invoice on top half + up to 2 bills on bottom half
 */
export async function mergeFiles(files: UploadedFile[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error('No files to merge')
  }

  const pdfDoc = await PDFDocument.create()

  // Classify files
  const invoices = files.filter((f) => f.type === 'pdf')
  const bills = files.filter((f) => f.type === 'image')

  // Pair invoices
  const invoicePairs: [UploadedFile, UploadedFile][] = []
  let remainingInvoice: UploadedFile | null = null

  for (let i = 0; i < invoices.length; i += 2) {
    if (i + 1 < invoices.length) {
      invoicePairs.push([invoices[i], invoices[i + 1]])
    } else {
      remainingInvoice = invoices[i]
    }
  }

  // 1. Invoice pair pages (2 per page, top & bottom)
  for (const [top, bottom] of invoicePairs) {
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    await drawInvoiceInSlot(pdfDoc, page, top, SLOT_TOP)
    await drawInvoiceInSlot(pdfDoc, page, bottom, SLOT_BOTTOM)
  }

  // 2. Mixed page (odd invoice + up to 2 bills)
  let billStartIndex = 0
  if (remainingInvoice) {
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    await drawInvoiceInSlot(pdfDoc, page, remainingInvoice, SLOT_TOP)

    // Place up to 2 bills in bottom half (left/right)
    if (bills.length >= 1) {
      await drawBillInSlot(pdfDoc, page, bills[0], SLOT_BOTTOM_LEFT)
      billStartIndex = 1
    }
    if (bills.length >= 2) {
      await drawBillInSlot(pdfDoc, page, bills[1], SLOT_BOTTOM_RIGHT)
      billStartIndex = 2
    }
  }

  // 3. Remaining bills in 4-grid layout
  const remainingBills = bills.slice(billStartIndex)
  for (let i = 0; i < remainingBills.length; i += 4) {
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    const chunk = remainingBills.slice(i, i + 4)
    for (let j = 0; j < chunk.length; j++) {
      await drawBillInSlot(pdfDoc, page, chunk[j], FOUR_GRID_SLOTS[j])
    }
  }

  return pdfDoc.save()
}
