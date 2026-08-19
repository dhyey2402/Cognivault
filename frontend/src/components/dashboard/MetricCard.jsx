import { motion } from 'framer-motion';

export default function MetricCard({ title, value, icon, delay = 0, colorClass = "text-indigo-400" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className={`text-3xl font-black ${colorClass} text-glow mb-1`}>
          {value}
        </div>
      </div>
    </motion.div>
  );
}
