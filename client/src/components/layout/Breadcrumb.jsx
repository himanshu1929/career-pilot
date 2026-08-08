import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Breadcrumb = ({ to = '/app/dashboard', label = 'Back to Dashboard', onCustomBack }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onCustomBack) {
      onCustomBack();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer mb-2"
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};
