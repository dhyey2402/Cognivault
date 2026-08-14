import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Share2, Lightbulb, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizResult() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const data = await api.getAttemptResult(attemptId);
      setResult(data);
      // Animate score count up
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;
      let currentStep = 0;
      const targetScore = data.percentage;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedScore(Math.round((targetScore / steps) * currentStep));
        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedScore(targetScore);
        }
      }, stepTime);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !result) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary-dark)] rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPass = result.status === 'PASSED';
  const colorTheme = isPass 
    ? { light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', fill: 'text-emerald-500', from: 'from-emerald-400', to: 'to-emerald-500', shadow: 'shadow-emerald-200/50' }
    : { light: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', fill: 'text-red-500', from: 'from-red-400', to: 'to-red-500', shadow: 'shadow-red-200/50' };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Calculate SVG circle properties
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 relative">
      
      {/* Confetti (CSS-based for passing score) */}
      {isPass && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i}
              className={`absolute top-[-10%] w-3 h-3 rounded-sm opacity-80 animate-confetti`}
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#0EA5E9'][Math.floor(Math.random() * 4)],
                animationDuration: `${Math.random() * 2 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Hero Result Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative"
      >
        {/* Top bar */}
        <div className={`h-3 bg-gradient-to-r ${colorTheme.from} ${colorTheme.to}`}></div>
        
        <div className="p-8 md:p-12 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Quiz Result</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">{result.quiz?.title}</h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
            
            {/* Animated Score Ring */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                {/* Background track */}
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {/* Progress track */}
                <circle 
                  cx="70" cy="70" r={radius} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="12"
                  strokeLinecap="round"
                  className={`${colorTheme.fill} transition-all duration-300 ease-out`}
                  style={{ strokeDasharray: circumference, strokeDashoffset }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">{animatedScore}%</span>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-left">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${colorTheme.light} ${colorTheme.text} border ${colorTheme.border}`}>
                  {isPass ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {result.status}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time Taken</p>
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {formatTime(result.time_taken)}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Correct</p>
                <p className="text-xl font-bold text-slate-900">{result.correct_answers}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Incorrect</p>
                <p className="text-xl font-bold text-slate-900">{result.incorrect_answers + result.unanswered}</p>
              </div>
            </div>
          </div>

          <div className={`mt-10 mx-auto max-w-lg p-4 rounded-xl ${colorTheme.light} border ${colorTheme.border}`}>
            <p className={`font-medium ${colorTheme.text}`}>
              {isPass 
                ? "🎉 Congratulations! You successfully passed the assessment." 
                : "Keep learning! Review your answers below to identify areas for improvement."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Answer Review */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 px-2">Answer Review</h2>
        
        {result.answers?.map((answer, index) => {
          const isCorrect = answer.is_correct;
          const question = answer.question;
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              key={answer.id} 
              className={`bg-white rounded-2xl shadow-sm border-l-4 overflow-hidden ${
                isCorrect ? 'border-l-emerald-500 border-y border-r border-slate-100' : 'border-l-red-500 border-y border-r border-slate-100 bg-red-50/10'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 leading-relaxed">
                    <span className="text-slate-400 mr-2">{index + 1}.</span>
                    {question.text}
                  </h3>
                  <div className={`flex-shrink-0 px-2.5 py-1 rounded-md text-sm font-bold ${
                    isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isCorrect ? `+${question.marks} Marks` : '0 Marks'}
                  </div>
                </div>

                <div className="space-y-3">
                  {question.options?.map((option) => {
                    const isSelected = answer.selected_option_id === option.id;
                    const isActuallyCorrect = option.is_correct;
                    
                    let optionStyle = "border-slate-200 bg-white opacity-60"; // Default
                    let badge = null;

                    if (isSelected && isActuallyCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50/50 shadow-sm";
                      badge = <div className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> YOUR ANSWER</div>;
                    } else if (isSelected && !isActuallyCorrect) {
                      optionStyle = "border-red-400 bg-red-50/50";
                      badge = <div className="text-red-600 bg-red-100 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> YOUR ANSWER</div>;
                    } else if (!isSelected && isActuallyCorrect) {
                      optionStyle = "border-emerald-500 border-dashed bg-white";
                      badge = <div className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> CORRECT</div>;
                    }

                    return (
                      <div key={option.id} className={`flex items-center justify-between p-4 rounded-xl border-2 ${optionStyle} transition-all`}>
                        <div className={`text-base font-medium ${isSelected && !isActuallyCorrect ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                          {option.text}
                        </div>
                        {badge && <div>{badge}</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 mb-1">Explanation</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
        <div className="flex gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors">
            <Share2 className="w-5 h-5" /> Share
          </button>
          {result.quiz?.max_attempts === null || result.quiz?.max_attempts > 1 ? (
             <Link to={`/quizzes/${result.quiz_id}`} className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-light)] shadow-sm hover:shadow-glow flex items-center justify-center gap-2 transition-all">
               <RotateCcw className="w-5 h-5" /> Retake
             </Link>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: cubic-bezier(.37,0,.63,1);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
