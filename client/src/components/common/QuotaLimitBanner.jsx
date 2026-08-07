import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export const QuotaLimitBanner = ({ message, onRetry, onBack }) => {
  return (
    <div className="bg-[#161B22] rounded-xl p-6 border-2 border-amber-500/40 space-y-4 shadow-xl animate-fadeIn">
      <div className="flex items-center gap-3 text-amber-400">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Temporary Service Limit Reached</h3>
          <p className="text-xs text-gray-400">Gemini API usage limit reached.</p>
        </div>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed">
        {message || 'The AI service is temporarily unavailable. Please try again in a few minutes.'}
      </p>

      {(onRetry || onBack) && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#30363D]">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Analysis
            </button>
          )}

          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-[#0D1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Form
            </button>
          )}
        </div>
      )}
    </div>
  );
};
