import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { saveAs } from 'file-saver'
import { useFileStore } from '../store/useFileStore'
import aliPay from '../assets/ali_pay.jpg'
import wxPay from '../assets/wx_pay.png'

export default function ResultPage() {
  const navigate = useNavigate()
  const mergedPdfUrl = useFileStore((s) => s.mergedPdfUrl)
  const mergedPdfBytes = useFileStore((s) => s.mergedPdfBytes)
  const reset = useFileStore((s) => s.reset)

  useEffect(() => {
    if (!mergedPdfUrl) {
      navigate('/')
    }
  }, [mergedPdfUrl, navigate])

  if (!mergedPdfUrl) return null

  const handleDownload = () => {
    if (!mergedPdfBytes) return
    const blob = new Blob([mergedPdfBytes as BlobPart], { type: 'application/pdf' })
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    saveAs(blob, `智票合_merged_${y}${m}${d}.pdf`)
  }

  const handleRestart = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="flex flex-col md:flex-row md:h-full gap-4 p-4 bg-gray-50">
      {/* Left: PDF Preview */}
      <div className="h-[60vh] md:h-auto md:flex-1 min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <iframe
          src={mergedPdfUrl}
          className="w-full h-full"
          title="PDF Preview"
        />
      </div>

      {/* Right: Action Panel */}
      <div className="shrink-0 md:w-72 flex flex-col items-center justify-center gap-5 py-4 md:py-0">
        {/* Success Icon & Title */}
        <div className="text-center">
          <div className="mb-2 inline-flex items-center justify-center rounded-full bg-green-100 p-3">
            <svg className="h-7 w-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">合并完成</h1>
          <p className="mt-1 text-sm text-gray-500">您的 PDF 已准备就绪</p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col items-center gap-2.5 px-2">
          <button
            onClick={handleDownload}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 md:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            下载 PDF
          </button>

          <button
            onClick={() => navigate('/editor')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 md:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            返回编辑
          </button>

          <button
            onClick={handleRestart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 md:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            重新开始
          </button>
        </div>

        {/* Donate Section */}
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">☕ 打赏支持</p>
          <div className="flex gap-3 justify-center">
            <div className="text-center">
              <img src={aliPay} alt="支付宝" className="w-20 h-20 rounded-lg border border-gray-200" />
              <p className="text-xs text-gray-400 mt-1">支付宝</p>
            </div>
            <div className="text-center">
              <img src={wxPay} alt="微信支付" className="w-20 h-20 rounded-lg border border-gray-200" />
              <p className="text-xs text-gray-400 mt-1">微信支付</p>
            </div>
          </div>
        </div>

        {/* Privacy Reminder */}
        <p className="text-center text-xs text-gray-400">
          🔒 您的文件仅在本地处理，未上传至任何服务器
        </p>
      </div>
    </div>
  )
}
