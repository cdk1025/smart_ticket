export interface UploadedFile {
  id: string
  file: File
  name: string
  type: 'pdf' | 'image'
  thumbnailUrl: string
  rotation: number // 0, 90, 180, 270
}
