export interface EnhanceOptions {
  contrast: number    // 对比度，默认 1.0（范围 0.5-2.0）
  brightness: number  // 亮度，默认 1.0（范围 0.5-2.0）
  sharpen: number     // 锐化强度，默认 0（范围 0-2.0）
}

export const defaultEnhanceOptions: EnhanceOptions = {
  contrast: 1.0,
  brightness: 1.0,
  sharpen: 0,
}

/**
 * Check if enhance options differ from defaults.
 */
export function isEnhanced(options: EnhanceOptions): boolean {
  return (
    options.contrast !== defaultEnhanceOptions.contrast ||
    options.brightness !== defaultEnhanceOptions.brightness ||
    options.sharpen !== defaultEnhanceOptions.sharpen
  )
}

/**
 * Apply contrast, brightness, and sharpening to an image on a cloned canvas.
 * Does NOT modify the original canvas.
 */
export function enhanceImage(
  canvas: HTMLCanvasElement,
  options: EnhanceOptions,
): HTMLCanvasElement {
  const { width, height } = canvas
  const srcCtx = canvas.getContext('2d')!
  const srcData = srcCtx.getImageData(0, 0, width, height)
  const src = srcData.data

  // Clone canvas for output
  const outCanvas = document.createElement('canvas')
  outCanvas.width = width
  outCanvas.height = height
  const outCtx = outCanvas.getContext('2d')!

  // --- Step 1: Apply contrast & brightness ---
  const contrastFactor = options.contrast
  const contrastIntercept = 128 * (1 - contrastFactor)
  const brightnessFactor = options.brightness

  const adjusted = new Uint8ClampedArray(src.length)
  for (let i = 0; i < src.length; i += 4) {
    // Apply contrast then brightness, clamp via Uint8ClampedArray
    adjusted[i] = (contrastIntercept + contrastFactor * src[i]) * brightnessFactor
    adjusted[i + 1] = (contrastIntercept + contrastFactor * src[i + 1]) * brightnessFactor
    adjusted[i + 2] = (contrastIntercept + contrastFactor * src[i + 2]) * brightnessFactor
    adjusted[i + 3] = src[i + 3] // alpha unchanged
  }

  // --- Step 2: Apply sharpening (Unsharp Mask) ---
  if (options.sharpen > 0) {
    // Sharpen kernel (3x3):
    //  [0, -1,  0]
    //  [-1, 5, -1]
    //  [0, -1,  0]
    const strength = options.sharpen
    const result = new Uint8ClampedArray(adjusted.length)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4

        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          // Edge pixels: no sharpening
          result[idx] = adjusted[idx]
          result[idx + 1] = adjusted[idx + 1]
          result[idx + 2] = adjusted[idx + 2]
          result[idx + 3] = adjusted[idx + 3]
          continue
        }

        const top = ((y - 1) * width + x) * 4
        const bottom = ((y + 1) * width + x) * 4
        const left = (y * width + (x - 1)) * 4
        const right = (y * width + (x + 1)) * 4

        for (let c = 0; c < 3; c++) {
          const sharpened =
            5 * adjusted[idx + c] -
            adjusted[top + c] -
            adjusted[bottom + c] -
            adjusted[left + c] -
            adjusted[right + c]

          // Mix original and sharpened based on strength
          result[idx + c] = adjusted[idx + c] * (1 - strength) + sharpened * strength
        }
        result[idx + 3] = adjusted[idx + 3]
      }
    }

    const outData = new ImageData(result, width, height)
    outCtx.putImageData(outData, 0, 0)
  } else {
    const outData = new ImageData(adjusted, width, height)
    outCtx.putImageData(outData, 0, 0)
  }

  return outCanvas
}

/**
 * Load an image file into a canvas, apply enhancement, and return PNG bytes.
 */
export async function enhanceImageFile(
  file: File,
  options: EnhanceOptions,
): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const enhanced = enhanceImage(canvas, options)

  return new Promise<Uint8Array>((resolve, reject) => {
    enhanced.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to convert enhanced image to blob'))
          return
        }
        blob.arrayBuffer().then((ab) => resolve(new Uint8Array(ab))).catch(reject)
      },
      'image/png',
    )
  })
}
