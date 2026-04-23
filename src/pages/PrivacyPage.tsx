import { Link } from 'react-router'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">隐私政策</h1>
      <p className="text-sm text-gray-400 mb-6">最后更新日期：2026年4月23日</p>

      <p className="mb-4 text-gray-700">
        感谢您使用智票合。我们高度重视您的隐私安全，以下是我们的隐私政策说明：
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>本工具不收集任何用户个人信息。</li>
        <li>所有文件仅在用户浏览器本地处理，不会上传至任何服务器。</li>
        <li>不使用 Cookie 追踪用户行为。</li>
        <li>不保存、不传输、不存储任何用户上传的文件。</li>
        <li>本工具不包含任何第三方分析或广告追踪代码。</li>
        <li>用户关闭浏览器后，所有处理过的文件数据将自动清除。</li>
      </ul>

      <h2 className="text-lg font-semibold mb-3 text-gray-800">联系我们</h2>
      <p className="mb-8 text-gray-700">
        如有任何疑问或建议，请通过{' '}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          GitHub Issues
        </a>{' '}
        与我们联系。
      </p>

      <Link to="/" className="inline-block text-blue-600 hover:underline text-sm">
        ← 返回首页
      </Link>
    </div>
  )
}
