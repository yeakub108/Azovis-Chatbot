import { useEffect } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  show: boolean
  onClose: () => void
}

export default function Toast({ message, type, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 text-white p-3 sm:p-4 rounded-xl flex items-center gap-2 shadow-lg transition-all z-50 ${
        type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
      } ${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
