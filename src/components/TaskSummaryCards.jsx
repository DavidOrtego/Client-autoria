import React from 'react';
import { ClipboardList, CircleCheckBig, Home } from 'lucide-react';
import StatsCard from './ui/StatsCard';

const TaskSummaryCards = ({ pendingTasks, myPendingTasks, myTasks, tasks }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Pending"
        value={pendingTasks.length}
        subtitle="Across all houses"
        icon={ClipboardList}
        gradient="from-brand-teal/5 to-transparent"
        iconColor="text-brand-teal"
        tagBg="bg-brand-teal/10"
      />

      <StatsCard
        title="My Pending Tasks"
        value={myPendingTasks.length}
        subtitle={`${myTasks.length} total assigned to me`}
        icon={CircleCheckBig}
        gradient="from-indigo-500/5 to-transparent"
        iconColor="text-indigo-500"
        tagBg="bg-indigo-50"
      />

      <StatsCard
        title="Active Houses"
        value={[...new Set(tasks.map(t => t.id_house))].length}
        subtitle="Houses with active tasks"
        icon={Home}
        gradient="from-amber-500/5 to-transparent"
        iconColor="text-amber-500"
        hiddenOnMobile={true}
        tagBg="bg-amber-50"
      />
    </div>
  );
};

export default TaskSummaryCards;
