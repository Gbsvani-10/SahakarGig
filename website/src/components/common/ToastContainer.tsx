import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
        };

        const borderStyles = {
          success: 'border-emerald-200 bg-white shadow-lg',
          error: 'border-red-200 bg-white shadow-lg',
          warning: 'border-amber-200 bg-white shadow-lg',
          info: 'border-blue-200 bg-white shadow-lg'
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-xl border ${borderStyles[t.type]} transition-all animate-in slide-in-from-bottom-2`}
          >
            <div className="flex items-start gap-3">
              {icons[t.type]}
              <div>
                <p className="text-xs font-bold text-gray-900">{t.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{t.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
