import React from 'react';
import { Breadcrumb } from './Breadcrumb';

export const PageHeader = ({ 
  title, 
  subtitle, 
  badge, 
  actions, 
  backTo, 
  backLabel = "Back to Dashboard", 
  onBack 
}) => {
  return (
    <div className="space-y-3 pb-6 border-b border-[#30363D]">
      {(onBack || backTo) && (
        <Breadcrumb to={backTo} label={backLabel} onCustomBack={onBack} />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>{title}</span>
            {badge && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 font-mono font-medium">
                {badge}
              </span>
            )}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-10 space-y-8 animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};
