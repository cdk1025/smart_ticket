const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89
const MARGIN = 20
const USABLE_WIDTH = A4_WIDTH - MARGIN * 2
const USABLE_HEIGHT = A4_HEIGHT - MARGIN * 2

/**
 * Rotate an image by the given degrees (0, 90, 180, 270).
 * Returns a PNG Blob of the rotated image.
 */
export async function rotateImage(file: File, degrees: number): Promise<Blob> {
  const normalizedDeg = ((degrees % 360) + 360) % 360
  if (normalizedDeg === 0) {
    return file
  }

  const img = await loadImage(file)
  const swap = normalizedDeg === 90 || normalizedDeg === 270
  const canvas = document.createElement('canvas')
  canvas.width = swap ? img.height : img.width
  canvas.height = swap ? img.width : img.height

  const ctx = canvas.getContext('2d')!
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((normalizedDeg * Math.PI) / 180)
  ctx.drawImage(img, -img.width / 2, -img.height / 2)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create rotated image blob'))
    }, 'image/png')
  })
}

/**
 * Calculate the position and dimensions to fit an image within an A4 page
 * with margins, centered and maintaining aspect ratio.
 * Returns coordinates in PDF points (origin = bottom-left).
 */
export function fitToA4(
  imgWidth: number,
  imgHeight: number
): { x: number; y: number; width: number; height: number } {
  const scaleX = USABLE_WIDTH / imgWidth
  const scaleY = USABLE_HEIGHT / imgHeight
  const scale = Math.min(scaleX, scaleY, 1) // don't upscale beyond original

  const width = imgWidth * scale
  const height = imgHeight * scale

  // Center within A4 page
  const x = MARGIN + (USABLE_WIDTH - width) / 2
  const y = MARGIN + (USABLE_HEIGHT - height) / 2

  return { x, y, width, height }
}

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}
