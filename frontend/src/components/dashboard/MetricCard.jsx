import { motion } from 'framer-motion';

export default function MetricCard({ title, value, icon, delay = 0, colorClass = "text-indigo-400" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-panel p-5 rounded-3xl relative overflow-hidden group hover:bg-white/10 transition-all duration-300 flex flex-col justify-between h-full hover:border-white/20 hover:shadow-glow"
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        <div className={`p-2 rounded-2xl bg-white/5 border border-white/10 ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      
      <div className="relative z-10 mt-4">
        <div className={`text-3xl font-black ${colorClass} text-glow tracking-tight`}>
          {value}
        </div>
      </div>
    </motion.div>
  );
}
