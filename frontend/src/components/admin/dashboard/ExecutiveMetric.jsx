import { motion } from 'framer-motion';

export default function ExecutiveMetric({ title, value, subtitle, icon, delay = 0, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)] transition-all duration-300 border border-white/10"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
          <div className="text-3xl font-black text-white text-glow mb-1">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-400 font-medium">{subtitle}</div>
          )}
        </div>
        
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="relative z-10 mt-4 flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend.isPositive ? 'bg-emerald-500/20 text-emerald-400' : trend.isNeutral ? 'bg-slate-500/20 text-slate-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {trend.value}
          </span>
          <span className="text-xs text-slate-500">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
