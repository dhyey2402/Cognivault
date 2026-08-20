import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function FocusDNASection() {
  const profile = [
    { label: "Conceptual Reasoning", value: 92, color: "bg-cyan-400", blockColor: "text-cyan-400" },
    { label: "Pressure Response", value: 81, color: "bg-emerald-400", blockColor: "text-emerald-400" },
    { label: "Memory Recall", value: 64, color: "bg-amber-400", blockColor: "text-amber-400" },
    { label: "Consistency", value: 73, color: "bg-indigo-400", blockColor: "text-indigo-400" },
  ];

  return (
    <section className="relative z-10 py-32 px-6 bg-slate-900/10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold">
              <Fingerprint className="w-4 h-4" /> Focus DNA™
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Understand How You Think.</h3>
            <p className="text-xl text-slate-400 leading-relaxed">
              Cognivault analyzes assessment behavior to generate meaningful learning-performance insights. We track hesitation, answer switching, time spent, response patterns, and performance changes during an assessment to build your unique cognitive profile.
            </p>
          </div>
          
          <div className="flex-1 w-full">
            <div className="rounded-3xl bg-slate-950 border border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              <div className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest text-center md:text-left">Focus DNA Profile</div>
              
              <div className="space-y-6 mb-10">
                {profile.map((stat, i) => {
                   const filled = Math.round(stat.value / 10);
                   const empty = 10 - filled;
                   return (
                     <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                       <div className="w-48 text-sm font-medium text-slate-300">{stat.label}</div>
                       <div className="flex-1 font-mono text-xs tracking-widest flex items-center gap-2">
                         <span className={stat.blockColor}>
                           {'█'.repeat(filled)}<span className="text-slate-800">{'█'.repeat(empty)}</span>
                         </span>
                         <span className="text-slate-400 ml-2">{stat.value}%</span>
                       </div>
                     </div>
                   );
                })}
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <p className="text-indigo-100 font-medium leading-relaxed">
                  "You're fast under pressure — but accuracy begins to drop after Question 15."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
