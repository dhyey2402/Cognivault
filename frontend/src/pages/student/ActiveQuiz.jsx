import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ChevronLeft, ChevronRight, Bookmark, AlertTriangle, CheckCircle2, Clock, Hourglass, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ExamShield from '../../components/ExamShield';

export default function ActiveQuiz() {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStats, setQuestionStats] = useState({});
  const [lastTick, setLastTick] = useState(Date.now());
  const [showStoryConsequence, setShowStoryConsequence] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingIntegrityEvents, setPendingIntegrityEvents] = useState(0);

  useEffect(() => {
    fetchAttemptDetails();
  }, [attemptId]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting && !showStoryConsequence) {
      const timer = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTick) / 1000);
        if (delta > 0) {
           setLastTick(now);
           if (questions[currentIndex]) {
             const qId = questions[currentIndex].id;
             setQuestionStats(prev => ({
               ...prev,
               [qId]: {
                 timeSpent: (prev[qId]?.timeSpent || 0) + delta,
                 changes: prev[qId]?.changes || 0
               }
             }));
           }
        }

        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitting, lastTick, currentIndex, questions, showStoryConsequence]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showConfirmModal) return;
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions.length, showConfirmModal]);

  const fetchAttemptDetails = async () => {
    try {
      const quizDetails = await api.getQuiz(quizId);
      const attemptDetails = await api.getAttempt(attemptId);
      
      setQuiz(quizDetails);
      setQuestions(quizDetails.questions || []);
      setAttempt(attemptDetails);
      
      const timeLimit = (quizDetails.duration_minutes || 30) * 60;
      const startedAt = new Date(attemptDetails.started_at).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startedAt) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);

      if (attemptDetails.status === 'COMPLETED') {
        navigate(`/results/${attemptId}`);
      }
    } catch (err) {
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers(prev => {
      if (prev[questionId] !== optionId) {
        setQuestionStats(stats => ({
          ...stats,
          [questionId]: {
            ...stats[questionId],
            changes: (stats[questionId]?.changes || 0) + (prev[questionId] ? 1 : 0),
            timeSpent: stats[questionId]?.timeSpent || 0
          }
        }));
      }
      return { ...prev, [questionId]: optionId };
    });
  };

  const handleNext = () => {
    if (quiz?.is_story_mode && answers[currentQuestion.id]) {
       setShowStoryConsequence(true);
    } else {
       setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
       setLastTick(Date.now());
    }
  };
  
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setLastTick(Date.now());
  };

  const handleStoryContinue = () => {
    setShowStoryConsequence(false);
    setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
    setLastTick(Date.now());
  };

  const toggleBookmark = (questionId) => {
    setBookmarked(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleAutoSubmit = async () => {
    toast('Time is up! Submitting your assessment...', { icon: '⏱️' });
    await submitQuiz();
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const answersList = Object.entries(answers).map(([qId, oId]) => ({
        question_id: parseInt(qId),
        selected_option_id: oId,
        time_spent_seconds: questionStats[qId]?.timeSpent || 0,
        answer_changes: questionStats[qId]?.changes || 0
      }));
      
      const timeLimit = (quiz?.duration_minutes || 30) * 60;
      const timeTaken = timeLimit - timeLeft;

      await api.submitAttempt(attemptId, { answers: answersList, time_taken: timeTaken });
      toast.success('Assessment submitted successfully!');
      navigate(`/results/${attemptId}`);
    } catch (err) {
      toast.error('Failed to submit quiz');
      setIsSubmitting(false);
    }
  };

  if (isLoading || !questions.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary-dark)] rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  
  const isTimeWarning = timeLeft < 300; // < 5 mins
  const isTimeCritical = timeLeft < 60; // < 1 min

  const examShieldConfig = quiz?.secure_mode_config ? JSON.parse(quiz.secure_mode_config) : {};

  return (
    <ExamShield
      isActive={quiz?.is_secure_mode}
      attemptId={attemptId}
      quizId={quizId}
      config={examShieldConfig}
      currentQuestionId={currentQuestion?.id}
      onEventsFlushed={(count) => setPendingIntegrityEvents(0)}
    >
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans w-full">
      
      {/* Top Progress Bar */}
      <div className="w-full h-1 bg-slate-200 fixed top-0 left-0 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[var(--color-primary)] via-[#6366F1] to-[var(--color-secondary)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex-1 max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6 pt-8 mt-2">
        
        {/* Left: Question Area (70%) */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-bold text-slate-400 tracking-wider uppercase">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium text-slate-500">
              {answeredCount} of {questions.length} answered
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-card border border-slate-100 flex-1 flex flex-col relative overflow-hidden">
            {/* Crossfade container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex-1 p-8 sm:p-10 flex flex-col"
              >
                {/* Question Header */}
                <div className="flex justify-between items-start gap-4 mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                    {quiz?.is_story_mode ? 'Mission Objective' : currentQuestion.text}
                  </h2>
                  <button
                    onClick={() => toggleBookmark(currentQuestion.id)}
                    className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 ${
                      bookmarked[currentQuestion.id] 
                        ? 'bg-amber-100 text-amber-500' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark className="w-6 h-6" fill={bookmarked[currentQuestion.id] ? "currentColor" : "none"} />
                  </button>
                </div>
                
                {quiz?.is_story_mode && currentQuestion.story_context && (
                  <div className="mb-6 p-5 rounded-2xl bg-indigo-900 text-indigo-50 shadow-inner border border-indigo-700/50">
                    <p className="text-lg leading-relaxed italic">{currentQuestion.story_context}</p>
                    <p className="mt-4 font-bold text-indigo-200">Question: {currentQuestion.text}</p>
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3 flex-1">
                  {currentQuestion.options?.map((option, i) => {
                    const isSelected = answers[currentQuestion.id] === option.id;
                    const letter = String.fromCharCode(65 + i); // A, B, C...
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group relative overflow-hidden ${
                          isSelected 
                            ? 'border-[var(--color-primary)] bg-indigo-50/40' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        } focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.99]`}
                      >
                        {/* Option Letter Badge */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 flex-shrink-0 relative ${
                          isSelected 
                            ? 'bg-[var(--color-primary)] text-white shadow-md' 
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}>
                          <AnimatePresence>
                            {isSelected ? (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute inset-0 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </motion.div>
                            ) : (
                              <span>{letter}</span>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <span className={`text-base sm:text-lg font-medium transition-colors ${isSelected ? 'text-[var(--color-primary-dark)]' : 'text-slate-700'}`}>
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white z-10">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-5 py-3 flex items-center gap-2 text-slate-500 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              
              <div className="hidden sm:block text-xs font-medium text-slate-400">
                Keyboard: <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">→</kbd>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-3 flex items-center gap-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 shadow-sm"
              >
                {quiz?.is_story_mode && answers[currentQuestion.id] ? 'Proceed' : 'Next'} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Palette (30%) */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Timer Card */}
          <div className={`bg-white rounded-3xl p-6 shadow-card border border-slate-100 flex items-center justify-center gap-4 transition-colors duration-500 ${
            isTimeCritical ? 'bg-red-50 border-red-200 animate-pulse-glow shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 
            isTimeWarning ? 'bg-amber-50 border-amber-200' : ''
          }`}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                isTimeCritical ? 'text-red-500' : isTimeWarning ? 'text-amber-500' : 'text-slate-400'
              }`}
            >
              <Hourglass className="w-6 h-6" />
            </motion.div>
            <div className={`font-mono text-4xl font-black tracking-tight ${
              isTimeCritical ? 'text-red-600' : isTimeWarning ? 'text-amber-600' : 'text-slate-900'
            }`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Palette Card */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[var(--color-primary)] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              Question Palette
            </h3>
            
            <div className="grid grid-cols-5 gap-2.5 mb-6">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;
                const isBookmarked = bookmarked[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 focus:outline-none
                      ${isCurrent ? 'ring-2 ring-offset-2 ring-[var(--color-primary)]' : ''}
                      ${isAnswered 
                        ? 'bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] text-white shadow-inner' 
                        : isBookmarked
                          ? 'bg-amber-50 border-2 border-amber-300 text-amber-700'
                          : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300'
                      }
                    `}
                  >
                    {idx + 1}
                    {isBookmarked && (
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isAnswered ? 'bg-amber-400' : 'bg-amber-500'}`}></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-[var(--color-primary)]"></div> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md border-2 border-slate-200"></div> Unanswered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md border-2 border-amber-300 bg-amber-50"></div> Bookmarked</div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              Submit ({answeredCount}/{questions.length})
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-500"></div>
              
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-2">Submit Assessment?</h2>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-center text-slate-600 text-sm">
                You have answered <span className="font-bold text-slate-900">{answeredCount}</span> out of <span className="font-bold text-slate-900">{questions.length}</span> questions.
                {questions.length - answeredCount > 0 && (
                  <div className="text-red-500 font-bold mt-2">
                    {questions.length - answeredCount} questions are unanswered and will be marked as incorrect.
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={submitQuiz}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-sm hover:shadow-glow transition-all flex justify-center items-center"
                >
                  {isSubmitting ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Submit Now'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Story Consequence Modal */}
      <AnimatePresence>
        {showStoryConsequence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              className="bg-indigo-950 rounded-3xl p-8 sm:p-12 max-w-2xl w-full shadow-[0_0_50px_rgba(79,70,229,0.3)] relative overflow-hidden text-center border border-indigo-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold text-white mb-6">Consequence</h2>
                
                <div className="text-xl text-indigo-100 leading-relaxed mb-10 font-serif italic">
                  {currentQuestion.options.find(o => o.id === answers[currentQuestion.id])?.story_consequence || 'Your action alters the course of the mission.'}
                </div>

                <button
                  onClick={handleStoryContinue}
                  className="px-8 py-4 bg-white text-indigo-950 font-black tracking-widest uppercase rounded-full hover:bg-indigo-50 transition-all shadow-glow"
                >
                  Continue Mission
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ExamShield>
  );
}
