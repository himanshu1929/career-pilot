import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideInRight">
      <div className="glass-card rounded-2xl px-5 py-4 border border-cyan-500/30 bg-slate-900/90 text-white shadow-2xl shadow-cyan-500/10 flex items-center gap-3 max-w-sm backdrop-blur-xl">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white tracking-tight">Resume Already Analyzed</div>
          <div className="text-[11px] text-slate-300 truncate mt-0.5">{message}</div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
