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
      className="glass-panel p-6 rounded-3xl border border-indigo-500/30 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              Continue Learning
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {targetAttempt.quiz_title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {targetAttempt.category_name || 'General'}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Last score: {targetAttempt.percentage}%</span>
          </div>
        </div>

        <Link 
          to={`/quizzes/${targetAttempt.quiz_id}`}
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <PlayCircle className="w-5 h-5" /> Start Again
        </Link>
      </div>
    </motion.div>
  );
}
