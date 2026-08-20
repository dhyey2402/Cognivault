import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, BrainCircuit } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function SecurityComparisonSection() {
  return (
    <div className="relative z-10">
      {/* Security Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-bold mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Built With Integrity At Every Layer.</h2>
            <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed">
              Designed to make assessments more secure, accountable and resistant to common forms of cheating. We don't just rely on UI tricks—the backend is strictly authoritative.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Secure Authentication', 'Role-Based Access Control', 'Server-Side Scoring', 
                'Server-Authoritative Timing', 'Attempt Ownership', 'Result Ownership', 
                'Protected Quiz Answers', 'ExamShield™ Monitoring'
              ].map((tag, i) => (
                <div key={i} className="px-5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm text-slate-300 font-bold tracking-wide shadow-sm">
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 px-6 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
            {/* Traditional */}
            <div className="p-10 md:p-16 border-b md:border-b-0 md:border-r border-white/10 opacity-70">
              <h4 className="text-2xl font-bold mb-8 text-slate-400">Traditional Quiz Platforms</h4>
              <ul className="space-y-5">
                {['Questions', 'Timer', 'Score'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-400 font-medium">
                    <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-xs text-slate-500">✓</div> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quizora */}
            <div className="p-10 md:p-16 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <h4 className="text-3xl font-bold mb-8 text-indigo-400 flex items-center gap-3">
                <BrainCircuit className="w-8 h-8" /> Quizora
              </h4>
              <ul className="space-y-5">
                {[
                  'Intelligent assessments',
                  'Secure assessment mode',
                  'Integrity monitoring',
                  'Knowledge Galaxy',
                  'Focus insights',
                  'Memory Heatmap',
                  'Story Mode',
                  'Student analytics',
                  'Admin analytics',
                  'Integrity timeline'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6 text-indigo-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
