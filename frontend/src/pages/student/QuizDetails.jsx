import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Clock, FileText, Target, RefreshCw, Rocket, Folder, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function QuizDetails() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  const fetchQuizDetails = async () => {
    try {
      const data = await api.getQuiz(quizId);
      setQuiz(data);
    } catch (err) {
      toast.error('Failed to load quiz details');
      navigate('/quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.error('Cannot start a quiz with no questions.');
      return;
    }
    try {
      setIsStarting(true);
      const attempt = await api.startAttempt(quizId);
      navigate(`/quizzes/${quizId}/attempt/${attempt.id}`);
    } catch (err) {
      toast.error('Failed to start quiz');
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz) return null;

  const hasQuestions = quiz.questions && quiz.questions.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <Link to="/quizzes" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[var(--color-primary)] transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back to Quizzes
      </Link>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#312E81] via-[#4F46E5] to-[#6366F1] p-10 md:p-14 text-center shadow-xl flex flex-col items-center justify-center min-h-[280px]"
      >
        {/* Geometric Mesh Pattern SVG */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Folder className="w-3.5 h-3.5" /> Programming
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            {quiz.title}
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {quiz.description || 'Test your knowledge with this comprehensive assessment.'}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Questions', value: quiz.questions?.length || 0, color: 'text-blue-600', bg: 'bg-blue-100' },
          { icon: Clock, label: 'Duration', value: `${quiz.duration_minutes || 30}m`, color: 'text-amber-600', bg: 'bg-amber-100' },
          { icon: Target, label: 'Pass Req.', value: `${quiz.passing_score || 50}%`, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { icon: RefreshCw, label: 'Max Attempts', value: quiz.max_attempts || 'Unlimited', color: 'text-purple-600', bg: 'bg-purple-100' }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-amber-50 rounded-2xl p-6 border-l-4 border-amber-500"
      >
        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Instructions
        </h3>
        <ul className="space-y-3">
          {[
            'Ensure you have a stable internet connection before starting.',
            'The timer cannot be paused once the assessment begins.',
            'You can navigate freely between questions during the attempt.',
            'The quiz will auto-submit when the timer expires.'
          ].map((text, i) => (
            <li key={i} className="flex items-start text-amber-800">
              <span className="mr-2 text-amber-500 mt-0.5">✦</span>
              {text}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Start Action */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        {hasQuestions ? (
          <button
            onClick={handleStartQuiz}
            disabled={isStarting}
            className="w-full relative group overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] hover:to-[var(--color-primary-light)] text-white rounded-2xl py-5 flex items-center justify-center text-xl font-bold shadow-sm hover:shadow-glow transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {isStarting ? (
               <div className="flex space-x-2 items-center justify-center">
                 <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            ) : (
              <>
                <Rocket className="w-6 h-6 mr-3 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Start Assessment
              </>
            )}
          </button>
        ) : (
          <div className="w-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl py-6 text-center">
            <p className="text-red-500 font-bold">This quiz has no questions yet.</p>
            <p className="text-sm text-slate-500 mt-1">Please check back later when the instructor has added content.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
