import { motion } from 'framer-motion';
import { Clock, CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActivityTimeline({ attempts }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
      className="glass-panel p-6 rounded-3xl flex flex-col flex-1 min-h-[400px] group hover:border-white/20 transition-all duration-300"
    >
      <div className="pb-4 mb-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Recent Activity
        </h2>
        <Link to="/history" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors">
          See all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 dark-scrollbar">
        {attempts && attempts.length > 0 ? (
          attempts.map((attempt, index) => (
            <Link 
              key={attempt.id || index} 
              to={`/results/${attempt.id}`}
              className="block p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">{attempt.quiz_title}</h3>
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                  attempt.percentage >= (attempt.passing_score || 50) 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {attempt.percentage}%
                  {attempt.percentage >= (attempt.passing_score || 50) ? <CheckCircle2 className="w-3 h-3" /> : <span className="font-serif">×</span>}
                </div>
              </div>
              <div className="flex items-center text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                {new Date(attempt.completed_at || attempt.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
              </div>
            </Link>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 rotate-3 border border-white/10">
              <PlayCircle className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">No recent attempts</p>
            <Link to="/quizzes" className="mt-4 px-4 py-2 bg-indigo-600/80 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-colors inline-block backdrop-blur-sm border border-indigo-500/50">
              Browse Quizzes
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
