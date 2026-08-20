import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function MemoryHeatmapSection() {
  const legend = [
    { label: "Confident", color: "bg-emerald-500" },
    { label: "Hesitated", color: "bg-emerald-300" },
    { label: "Changed Answer", color: "bg-amber-400" },
    { label: "Struggled", color: "bg-red-500" },
  ];

  return (
    <section className="relative z-10 py-32 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold">
              <Activity className="w-4 h-4" /> Memory Heatmap
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">See What You Actually Remember.</h3>
            <p className="text-xl text-slate-400 leading-relaxed">
              Instead of simply showing a score of 78%, Quizora shows exactly where you knew the answer, where you guessed, where you hesitated, and where you struggled.
            </p>
            <p className="text-lg text-slate-500">
              Visualize your cognitive journey through an assessment and optimize your study sessions.
            </p>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="rounded-3xl bg-slate-950 border border-white/10 p-8 shadow-[0_0_50px_rgba(99,102,241,0.15)] flex flex-col items-center">
              
              <div className="flex flex-wrap gap-3 justify-center mb-10 mt-6 max-w-[300px]">
                {[...Array(20)].map((_, i) => {
                  let bgColor = 'bg-slate-800';
                  const rand = Math.random();
                  if (rand > 0.8) bgColor = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
                  else if (rand > 0.6) bgColor = 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
                  else if (rand > 0.4) bgColor = 'bg-emerald-300 shadow-[0_0_15px_rgba(110,231,183,0.5)]';
                  else bgColor = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';

                  return (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring' }}
                      viewport={{ once: true }}
                      className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center text-slate-900 font-bold text-xs`}
                    >
                      {i + 1}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-center gap-6 border-t border-white/10 pt-6 w-full">
                {legend.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
