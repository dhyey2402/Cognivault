import { motion } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardHero({ user, stats }) {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const handleJoinQuiz = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    navigate(`/join/${joinCode.toUpperCase()}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getInsightMessage = () => {
    if (!stats || stats.total_attempts === 0) {
      return "Welcome to your knowledge universe. Let's begin.";
    }
    
    // Logic for dynamic insights based on actual data
    if (stats.recent_attempts?.length >= 3) {
      const recentScores = stats.recent_attempts.slice(0, 3).map(a => a.percentage);
      const isImproving = recentScores[0] > recentScores[1] && recentScores[1] > recentScores[2];
      if (isImproving) return "You're building strong momentum this week.";
    }
    
    if (stats.average_score > 80) {
      return "Your conceptual accuracy is excellent. Keep challenging yourself.";
    }

    return "Your knowledge universe is evolving.";
  };

  return (
    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mb-8 z-10">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl opacity-50"></div>
      
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span>!
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-slate-300 text-lg max-w-xl leading-relaxed font-light"
        >
          {getInsightMessage()}
        </motion.p>
      </div>

      <form onSubmit={handleJoinQuiz} className="relative z-10 w-full md:w-auto min-w-[320px]">
        <div className="bg-white/5 p-2 rounded-2xl border border-white/10 flex items-center shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all backdrop-blur-sm">
          <div className="pl-3 pr-2 text-indigo-300"><LogIn size={20} /></div>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="ENTER QUIZ CODE"
            className="bg-transparent border-none outline-none flex-1 py-2 font-mono uppercase tracking-wider text-white placeholder-slate-400 font-bold"
            maxLength={10}
          />
          <button 
            type="submit"
            disabled={!joinCode.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
