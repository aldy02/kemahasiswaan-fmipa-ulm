import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessModal({ isOpen, message, onOk, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-1 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-succes-4" strokeWidth={1.8} />
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-[17px] font-bold text-primary-1 mb-6">{message}</p>

        {/* OK button */}
        <button
          onClick={onOk}
          className="w-full py-3 bg-succes-2 hover:bg-succes-3 active:bg-succes-3 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
}