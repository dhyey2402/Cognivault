import { motion } from 'framer-motion';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContinueLearning({ recentAttempts }) {
  // Try to find an attempt that the user failed to suggest re-taking, 
  // or just the most recent one.
  const targetAttempt = recentAttempts?.find(a => a.percentage < (a.passing_score || 50)) 
    || recentAttempts?.[0];

  if (!targetAttempt) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.4 }}
      className="glass-panel-strong p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between h-full min-h-[220px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-400/30 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30 backdrop-blur-md">
            Continue Learning
          </span>
        </div>
        <h3 className="text-2xl font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
          {targetAttempt.quiz_title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md"><BookOpen className="w-4 h-4 text-indigo-400" /> {targetAttempt.category_name || 'General'}</span>
          <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md"><Clock className="w-4 h-4 text-purple-400" /> Score: {targetAttempt.percentage}%</span>
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
        <Link 
          to={`/quizzes/${targetAttempt.quiz_id}`}
          className="w-full py-3 bg-white/5 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-sm hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/10 hover:border-indigo-400"
        >
          <PlayCircle className="w-5 h-5" /> Jump Back In
        </Link>
      </div>
    </motion.div>
  );
}
