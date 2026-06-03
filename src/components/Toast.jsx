import { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const accent = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#f97316'
  const bg = type === 'success' ? 'bg-[#1f3a1c]' : type === 'error' ? 'bg-[#381818]' : 'bg-[#2c1200]'

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm px-4">
      <div className={`${bg} border border-white/10 shadow-2xl rounded-2xl overflow-hidden`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <div className="flex-1 text-sm text-white leading-snug">{message}</div>
          <button onClick={onClose} className="text-[#8f8f8f] hover:text-white transition-colors">×</button>
        </div>
      </div>
    </div>
  )
}
