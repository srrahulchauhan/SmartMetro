import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, BellRing, X, Train } from 'lucide-react';
import { useMetro } from '../../context/MetroContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useMetro();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'alert':
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'scan':
        return <Train className="w-5 h-5 text-indigo-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getBgBorder = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-white/95 dark:bg-slate-900/95 shadow-emerald-500/10';
      case 'alert':
        return 'border-amber-500/40 bg-amber-50/95 dark:bg-slate-900/95 shadow-amber-500/20';
      case 'scan':
        return 'border-indigo-500/40 bg-indigo-50/95 dark:bg-slate-900/95 shadow-indigo-500/20';
      default:
        return 'border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-slate-900/10';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl ${getBgBorder(toast.type)}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
