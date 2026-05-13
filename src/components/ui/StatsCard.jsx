import React from 'react';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconColor,
  tagBg = "bg-white/50",
  hiddenOnMobile = false
}) => {
  return (
    <div className={`glass-card ${hiddenOnMobile ? 'hidden lg:flex' : 'flex'} relative overflow-hidden flex-col gap-1 rounded-3xl p-6 bg-linear-to-br ${gradient} border-slate-200/10`}>
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${iconColor}`}>
        {Icon && <Icon size={80} />}
      </div>
      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
      <span className="font-outfit text-4xl font-black text-slate-900 mt-2">
        {value}
      </span>
      {subtitle && (
        <div className={`mt-4 flex items-center gap-2 text-sm font-bold w-fit px-3 py-1 rounded-full ${iconColor} ${tagBg} backdrop-blur-sm`}>
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
