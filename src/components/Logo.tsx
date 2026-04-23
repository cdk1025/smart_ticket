export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        width="28"
        height="28"
      >
        <rect width="64" height="64" rx="14" fill="#2563eb" />
        <rect x="20" y="8" width="26" height="34" rx="3" fill="white" opacity="0.4" />
        <rect x="16" y="13" width="26" height="34" rx="3" fill="white" opacity="0.9" />
        <line x1="21" y1="21" x2="37" y2="21" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <line x1="21" y1="26" x2="34" y2="26" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <line x1="21" y1="31" x2="36" y2="31" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d="M32 44 L32 56" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M27 51 L32 56 L37 51" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-lg font-bold text-blue-600">智票合</span>
    </div>
  )
}
