import React from 'react';
import { PiggyBank } from 'lucide-react';

const Expenses = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold text-slate-900 flex items-center gap-3">
            <PiggyBank className="text-brand-teal" size={36} />
            Expenses
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track shared house expenses.
          </p>
        </div>
      </div>
      
      {/* Contenido en los próximos commits */}
      
    </div>
  );
};

export default Expenses;