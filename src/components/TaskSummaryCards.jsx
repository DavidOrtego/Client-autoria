import React from 'react';
import { ClipboardList, ArrowUpRight, CheckCircle2, Home } from 'lucide-react';

const TaskSummaryCards = ({ pendingTasks, myPendingTasks, myTasks, tasks }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="glass-card relative overflow-hidden flex flex-col gap-1 rounded-3xl p-6 bg-gradient-to-br from-brand-teal/5 to-transparent border-brand-teal/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-teal">
          <ClipboardList size={80} />
        </div>
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Pending</span>
        <span className="font-outfit text-4xl font-black text-slate-900 mt-2">
          {pendingTasks.length}
        </span>
        <div className="mt-4 flex items-center gap-2 text-brand-teal text-sm font-bold bg-brand-teal/10 w-fit px-3 py-1 rounded-full">
          <ArrowUpRight size={16} />
          <span>Across all houses</span>
        </div>
      </div>

      <div className="glass-card relative overflow-hidden flex flex-col gap-1 rounded-3xl p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
          <CheckCircle2 size={80} />
        </div>
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">My Pending Tasks</span>
        <span className="font-outfit text-4xl font-black text-slate-900 mt-2">
          {myPendingTasks.length}
        </span>
        <div className="mt-4 flex items-center gap-2 text-indigo-600 text-sm font-bold bg-indigo-50 w-fit px-3 py-1 rounded-full">
          <span>{myTasks.length} total assigned to me</span>
        </div>
      </div>

      <div className="glass-card hidden lg:flex relative overflow-hidden flex-col gap-1 rounded-3xl p-6 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
          <Home size={80} />
        </div>
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Houses</span>
        <span className="font-outfit text-4xl font-black text-slate-900 mt-2">
          {[...new Set(tasks.map(t => t.id_house))].length}
        </span>
        <p className="text-slate-400 text-sm mt-4">Houses with active tasks</p>
      </div>
    </div>
  );
};

export default TaskSummaryCards;
