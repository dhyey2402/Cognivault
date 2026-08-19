import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuizIntelligence({ quizzes }) {
  const getPatternInsight = (quiz) => {
    if (quiz.attempts > 10 && quiz.average_score < 50) {
      return { label: 'High Participation, Low Performance', icon: <TrendingDown className="w-3 h-3" />, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    }
    if (quiz.attempts > 10 && quiz.average_score >= 80) {
      return { label: 'High Participation, High Performance', icon: <TrendingUp className="w-3 h-3" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
    if (quiz.attempts > 0 && quiz.attempts < 5 && quiz.average_score >= 80) {
      return { label: 'Low Participation, High Performance', icon: <AlertCircle className="w-3 h-3" />, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="glass-panel p-6 rounded-3xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          Quiz Intelligence
        </h2>
        <Link to="/admin/quizzes" className="text-sm font-medium text-purple-400 hover:text-purple-300">View all</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 font-medium">Quiz</th>
              <th className="pb-3 font-medium text-right">Attempts</th>
              <th className="pb-3 font-medium text-right">Avg Score</th>
              <th className="pb-3 font-medium text-right">Pass Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {quizzes && quizzes.length > 0 ? (
              quizzes.slice(0, 5).map((quiz, idx) => {
                const insight = getPatternInsight(quiz);
                return (
                  <tr key={idx} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{quiz.name}</div>
                      {insight && (
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold mt-1.5 border ${insight.color}`}>
                          {insight.icon} {insight.label}
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-right text-sm font-medium text-slate-300">{quiz.attempts}</td>
                    <td className="py-4 text-right">
                      <span className={`text-sm font-bold ${quiz.average_score >= 70 ? 'text-emerald-400' : quiz.average_score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {quiz.average_score}%
                      </span>
                    </td>
                    <td className="py-4 text-right text-sm font-medium text-slate-300">{quiz.pass_rate}%</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500 text-sm">No quiz data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
