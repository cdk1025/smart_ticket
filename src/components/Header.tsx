import { useNavigate } from 'react-router'
import Logo from './Logo'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="h-13 flex items-center border-b border-gray-200 bg-white/95 backdrop-blur px-4 shrink-0">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="hover:opacity-80 transition-opacity"
      >
        <Logo />
      </button>
    </header>
  )
}
