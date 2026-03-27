/** 确认弹窗 */
export default function Modal({
  isOpen,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDanger = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1E1324] border border-[#FF7DAF]/20 rounded-2xl w-full max-w-[320px] p-6 shadow-[0_0_40px_rgba(255,125,175,0.15)] relative overflow-hidden">
        {/* 装饰光晕 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7DAF]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

        <h3 className="text-xl font-semibold text-[#F9EDF5] mb-2 text-center relative z-10">
          {title}
        </h3>
        <p className="text-[#9B859D] text-sm text-center mb-6 relative z-10">
          {content}
        </p>

        <div className="flex flex-col space-y-3 relative z-10">
          <button
            onClick={onConfirm}
            className={`w-full py-3 rounded-full font-semibold transition-transform active:scale-95 ${
              isDanger
                ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/50'
                : 'bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] text-white shadow-[0_4px_15px_rgba(255,125,175,0.4)]'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-full text-[#9B859D] font-medium hover:bg-white/5 active:scale-95 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
