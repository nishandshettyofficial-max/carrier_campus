import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-4 shadow-lg transition-all animate-slide-up ${
              isSuccess
                ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                : isError
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : 'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
              {isError && <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="h-4 w-4 text-blue-400 flex-shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
