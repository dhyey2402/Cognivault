import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Search, Filter, Clock, ChevronRight, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';

export default function QuizListing() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Mock categories (in a real app, fetch from backend)
  const categories = ['All', 'Programming', 'Mathematics', 'Science', 'History'];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyTheme = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return { gradient: 'from-emerald-100 to-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-500 text-white' };
      case 'MEDIUM':
        return { gradient: 'from-amber-100 to-amber-200', text: 'text-amber-700', badge: 'bg-amber-500 text-white' };
      case 'HARD':
        return { gradient: 'from-red-100 to-red-200', text: 'text-red-700', badge: 'bg-red-500 text-white' };
      default:
        return { gradient: 'from-slate-100 to-slate-200', text: 'text-slate-700', badge: 'bg-slate-500 text-white' };
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Available Quizzes</h1>
          <p className="text-slate-500">Test your knowledge across various categories.</p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <button className="p-2.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
              selectedCategory === cat
                ? 'bg-[var(--color-primary-dark)] text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quiz Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-3xl h-64 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="h-16 bg-slate-100 animate-pulse"></div>
              <div className="p-6">
                <div className="w-3/4 h-6 bg-slate-100 rounded-md animate-pulse mb-4"></div>
                <div className="w-full h-4 bg-slate-50 rounded-md animate-pulse mb-2"></div>
                <div className="w-5/6 h-4 bg-slate-50 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => {
            const theme = getDifficultyTheme(quiz.difficulty);
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={quiz.id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative"
              >
                {/* Glow behind card on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Gradient Header Strip */}
                <div className={`h-14 bg-gradient-to-br ${theme.gradient} px-5 flex items-center justify-between`}>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-widest uppercase ${theme.badge} shadow-sm`}>
                    {quiz.difficulty || 'MEDIUM'}
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${theme.text}`}>
                    <Clock className="w-3.5 h-3.5" />
                    {quiz.duration_minutes || 30} MIN
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 z-10 relative">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {quiz.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                    {quiz.description || "No description provided."}
                  </p>
                  
                  {/* Dashed divider */}
                  <div className="border-t border-dashed border-slate-200 mb-4"></div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Folder className="w-4 h-4" />
                      PROGRAMMING
                    </div>
                    <Link
                      to={`/quizzes/${quiz.id}`}
                      className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 group/btn overflow-hidden"
                    >
                      <span className="translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">Start</span>
                      <ChevronRight className="w-5 h-5 -translate-x-4 group-hover:translate-x-0 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No quizzes found</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
