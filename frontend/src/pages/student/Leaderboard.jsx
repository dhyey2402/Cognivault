import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Trophy, Medal, Award, User, Filter, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchLeaderboard(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchLeaderboard = async (categoryId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getLeaderboard(categoryId || null);
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
      setError("Failed to load leaderboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-7 h-7 text-slate-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="font-bold text-slate-500">{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 2: return 'bg-slate-50 border-slate-200 text-slate-700';
      case 3: return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50';
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const restOfList = leaderboard.slice(3);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-indigo-500" />
            Global Leaderboard
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Compare your performance with peers and climb the ranks.</p>
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
          <Filter className="w-5 h-5 text-slate-400 ml-2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none text-slate-700 font-medium focus:ring-0 cursor-pointer w-full"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-center justify-center gap-3 text-rose-600">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium text-lg">{error}</span>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
           <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <Trophy className="w-16 h-16 text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No rankings yet</h3>
          <p className="text-slate-500 max-w-md">Complete quizzes to get ranked on the leaderboard. The more you play, the higher you climb!</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Podium for Top 3 */}
          {topThree.length > 0 && (
            <div className="flex justify-center items-end gap-2 sm:gap-6 pt-10 pb-6">
              {/* 2nd Place */}
              {topThree[1] && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="flex flex-col items-center flex-1 max-w-[200px]"
                >
                  <div className="text-slate-700 font-bold mb-2 text-center truncate w-full">{topThree[1].student_name}</div>
                  <div className="text-sm text-slate-500 mb-3 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                    {topThree[1].average_score}% Avg
                  </div>
                  <div className="w-full h-32 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-xl border-t border-x border-slate-300 relative flex justify-center">
                    <div className="absolute -top-8 bg-white p-2 rounded-full shadow-md border border-slate-200">
                      <Medal className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="mt-8 text-4xl font-black text-slate-300">2</span>
                  </div>
                </motion.div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="flex flex-col items-center flex-1 max-w-[220px] z-10"
                >
                  <div className="absolute -top-6 text-yellow-500 animate-bounce">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="text-slate-800 font-extrabold text-lg mb-2 text-center truncate w-full">{topThree[0].student_name}</div>
                  <div className="text-sm font-bold text-yellow-700 mb-3 bg-yellow-100 px-4 py-1.5 rounded-full shadow-sm border border-yellow-200">
                    {topThree[0].average_score}% Avg
                  </div>
                  <div className="w-full h-44 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-xl border-t-2 border-x border-yellow-400 relative flex justify-center shadow-[0_-10px_20px_-10px_rgba(234,179,8,0.3)]">
                    <div className="absolute -top-10 bg-white p-3 rounded-full shadow-lg border border-yellow-200">
                      <Trophy className="w-10 h-10 text-yellow-500" />
                    </div>
                    <span className="mt-12 text-6xl font-black text-yellow-300">1</span>
                  </div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="flex flex-col items-center flex-1 max-w-[200px]"
                >
                  <div className="text-slate-700 font-bold mb-2 text-center truncate w-full">{topThree[2].student_name}</div>
                  <div className="text-sm text-slate-500 mb-3 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                    {topThree[2].average_score}% Avg
                  </div>
                  <div className="w-full h-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-xl border-t border-x border-amber-300 relative flex justify-center">
                    <div className="absolute -top-7 bg-white p-2 rounded-full shadow-md border border-amber-200">
                      <Award className="w-7 h-7 text-amber-600" />
                    </div>
                    <span className="mt-6 text-4xl font-black text-amber-300/60">3</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* List for the rest */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-2 md:col-span-1 text-center">Rank</div>
              <div className="col-span-6 md:col-span-7">Student</div>
              <div className="col-span-4 text-right pr-4">Score</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.user_id} 
                  className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors border-l-4 ${
                    entry.user_id === user.id ? 'border-l-indigo-500 bg-indigo-50/50' : 'border-l-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      entry.rank <= 3 ? 'bg-slate-100' : 'text-slate-500'
                    }`}>
                      {getRankIcon(entry.rank)}
                    </div>
                  </div>
                  
                  <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      entry.user_id === user.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {entry.student_name}
                        {entry.user_id === user.id && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">You</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{entry.quizzes_completed} Quizzes Completed</div>
                    </div>
                  </div>
                  
                  <div className="col-span-4 text-right pr-4">
                    <div className="font-black text-lg text-slate-800">{entry.average_score}%</div>
                    <div className="text-xs text-slate-400">Avg Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
