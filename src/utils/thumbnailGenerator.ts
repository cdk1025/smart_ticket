import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// CMap configuration for CJK font rendering
const PDFJS_CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/cmaps/'
const PDFJS_STANDARD_FONT_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/standard_fonts/'

const MAX_THUMB_WIDTH = 200
const MAX_THUMB_HEIGHT = 280

/**
 * Generate a thumbnail data URL for a given file.
 * Supports images (JPEG, PNG) and PDFs.
 */
export async function generateThumbnail(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return generatePdfThumbnail(file)
  }

  if (file.type.startsWith('image/')) {
    return generateImageThumbnail(file)
  }

  throw new Error(`Unsupported file type: ${file.type}`)
}

async function generateImageThumbnail(file: File): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const { width, height } = fitDimensions(img.width, img.height)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, width, height)

    return canvas.toDataURL('image/png')
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function generatePdfThumbnail(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: PDFJS_CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: PDFJS_STANDARD_FONT_URL,
  }).promise
  const page = await pdf.getPage(1)

  const unscaledViewport = page.getViewport({ scale: 1 })
  const { width: targetW, height: targetH } = fitDimensions(
    unscaledViewport.width,
    unscaledViewport.height
  )
  const scale = Math.min(targetW / unscaledViewport.width, targetH / unscaledViewport.height)
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height

  const ctx = canvas.getContext('2d')!
  await page.render({ canvasContext: ctx, viewport, canvas }).promise

  return canvas.toDataURL('image/png')
}

function fitDimensions(
  srcWidth: number,
  srcHeight: number
): { width: number; height: number } {
  const ratio = Math.min(MAX_THUMB_WIDTH / srcWidth, MAX_THUMB_HEIGHT / srcHeight, 1)
  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio),
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image for thumbnail'))
    img.src = src
  })
}
