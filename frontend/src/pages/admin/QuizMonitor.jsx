import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Users, Clock, CheckCircle2, XCircle, RefreshCw, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizMonitor() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      try {
        const [quizData, attemptsData] = await Promise.all([
          api.getQuiz(quizId),
          api.getQuizAttempts(quizId)
        ]);
        setQuiz(quizData);
        setAttempts(attemptsData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Failed to load monitor data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizAndAttempts();

    // Set up polling
    let interval;
    if (isPolling) {
      interval = setInterval(fetchQuizAndAttempts, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizId, isPolling]);

  if (isLoading && !quiz) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const inProgressCount = attempts.filter(a => a.status === 'IN_PROGRESS').length;
  const passedCount = attempts.filter(a => a.status === 'PASSED').length;
  const failedCount = attempts.filter(a => a.status === 'FAILED').length;

  return (
    <div className="space-y-6 animate-fade-in pb-20 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/admin/quizzes" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-white transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Quizzes
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" />
            Live Monitor: {quiz?.title}
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            Real-time submission and participation status
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              <RefreshCw className={`w-3 h-3 ${isPolling ? 'animate-spin text-cyan-400' : ''}`} />
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </p>
        </div>

        <button 
          onClick={() => setIsPolling(!isPolling)}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${
            isPolling ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          {isPolling ? 'Live Polling Active' : 'Polling Paused'}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase">Total Participants</p>
            <p className="text-3xl font-black text-white">{attempts.length}</p>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase">In Progress</p>
            <p className="text-3xl font-black text-white">{inProgressCount}</p>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase">Passed</p>
            <p className="text-3xl font-black text-white">{passedCount}</p>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase">Failed</p>
            <p className="text-3xl font-black text-white">{failedCount}</p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--color-primary-light)]" />
            Live Submissions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time Taken</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Started At</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {attempts.length > 0 ? (
                attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{attempt.user_name}</td>
                    <td className="px-6 py-4">
                      {attempt.status === 'IN_PROGRESS' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                          In Progress
                        </span>
                      )}
                      {attempt.status === 'PASSED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                        </span>
                      )}
                      {attempt.status === 'FAILED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {attempt.status !== 'IN_PROGRESS' ? (
                        <span className="text-white">{attempt.percentage}%</span>
                      ) : (
                        <span className="text-slate-500">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-300">
                      {attempt.status !== 'IN_PROGRESS' ? (
                        `${Math.floor(attempt.time_taken / 60)}m ${attempt.time_taken % 60}s`
                      ) : (
                        <span className="text-amber-400/70 italic flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Live
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(attempt.started_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {attempt.status !== 'IN_PROGRESS' ? (
                        <Link 
                          to={`/admin/attempts/${attempt.id}`}
                          className="inline-block px-3 py-1.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors text-xs"
                        >
                          View Detail
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium italic">Pending</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    No participants have attempted this quiz yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
