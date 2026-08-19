import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopPerformers({ performers }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
      className="glass-panel p-6 rounded-3xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Top Performers
        </h2>
        <Link to="/admin/users" className="text-sm font-medium text-amber-400 hover:text-amber-300">View students</Link>
      </div>

      <div className="space-y-4">
        {performers && performers.length > 0 ? (
          performers.map((student, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  idx === 0 ? 'bg-gradient-to-br from-amber-200 to-amber-500 text-amber-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                  idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800' :
                  idx === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950' :
                  'bg-white/10 text-slate-300'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-sm">{student.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">{student.attempts} assessments</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-400">{student.average_score}%</div>
                <div className="text-[10px] text-slate-500 font-medium">Avg Score</div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium text-sm">No performance data yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
