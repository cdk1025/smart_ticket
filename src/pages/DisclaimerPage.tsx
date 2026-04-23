import { Link } from 'react-router'

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">免责声明</h1>

      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>本工具按"现状"提供，不作任何明示或暗示的保证。</li>
        <li>用户应自行承担使用本工具的风险。</li>
        <li>开发者不对因使用本工具导致的任何直接或间接损失承担责任。</li>
        <li>本工具生成的 PDF 文件仅供参考，用户应自行核实内容的准确性。</li>
        <li>开发者保留随时修改、暂停或终止服务的权利。</li>
        <li>本工具仅供合法用途使用。</li>
      </ul>

      <div className="border-t border-gray-200 pt-4 mt-8">
        <p className="text-sm text-gray-500">© 2026 智票合。保留所有权利。</p>
      </div>

      <Link to="/" className="inline-block mt-6 text-blue-600 hover:underline text-sm">
        ← 返回首页
      </Link>
    </div>
  )
}
