interface ChatHeaderProps {
  onClear: () => void
}

export default function ChatHeader({ onClear }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sm:p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
          <img
            src="/images/robot.png"
            alt="Azovis AI"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900">Azovis AI Assistant</h1>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </div>
  )
}
