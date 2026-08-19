import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function LearningEcosystem({ categories }) {
  // Sort categories by attempts (popularity)
  const sortedCategories = [...(categories || [])].sort((a, b) => b.attempts - a.attempts).slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-panel p-6 rounded-3xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Learning Ecosystem
        </h2>
      </div>

      <div className="space-y-5">
        {sortedCategories.length > 0 ? (
          sortedCategories.map((cat, idx) => {
            // Determine health color based on average score
            let healthColor = 'bg-emerald-400';
            let barColor = 'bg-emerald-500/20';
            if (cat.average_score < 60) {
              healthColor = 'bg-rose-400';
              barColor = 'bg-rose-500/20';
            } else if (cat.average_score < 75) {
              healthColor = 'bg-amber-400';
              barColor = 'bg-amber-500/20';
            }

            return (
              <div key={idx} className="group">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-bold text-slate-200">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">{cat.attempts} attempts</span>
                    <span className={`text-xs font-black ${healthColor.replace('bg-', 'text-')}`}>
                      {cat.average_score}%
                    </span>
                  </div>
                </div>
                <div className={`h-2 w-full rounded-full ${barColor} overflow-hidden`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.average_score}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className={`h-full rounded-full ${healthColor} shadow-[0_0_10px_currentColor]`}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-slate-500 text-sm">
            No category data available.
          </div>
        )}
      </div>
    </motion.div>
  );
}
