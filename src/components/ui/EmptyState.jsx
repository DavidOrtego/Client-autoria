import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  isSearch = false
}) => {
  return (
    <div className="glass-card flex flex-col items-center justify-center py-20 px-6 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-transparent">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border-2 border-dashed border-slate-200">
        {Icon && <Icon size={40} />}
      </div>
      <h3 className="font-outfit text-2xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8">
        {description}
      </p>
      {!isSearch && buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick}
          className="flex items-center gap-2 rounded-2xl bg-brand-teal px-8 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90"
        >
          <Plus size={20} />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
