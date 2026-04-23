import { PDFDocument } from 'pdf-lib'
import type { UploadedFile } from '../types'
import { rotateImage, fitToA4 } from './imageProcessor'

const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

/**
 * Merge multiple uploaded files (PDFs and images) into a single PDF.
 * - PDF files: pages are copied directly (preserving original size).
 * - Image files: embedded on centered A4 pages with rotation applied.
 */
export async function mergeFiles(files: UploadedFile[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error('No files to merge')
  }

  const pdfDoc = await PDFDocument.create()

  for (const uploadedFile of files) {
    if (uploadedFile.type === 'pdf') {
      await embedPdf(pdfDoc, uploadedFile)
    } else {
      await embedImage(pdfDoc, uploadedFile)
    }
  }

  return pdfDoc.save()
}

async function embedPdf(pdfDoc: PDFDocument, uploadedFile: UploadedFile): Promise<void> {
  const arrayBuffer = await uploadedFile.file.arrayBuffer()
  let srcDoc: PDFDocument
  try {
    srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  } catch {
    console.warn(`Skipping corrupt/unreadable PDF: ${uploadedFile.name}`)
    return
  }

  const pageCount = srcDoc.getPageCount()
  if (pageCount === 0) return

  const indices = Array.from({ length: pageCount }, (_, i) => i)
  const copiedPages = await pdfDoc.copyPages(srcDoc, indices)

  for (const page of copiedPages) {
    pdfDoc.addPage(page)
  }
}

async function embedImage(pdfDoc: PDFDocument, uploadedFile: UploadedFile): Promise<void> {
  let imageBytes: ArrayBuffer

  // Apply rotation if needed
  if (uploadedFile.rotation !== 0) {
    const rotatedBlob = await rotateImage(uploadedFile.file, uploadedFile.rotation)
    imageBytes = await rotatedBlob.arrayBuffer()
  } else {
    imageBytes = await uploadedFile.file.arrayBuffer()
  }

  const uint8 = new Uint8Array(imageBytes)
  const mimeType = uploadedFile.file.type.toLowerCase()

  let image
  try {
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      // If rotated, it's PNG from canvas; otherwise embed as JPEG
      if (uploadedFile.rotation !== 0) {
        image = await pdfDoc.embedPng(uint8)
      } else {
        image = await pdfDoc.embedJpg(uint8)
      }
    } else if (mimeType === 'image/png') {
      image = await pdfDoc.embedPng(uint8)
    } else {
      // For other image types, try PNG (canvas output is always PNG after rotation)
      image = await pdfDoc.embedPng(uint8)
    }
  } catch (err) {
    console.warn(`Failed to embed image: ${uploadedFile.name}`, err)
    return
  }

  const { x, y, width, height } = fitToA4(image.width, image.height)

  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
  page.drawImage(image, { x, y, width, height })
}
