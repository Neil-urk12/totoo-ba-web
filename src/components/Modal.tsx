import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  maxWidth?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, maxWidth = '600px', children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-[90vw] max-h-[90vh] sm:max-h-[85vh]"
        style={{ maxWidth: `min(90vw, ${maxWidth})` }}
      >
        <div className="m-0 sm:m-0 rounded-t-2xl sm:rounded-2xl border border-app bg-card shadow-xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]" role="document">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-app shrink-0">
            <h2 id="modal-title" className="font-semibold text-base sm:text-lg">{title}</h2>
            <button
              type="button"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden space-y-4 sm:space-y-6 flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
