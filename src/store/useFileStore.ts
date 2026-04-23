import { create } from 'zustand'
import type { UploadedFile } from '../types'

interface FileStore {
  files: UploadedFile[]
  mergedPdfUrl: string | null
  mergedPdfBytes: Uint8Array | null
  isMerging: boolean

  addFiles: (files: UploadedFile[]) => void
  replaceFiles: (files: UploadedFile[]) => void
  removeFile: (id: string) => void
  reorderFiles: (files: UploadedFile[]) => void
  rotateFile: (id: string) => void
  setMergedPdf: (url: string, bytes: Uint8Array) => void
  reset: () => void
}

const initialState = {
  files: [] as UploadedFile[],
  mergedPdfUrl: null as string | null,
  mergedPdfBytes: null as Uint8Array | null,
  isMerging: false,
}

export const useFileStore = create<FileStore>((set, get) => ({
  ...initialState,

  addFiles: (newFiles) => {
    set((state) => ({ files: [...state.files, ...newFiles] }))
  },

  replaceFiles: (newFiles) => {
    const { files, mergedPdfUrl } = get()
    for (const f of files) {
      URL.revokeObjectURL(f.thumbnailUrl)
    }
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl)
    }
    set({ files: newFiles, mergedPdfUrl: null, mergedPdfBytes: null })
  },

  removeFile: (id) => {
    const file = get().files.find((f) => f.id === id)
    if (file) {
      URL.revokeObjectURL(file.thumbnailUrl)
    }
    set((state) => ({ files: state.files.filter((f) => f.id !== id) }))
  },

  reorderFiles: (files) => {
    set({ files })
  },

  rotateFile: (id) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, rotation: ((f.rotation + 90) % 360) as 0 | 90 | 180 | 270 } : f
      ),
    }))
  },

  setMergedPdf: (url, bytes) => {
    set({ mergedPdfUrl: url, mergedPdfBytes: bytes })
  },

  reset: () => {
    const { files, mergedPdfUrl } = get()
    for (const f of files) {
      URL.revokeObjectURL(f.thumbnailUrl)
    }
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl)
    }
    set({ ...initialState })
  },
}))
