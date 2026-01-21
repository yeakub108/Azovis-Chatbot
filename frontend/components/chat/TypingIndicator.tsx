export default function TypingIndicator() {
  return (
    <div className="px-5 pb-3 animate-fade-in">
      <div className="flex gap-1 p-3 sm:p-4 bg-gray-100 rounded-2xl rounded-bl-sm w-fit">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-typing"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  )
}
