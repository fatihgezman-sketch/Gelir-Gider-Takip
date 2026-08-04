import React, { useEffect } from 'react';
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
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyles =
    toast.type === 'success'
      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
      : toast.type === 'error'
      ? 'bg-rose-600 text-white shadow-rose-900/30'
      : 'bg-slate-800 text-slate-100 dark:bg-slate-700 shadow-slate-900/40 border border-slate-600';

  const icon =
    toast.type === 'success' ? (
      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />
    ) : toast.type === 'error' ? (
      <AlertCircle className="w-5 h-5 shrink-0 text-rose-200" />
    ) : (
      <Info className="w-5 h-5 shrink-0 text-amber-400" />
    );

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${bgStyles}`}
    >
      <div className="flex items-center gap-2.5 text-sm font-medium">
        {icon}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Kapat"
      >
        <X className="w-4 h-4 opacity-80" />
      </button>
    </div>
  );
};
