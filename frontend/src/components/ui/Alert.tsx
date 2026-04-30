import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
  isVisible: boolean;
}

export const Alert: React.FC<AlertProps> = ({ type, message, isVisible }) => {
  const styles = {
    error: 'text-red-800 bg-red-50 border-red-200',
    success: 'text-green-800 bg-green-50 border-green-200',
    info: 'text-blue-800 bg-blue-50 border-blue-200',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />,
    info: <Info className="w-5 h-5 mr-2 flex-shrink-0" />,
  };

  return (
    <div className={`transition-all duration-300 overflow-hidden ${isVisible ? 'max-h-24 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
      <div className={`flex items-center p-3 text-sm rounded-lg border ${styles[type]}`}>
        {icons[type]}
        <span>{message}</span>
      </div>
    </div>
  );
};
