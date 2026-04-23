import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-gray-100 bg-white py-4 px-4 text-center">
      <p className="text-xs text-gray-500 mb-1">
        © 2026 智票合&nbsp;&nbsp;保留所有权利
      </p>
      <p className="text-xs text-gray-400 mb-1">
        <Link to="/privacy" className="hover:text-gray-600 hover:underline">隐私政策</Link>
        <span className="mx-2">|</span>
        <Link to="/disclaimer" className="hover:text-gray-600 hover:underline">免责声明</Link>
        <span className="mx-2">|</span>
        <a href="https://github.com/cdk1025/smart_ticket" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 hover:underline">GitHub</a>
        <span className="mx-2">|</span>
        <a href="https://linux.do/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">LINUX DO</a>
      </p>
      <p className="text-xs text-gray-400">
        🔒 所有文件仅在浏览器本地处理，绝不上传服务器
      </p>
    </footer>
  )
}
