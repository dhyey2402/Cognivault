import { motion } from 'framer-motion';

export default function AdminHero({ user, stats }) {
  // Generate a dynamic insight based on actual data
  let insight = "Your assessment ecosystem is ready.";
  
  if (stats) {
    if (stats.student_stats?.new_30d > 0) {
      insight = `${stats.student_stats.new_30d} new students joined this month.`;
    } else if (stats.attempt_stats?.in_progress > 0) {
      insight = `${stats.attempt_stats.in_progress} students are currently taking an assessment.`;
    } else if (stats.attention_items?.drafts?.length > 0) {
      insight = `You have ${stats.attention_items.drafts.length} draft quizzes waiting to be published.`;
    } else if (stats.quiz_stats?.published > 0) {
      insight = `${stats.quiz_stats.published} quizzes are currently active and available.`;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 text-glow">
        GOOD MORNING, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase">{user?.name?.split(' ')[0] || 'ADMIN'}</span>
      </h1>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
        <p className="text-lg text-slate-300 font-medium">
          {insight}
        </p>
      </div>
    </motion.div>
  );
}
