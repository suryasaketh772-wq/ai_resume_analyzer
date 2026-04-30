import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    success: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    error: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    info: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border shadow-sm transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
