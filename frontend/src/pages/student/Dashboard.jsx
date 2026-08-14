import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { motion } from 'framer-motion';
import { Target, Trophy, Clock, CheckCircle2, ArrowRight, PlayCircle, LogIn, ChevronDown, Activity, Sparkles, BookOpen } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chartFilter, setChartFilter] = useState('Last 10');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getStudentDashboard();
      setStats(data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback default values if stats are missing
  const {
    total_attempts = 0,
    average_score = 0,
    highest_score = 0,
    passed_quizzes = 0,
    recent_attempts = [],
    performance_history = []
  } = stats || {};

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-[var(--color-primary)]">{user?.name?.split(' ')[0]}</span>!
            </h1>
            <motion.div animate={{ rotate: [0, 15, -10, 15, 0] }} transition={{ duration: 1.5, repeatDelay: 5, repeat: Infinity }} className="text-3xl inline-block origin-bottom-right">👋</motion.div>
          </motion.div>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            Ready to challenge yourself today? Track your progress and join new assessments.
          </p>
        </div>

        <form onSubmit={handleJoinQuiz} className="relative z-10 w-full md:w-auto min-w-[320px]">
          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center shadow-sm focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
            <div className="pl-3 pr-2 text-slate-400"><LogIn size={20} /></div>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="ENTER QUIZ CODE"
              className="bg-transparent border-none outline-none flex-1 py-2 font-mono uppercase tracking-wider text-slate-700 placeholder-slate-400 font-bold"
              maxLength={10}
            />
            <button 
              type="submit"
              disabled={!joinCode.trim()}
              className="bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] text-white p-2.5 rounded-xl hover:shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attempted"
          value={total_attempts}
          bg="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
          icon={<Target className="w-6 h-6" />}
          delay={0.1}
        />
        <StatCard
          title="Avg Score"
          value={`${average_score}%`}
          bg="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
          icon={<Activity className="w-6 h-6" />}
          delay={0.2}
        />
        <StatCard
          title="Best Score"
          value={`${highest_score}%`}
          bg="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600"
          icon={<Trophy className="w-6 h-6" />}
          delay={0.3}
        />
        <StatCard
          title="Passed"
          value={passed_quizzes}
          bg="bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600"
          icon={<CheckCircle2 className="w-6 h-6" />}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-card border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--color-primary)]" />
              Performance Trend
            </h2>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
              {['Last 5', 'Last 10', 'All'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setChartFilter(filter)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${chartFilter === filter ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            {performance_history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performance_history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="title" 
                    tick={{fontSize: 12, fill: '#94A3B8'}} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
                  />
                  <YAxis 
                    tick={{fontSize: 12, fill: '#94A3B8'}} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748B', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary)', className: 'animate-pulse' }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No performance data yet</p>
                <p className="text-sm text-slate-400 mt-1">Take some quizzes to see your trend</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Attempts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-card border border-slate-100 flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-secondary)]" />
              Recent
            </h2>
            <Link to="/history" className="text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] flex items-center gap-1 group">
              See all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {recent_attempts.length > 0 ? (
              recent_attempts.map((attempt, index) => (
                <Link 
                  key={attempt.id} 
                  to={`/results/${attempt.id}`}
                  className="block p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{attempt.quiz_title}</h3>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                      attempt.percentage >= (attempt.passing_score || 50) 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {attempt.percentage}%
                      {attempt.percentage >= (attempt.passing_score || 50) ? <CheckCircle2 className="w-3 h-3" /> : <span className="font-serif">×</span>}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    {new Date(attempt.completed_at || attempt.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                  <PlayCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No recent attempts</p>
                <Link to="/quizzes" className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:bg-[var(--color-primary-light)] transition-colors inline-block">
                  Browse Quizzes
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions Strip */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="pt-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Browse Quizzes', icon: BookOpen, path: '/quizzes', color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' },
            { title: 'View History', icon: Clock, path: '/history', color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' },
            { title: 'Leaderboard', icon: Trophy, path: '#', color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' },
            { title: 'My Profile', icon: Target, path: '#', color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' },
          ].map((action, i) => (
            <Link key={i} to={action.path} className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 text-center hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-700 text-sm">{action.title}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
