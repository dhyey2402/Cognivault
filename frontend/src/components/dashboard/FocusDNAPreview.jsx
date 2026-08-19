import { motion } from 'framer-motion';
import { Fingerprint, Zap, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FocusDNAPreview({ dnaData, attemptId }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-panel rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-purple-400" /> Focus DNA
        </h3>
        {attemptId && (
          <Link to={`/results/${attemptId}`} className="text-purple-400 hover:text-purple-300 transition-colors p-1 rounded-full hover:bg-white/5">
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {dnaData ? (
        <div className="flex-1 flex flex-col justify-center gap-4">
          <p className="text-slate-400 text-sm font-medium">Your assessment style</p>
          
          <div className="space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  {dnaData.speed_profile || 'Steady Responder'}
                </div>
                <div className="text-slate-500 text-xs">Pace characteristics</div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  {dnaData.accuracy_profile || 'Conceptual Accuracy'}
                </div>
                <div className="text-slate-500 text-xs">Strength area</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-slate-500">
            <Fingerprint className="w-6 h-6" />
          </div>
          <p className="text-slate-400 text-sm max-w-[200px]">Complete more assessments to reveal your Focus DNA.</p>
        </div>
      )}
    </motion.div>
  );
}
