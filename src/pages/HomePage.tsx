import FileUploader from '../components/FileUploader'

const features = [
  {
    icon: '✨',
    title: '免费无水印',
    desc: '合并PDF无任何水印，完全免费使用',
  },
  {
    icon: '🔒',
    title: '隐私安全',
    desc: '所有文件仅在浏览器本地处理，不上传服务器',
  },
  {
    icon: '📄',
    title: '智能A4排版',
    desc: '自动统一A4页面，居中适配，打印无忧',
  },
]

export default function HomePage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-3">智票合</h1>
          <p className="text-lg text-gray-500 mb-4">
            AI 一键合并，发票账单轻松打印
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600 ring-1 ring-emerald-200">
            🔒 文件仅在本地处理，不上传任何服务器
          </span>
        </div>

        {/* Upload */}
        <div className="mb-16">
          <FileUploader />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
