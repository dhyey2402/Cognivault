import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ShieldAlert, ShieldCheck, Clock, AlertTriangle, ArrowLeft, Maximize, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AttemptReview() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [attemptId]);

  const fetchData = async () => {
    try {
      const [attemptData, eventsData] = await Promise.all([
        api.getAttemptResult(attemptId),
        api.getIntegrityEvents(attemptId)
      ]);
      setAttempt(attemptData);
      setEvents(eventsData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!attempt) {
    return <div className="text-center py-20 text-slate-400">Attempt not found</div>;
  }

  const criticalEvents = events.filter(e => e.severity === 'CRITICAL');
  const warningEvents = events.filter(e => e.severity === 'WARNING');
  const infoEvents = events.filter(e => e.severity === 'INFO');
  
  const hasViolations = criticalEvents.length > 0 || warningEvents.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in relative z-10">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm border border-white/10 flex justify-between items-start">
        <div>
          <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[var(--color-primary-light)] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Users
          </Link>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            Attempt Review
            {hasViolations ? (
              <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-md border border-red-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Flagged
              </span>
            ) : (
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Clean
              </span>
            )}
          </h1>
          <p className="text-slate-400 mt-1">Quiz: {attempt.quiz?.title || 'Unknown Quiz'}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white">{attempt.percentage}%</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{attempt.status}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Integrity Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/10">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" /> ExamShield™ Integrity Report
            </h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-red-400">{criticalEvents.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase">Critical</div>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-amber-400">{warningEvents.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase">Warnings</div>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-blue-400">{infoEvents.length}</div>
                <div className="text-xs font-bold text-slate-400 uppercase">Info Logged</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Event Timeline</h3>
              {events.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-dashed border-white/20">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-slate-400 font-medium text-sm">No integrity events recorded.</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-white/10 ml-4 space-y-6 pb-4">
                  {events.map((event, idx) => {
                    let icon = <Clock className="w-4 h-4" />;
                    let color = 'bg-slate-800 text-slate-400 ring-4 ring-slate-900';
                    
                    if (event.severity === 'CRITICAL') {
                      icon = <AlertTriangle className="w-4 h-4" />;
                      color = 'bg-red-500/20 text-red-400 ring-4 ring-slate-900';
                    } else if (event.severity === 'WARNING') {
                      icon = <AlertTriangle className="w-4 h-4" />;
                      color = 'bg-amber-500/20 text-amber-400 ring-4 ring-slate-900';
                    } else {
                      icon = <FileText className="w-4 h-4" />;
                      color = 'bg-blue-500/20 text-blue-400 ring-4 ring-slate-900';
                    }

                    return (
                      <div key={idx} className="relative pl-6">
                        <div className={`absolute -left-[13px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center ${color}`}>
                          {icon}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-white">{event.event_type.replace(/_/g, ' ')}</span>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(event.occurred_at).toLocaleTimeString()}
                            </span>
                          </div>
                          {event.metadata_json && event.metadata_json !== "{}" && (
                            <div className="mt-1 text-sm text-slate-300 bg-black/20 p-2 rounded-lg font-mono text-xs border border-white/5 inline-block">
                              {event.metadata_json}
                            </div>
                          )}
                          {event.question_id && (
                            <div className="mt-1 text-xs text-[var(--color-primary-light)] font-bold">
                              During Question ID: {event.question_id}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Attempt Stats */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/10">
             <h2 className="text-lg font-bold text-white mb-4">Attempt Summary</h2>
             <div className="space-y-4 text-sm font-medium">
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-slate-400">Time Taken</span>
                 <span className="text-white">{Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-slate-400">Score</span>
                 <span className="text-white">{attempt.score} / {attempt.quiz?.questions?.reduce((acc, q) => acc + q.marks, 0) || '?'}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-slate-400">Correct Answers</span>
                 <span className="text-white">{attempt.correct_answers}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Submitted</span>
                 <span className="text-white">{new Date(attempt.end_time).toLocaleString()}</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
