import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Share2, Lightbulb, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizResult() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [dna, setDna] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const [data, dnaData, heatmapData] = await Promise.all([
        api.getAttemptResult(attemptId),
        api.getFocusDNA(attemptId).catch(() => null),
        api.getMemoryHeatmap(attemptId).catch(() => null)
      ]);
      setResult(data);
      if (dnaData) setDna(dnaData);
      if (heatmapData) setHeatmap(heatmapData);
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
    ? { light: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', fill: 'text-emerald-500', from: 'from-emerald-400/20', to: 'to-emerald-500/20', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' }
    : { light: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', fill: 'text-red-500', from: 'from-red-400/20', to: 'to-red-500/20', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]' };

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
        className="glass-panel rounded-3xl overflow-hidden border border-white/10 relative"
      >
        {/* Top bar */}
        <div className={`h-3 bg-gradient-to-r ${colorTheme.from} ${colorTheme.to}`}></div>
        
        <div className="p-8 md:p-12 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Quiz Result</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-8">{result.quiz?.title}</h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
            
            {/* Animated Score Ring */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                {/* Background track */}
                <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
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
                <span className="text-4xl font-black text-white">{animatedScore}%</span>
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
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {formatTime(result.time_taken)}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Correct</p>
                <p className="text-xl font-bold text-white">{result.correct_answers}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Incorrect</p>
                <p className="text-xl font-bold text-white">{result.incorrect_answers + result.unanswered}</p>
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

      {/* Focus DNA & Memory Heatmap Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Focus DNA */}
        {dna && (
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-panel rounded-3xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Focus DNA</h3>
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-400 font-black tracking-wide uppercase text-sm border border-purple-500/30 mb-3">
                {dna.behavioral_profile}
              </div>
              <p className="text-slate-300 font-medium">
                {dna.insights[0] || "We are analyzing your learning pattern."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-black text-white">{Math.round(dna.average_time_per_question)}s</div>
                <div className="text-xs font-bold text-slate-400 uppercase">Avg Time/Q</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white">{dna.total_answer_changes}</div>
                <div className="text-xs font-bold text-slate-400 uppercase">Total Changes</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Memory Heatmap */}
        {heatmap && (
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-panel rounded-3xl border border-white/10 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Memory Heatmap</h3>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {heatmap.questions.map((q, i) => {
                   let bgColor = 'bg-white/10';
                   let textColor = 'text-white';
                   if (q.state === 'KNEW_IT') bgColor = 'bg-emerald-500';
                   if (q.state === 'GUESSED') bgColor = 'bg-emerald-400';
                   if (q.state === 'CHANGED') bgColor = 'bg-amber-500';
                   if (q.state === 'STRUGGLED') bgColor = 'bg-red-500';
                   if (q.state === 'UNANSWERED') { bgColor = 'bg-white/5 border border-white/20'; textColor = 'text-slate-400'; }
                   
                   return (
                     <div key={q.question_id} className={`w-8 h-8 rounded-md ${bgColor} flex items-center justify-center text-xs font-bold ${textColor} shadow-sm relative group cursor-pointer`}>
                       {i + 1}
                       {/* Tooltip */}
                       <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                         {q.state.replace('_', ' ')} • {q.time_spent_seconds}s
                       </div>
                     </div>
                   );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/10 text-xs font-bold text-slate-400 text-center">
              <div><div className="w-3 h-3 bg-emerald-500 rounded-sm mx-auto mb-1"></div>Knew it</div>
              <div><div className="w-3 h-3 bg-emerald-400 rounded-sm mx-auto mb-1"></div>Guessed</div>
              <div><div className="w-3 h-3 bg-amber-500 rounded-sm mx-auto mb-1"></div>Changed</div>
              <div><div className="w-3 h-3 bg-red-500 rounded-sm mx-auto mb-1"></div>Struggled</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Answer Review */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white px-2">Answer Review</h2>
        
        {result.answers?.map((answer, index) => {
          const isCorrect = answer.is_correct;
          const question = answer.question;
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              key={answer.id} 
              className={`glass-panel rounded-2xl border-l-4 overflow-hidden ${
                isCorrect ? 'border-l-emerald-500 border-y border-r border-white/10' : 'border-l-red-500 border-y border-r border-white/10 bg-red-500/5'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <h3 className="text-lg font-bold text-white leading-relaxed">
                    <span className="text-slate-400 mr-2">{index + 1}.</span>
                    {question.text}
                  </h3>
                  <div className={`flex-shrink-0 px-2.5 py-1 rounded-md text-sm font-bold ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {isCorrect ? `+${question.marks} Marks` : '0 Marks'}
                  </div>
                </div>

                <div className="space-y-3">
                  {question.options?.map((option) => {
                    const isSelected = answer.selected_option_id === option.id;
                    const isActuallyCorrect = option.is_correct;
                    
                    let optionStyle = "border-white/10 bg-white/5 opacity-60"; // Default
                    let badge = null;

                    if (isSelected && isActuallyCorrect) {
                      optionStyle = "border-emerald-500/50 bg-emerald-500/10";
                      badge = <div className="text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> YOUR ANSWER</div>;
                    } else if (isSelected && !isActuallyCorrect) {
                      optionStyle = "border-red-500/50 bg-red-500/10";
                      badge = <div className="text-red-400 bg-red-500/20 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> YOUR ANSWER</div>;
                    } else if (!isSelected && isActuallyCorrect) {
                      optionStyle = "border-emerald-500/50 border-dashed bg-white/5";
                      badge = <div className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> CORRECT</div>;
                    }

                    return (
                      <div key={option.id} className={`flex items-center justify-between p-4 rounded-xl border-2 ${optionStyle} transition-all`}>
                        <div className={`text-base font-medium ${isSelected && !isActuallyCorrect ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                          {option.text}
                        </div>
                        {badge && <div>{badge}</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-300 mb-1">Explanation</h4>
                      <p className="text-sm text-blue-200/80 leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
        <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/20 text-slate-300 font-bold hover:bg-white/5 flex items-center justify-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
        <div className="flex gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 flex items-center justify-center gap-2 transition-colors">
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
