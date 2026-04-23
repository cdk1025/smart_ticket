import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useFileStore } from '../store/useFileStore'
import { generateThumbnail } from '../utils/thumbnailGenerator'
import type { UploadedFile } from '../types'

interface FileUploaderProps {
  onFilesAdded?: () => void
}

const ACCEPT = '.pdf,.jpg,.jpeg,.png'
const VALID_EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png'])

export default function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const addFiles = useFileStore((s) => s.addFiles)

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setErrorMsg(null)
      const allFiles = Array.from(fileList)
      const files = allFiles.filter((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
        return VALID_EXTENSIONS.has(ext)
      })

      const rejected = allFiles.length - files.length
      if (files.length === 0) {
        if (rejected > 0) {
          setErrorMsg('不支持的文件格式，请上传 PDF、JPG 或 PNG 文件')
        }
        return
      }
      if (rejected > 0) {
        setErrorMsg(`已忽略 ${rejected} 个不支持的文件`)
      }

      setIsProcessing(true)
      try {
        const uploadedFiles: UploadedFile[] = await Promise.all(
          files.map(async (file) => {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
            const type = ext === 'pdf' ? 'pdf' : 'image'
            const thumbnailUrl = await generateThumbnail(file)
            return {
              id: crypto.randomUUID(),
              file,
              name: file.name,
              type,
              thumbnailUrl,
              rotation: 0,
            } as UploadedFile
          })
        )

        addFiles(uploadedFiles)
        onFilesAdded?.()
        navigate('/editor')
      } catch (err) {
        console.error('Failed to process files:', err)
      } finally {
        setIsProcessing(false)
      }
    },
    [addFiles, navigate, onFilesAdded]
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = ''
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative min-h-50 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {isProcessing ? (
        <>
          <div className="i-carbon-renew w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-500">正在处理文件…</p>
        </>
      ) : (
        <>
          <svg
            className="w-12 h-12 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 16V4m0 0l-4 4m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
            />
          </svg>
          <p className="text-base text-gray-600 font-medium">
            拖拽文件到此处，或点击上传
          </p>
          <p className="text-xs text-gray-400">支持 PDF、JPG、PNG 格式</p>
        </>
      )}

      {errorMsg && (
        <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-red-500 font-medium">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
