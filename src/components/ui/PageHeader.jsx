import React from 'react';
import { Plus } from 'lucide-react';

const PageHeader = ({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  onButtonClick, 
  iconColor = "text-brand-teal" 
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-outfit text-4xl font-bold text-slate-900 flex items-center gap-3">
          {Icon && <Icon className={iconColor} size={36} />}
          {title}
        </h1>
        {description && (
          <p className="text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
      
      {buttonText && onButtonClick && (
        <button 
          onClick={onButtonClick}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 hover:shadow-xl active:scale-95"
        >
          <Plus size={20} />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default PageHeader;
