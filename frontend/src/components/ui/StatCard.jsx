import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon, bg, trend, trendLabel, delay = 0 }) {
  const getTrendColor = () => {
    if (!trend) return '';
    return trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-2xl shadow-card p-6 flex items-center space-x-4 border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
    >
      <div className={`p-4 rounded-full ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
        {trendLabel && (
          <p className={`text-xs font-medium mt-1 ${getTrendColor()}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendLabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}
