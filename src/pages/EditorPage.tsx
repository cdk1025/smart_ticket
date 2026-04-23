import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useFileStore } from '../store/useFileStore'
import { mergeFiles } from '../utils/pdfMerger'
import { generateThumbnail } from '../utils/thumbnailGenerator'
import SortableFileList from '../components/SortableFileList'
import type { UploadedFile } from '../types'

const ACCEPT = '.pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf'

export default function EditorPage() {
  const navigate = useNavigate()
  const files = useFileStore((s) => s.files)
  const isMerging = useFileStore((s) => s.isMerging)
  const addFiles = useFileStore((s) => s.addFiles)
  const removeFile = useFileStore((s) => s.removeFile)
  const reorderFiles = useFileStore((s) => s.reorderFiles)
  const rotateFile = useFileStore((s) => s.rotateFile)
  const setMergedPdf = useFileStore((s) => s.setMergedPdf)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Guard: redirect if no files
  useEffect(() => {
    if (files.length === 0) {
      navigate('/', { replace: true })
    }
  }, [files.length, navigate])

  const handleAddMore = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFilesSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files
      if (!selected || selected.length === 0) return

      const newFiles: UploadedFile[] = []
      for (const file of Array.from(selected)) {
        const thumbnailUrl = await generateThumbnail(file)
        const type = file.type === 'application/pdf' ? 'pdf' : 'image'
        newFiles.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          type,
          thumbnailUrl,
          rotation: 0,
        })
      }
      addFiles(newFiles)
      // Reset input so same file can be re-selected
      e.target.value = ''
    },
    [addFiles]
  )

  const handleMerge = useCallback(async () => {
    if (isMerging || files.length === 0) return
    useFileStore.setState({ isMerging: true })
    try {
      const bytes = await mergeFiles(files)
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setMergedPdf(url, bytes)
      navigate('/result')
    } catch (err) {
      console.error('Merge failed:', err)
      alert('合并失败，请重试')
    } finally {
      useFileStore.setState({ isMerging: false })
    }
  }, [files, isMerging, setMergedPdf, navigate])

  // Don't render content if redirecting
  if (files.length === 0) return null

  return (
    <div className="bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap items-center gap-3">
          {/* File count */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            已选择 {files.length} 个文件
          </span>

          <div className="flex-1" />

          {/* Add more */}
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            onClick={handleAddMore}
            disabled={isMerging}
          >
            + 添加更多
          </button>

          {/* Merge */}
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleMerge}
            disabled={isMerging}
          >
            {isMerging && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {isMerging ? '合并中...' : '合并 PDF'}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={handleFilesSelected}
      />

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <SortableFileList
          files={files}
          onReorder={reorderFiles}
          onRemove={removeFile}
          onRotate={rotateFile}
        />
      </div>

      {/* Merge overlay */}
      {isMerging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-8 py-6 shadow-xl flex flex-col items-center gap-3">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-200 border-t-blue-600" />
            <p className="text-sm font-medium text-gray-700">正在合并文件...</p>
          </div>
        </div>
      )}
    </div>
  )
}
