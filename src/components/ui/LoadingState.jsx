import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 size={48} className="animate-spin text-brand-teal" />
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
