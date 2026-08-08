import React from 'react';

/**
 * CareerPilot Brand Mark
 * Clean, human, minimalist career direction symbol.
 * Combines a journey anchor point with a forward upward trajectory arrow.
 * 
 * @param {number} size - Logo icon diameter (px), defaults to 38
 * @param {boolean} showWordmark - Whether to display "CareerPilot" text beside mark
 * @param {string} className - Optional container classes
 * @param {string} wordmarkClassName - Optional text classes
 * @param {function} onClick - Click handler
 */
export const CareerPilotLogo = ({
  size = 38,
  showWordmark = true,
  className = '',
  wordmarkClassName = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${onClick ? 'cursor-pointer select-none' : ''} ${className}`}
    >
      {/* Clean Career Direction Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="CareerPilot Logo"
      >
        {/* Friendly rounded container badge */}
        <rect x="2" y="2" width="36" height="36" rx="10" fill="#161B22" stroke="#30363D" strokeWidth="1.5" />
        <rect x="2" y="2" width="36" height="36" rx="10" fill="#3B82F6" fillOpacity="0.12" />

        {/* Minimalist career trajectory arrow forming subtle 'C' */}
        <path
          d="M 13 27 C 13 27 16 16 26 14 M 26 14 H 19 M 26 14 V 21"
          stroke="#3B82F6"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Starting journey anchor point */}
        <circle cx="13" cy="27" r="2.5" fill="#60A5FA" />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <span className={`font-extrabold tracking-tight text-white flex items-center ${wordmarkClassName || 'text-xl sm:text-2xl'}`}>
          Career<span className="text-blue-500">Pilot</span>
        </span>
      )}
    </div>
  );
};
