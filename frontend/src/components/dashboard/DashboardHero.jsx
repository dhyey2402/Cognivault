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
    <div className="glass-panel-strong rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 h-full z-10 group hover:shadow-glow transition-all duration-500">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl opacity-60 group-hover:opacity-80 group-hover:bg-indigo-400/30 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-all duration-700"></div>
      
      <div className="relative z-10 flex-1">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-3">
          <h1 className="text-4xl font-black text-white tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name?.split(' ')[0]}</span>
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-slate-300 text-lg max-w-xl leading-relaxed font-light"
        >
          {getInsightMessage()}
        </motion.p>
      </div>

      <form onSubmit={handleJoinQuiz} className="relative z-10 w-full md:w-auto min-w-[340px]">
        <div className="bg-white/5 p-2 rounded-2xl border border-white/10 flex items-center shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all backdrop-blur-md group-hover:bg-white/10">
          <div className="pl-4 pr-3 text-indigo-300"><LogIn size={22} /></div>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="ENTER QUIZ CODE"
            className="bg-transparent border-none outline-none flex-1 py-3 font-mono uppercase tracking-wider text-white placeholder-slate-400 font-bold"
            maxLength={10}
          />
          <button 
            type="submit"
            disabled={!joinCode.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </form>
    </div>
  );
}
