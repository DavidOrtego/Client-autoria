import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorBanner = ({ mensaje }) => {
  if (!mensaje) return null;

  return (
    <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-2xl px-4 py-3">
      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
      <span>{mensaje}</span>
    </div>
  );
};

export default ErrorBanner;
