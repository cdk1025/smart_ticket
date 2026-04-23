import { scanDocument } from 'scanic'
import type { ScannerResult } from 'scanic'

export interface ScanResult {
  success: boolean
  canvas?: HTMLCanvasElement
  error?: string
}

/**
 * 自动检测文档边缘并校正透视
 * @param imageSource - 图片元素或 Canvas
 * @returns 校正后的 canvas 或错误信息
 */
export async function autoCorrectDocument(
  imageSource: HTMLImageElement | HTMLCanvasElement
): Promise<ScanResult> {
  try {
    const result: ScannerResult = await scanDocument(imageSource, {
      mode: 'extract',
      output: 'canvas',
    })

    if (result && result.success && result.output) {
      return { success: true, canvas: result.output as HTMLCanvasElement }
    }
    return { success: false, error: result?.message || '未检测到文档边缘' }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * 从 File 对象自动校正文档
 */
export async function autoCorrectFromFile(file: File): Promise<ScanResult> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = async () => {
      const result = await autoCorrectDocument(img)
      URL.revokeObjectURL(img.src)
      resolve(result)
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      resolve({ success: false, error: '图片加载失败' })
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 将 Canvas 转换为 File 对象
 */
export function canvasToFile(
  canvas: HTMLCanvasElement,
  fileName: string,
  mimeType: string = 'image/png'
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(new File([blob], fileName, { type: mimeType }))
        } else {
          reject(new Error('Canvas 转换失败'))
        }
      },
      mimeType,
      0.95
    )
  })
}
