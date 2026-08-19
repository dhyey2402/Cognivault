import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, EyeOff } from 'lucide-react';

export default function AttentionCenter({ items }) {
  const hasItems = items && (items.drafts?.length > 0 || items.low_scores?.length > 0 || items.zero_attempts?.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="glass-panel p-6 rounded-3xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Attention Center
        </h2>
      </div>

      <div className="space-y-3">
        {hasItems ? (
          <>
            {items.low_scores?.map((name, idx) => (
              <div key={`low-${idx}`} className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-rose-200">Low Average Score</div>
                  <div className="text-xs text-rose-300/80 mt-1">"{name}" has an unusually low average score. Consider reviewing question difficulty.</div>
                </div>
              </div>
            ))}
            
            {items.zero_attempts?.map((name, idx) => (
              <div key={`zero-${idx}`} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-amber-200">No Participation</div>
                  <div className="text-xs text-amber-300/80 mt-1">"{name}" is published but has 0 attempts. Consider promoting it.</div>
                </div>
              </div>
            ))}

            {items.drafts?.map((name, idx) => (
              <div key={`draft-${idx}`} className="flex items-start gap-3 p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                <EyeOff className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-slate-200">Draft Quiz</div>
                  <div className="text-xs text-slate-400 mt-1">"{name}" is currently in draft mode and invisible to students.</div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
              <Info className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-slate-300 font-medium text-sm">All clear.</p>
            <p className="text-slate-500 text-xs mt-1">No items require immediate attention.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
