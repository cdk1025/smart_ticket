import type { UploadedFile } from '../types'

interface FileThumbnailProps {
  file: UploadedFile
  onRemove: (id: string) => void
  onRotate: (id: string) => void
  dragHandleProps?: Record<string, unknown>
}

export default function FileThumbnail({
  file,
  onRemove,
  onRotate,
  dragHandleProps,
}: FileThumbnailProps) {
  return (
    <div className="relative flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Drag handle */}
      <div
        className="absolute top-2 left-2 z-10 cursor-grab rounded-md bg-white/80 p-1 text-gray-400 hover:text-gray-600 hover:bg-white active:cursor-grabbing"
        {...dragHandleProps}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>

      {/* Thumbnail */}
      <div className="flex items-center justify-center h-40 bg-gray-50 p-2 overflow-hidden">
        <img
          src={file.thumbnailUrl}
          alt={file.name}
          className="max-h-full max-w-full object-contain"
          style={{ transform: `rotate(${file.rotation}deg)` }}
          draggable={false}
        />
      </div>

      {/* File name */}
      <div className="px-3 py-2 border-t border-gray-50">
        <p className="truncate text-xs text-gray-700" title={file.name}>
          {file.name}
        </p>
      </div>

      {/* Actions */}
      <div className="flex border-t border-gray-100">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          onClick={() => onRotate(file.id)}
          title="旋转"
        >
          <span className="text-sm">↻</span>
          旋转
        </button>
        <div className="w-px bg-gray-100" />
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          onClick={() => onRemove(file.id)}
          title="删除"
        >
          <span className="text-sm">✕</span>
          删除
        </button>
      </div>
    </div>
  )
}
