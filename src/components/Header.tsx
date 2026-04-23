import { useNavigate } from 'react-router'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="h-13 flex items-center border-b border-gray-200 bg-white/95 backdrop-blur px-4 shrink-0">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors tracking-tight"
      >
        智票合
      </button>
    </header>
  )
}
