import { motion } from 'framer-motion';
import { MonitorPlay, ChevronRight } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function StoryModeSection() {
  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold">
              <MonitorPlay className="w-4 h-4" /> Adaptive Story Mode
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Turn Questions Into Missions.</h3>
            <p className="text-xl text-slate-400 leading-relaxed">
              Instead of a linear sequence of questions, Cognivault transforms suitable assessments into interactive missions. Your answers dictate the narrative. Correct answers advance the mission; incorrect ones trigger new scenarios.
            </p>
            <p className="text-lg text-slate-500">
              Make assessments more engaging and memorable. Don't just answer questions—enter the challenge.
            </p>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-video rounded-3xl bg-slate-950 border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              
              <div className="text-center p-8 z-10 relative">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono mb-6 tracking-widest rounded">MISSION 01</div>
                  
                  <h4 className="text-2xl font-bold mb-8 text-white max-w-sm mx-auto leading-snug">
                    "You are the security engineer protecting a financial institution."
                  </h4>
                  
                  <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    <button className="px-6 py-4 bg-slate-900 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 text-sm font-bold rounded-xl transition-all flex items-center justify-between group">
                      Isolate the infected subnet
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400" />
                    </button>
                    <button className="px-6 py-4 bg-slate-900 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 text-sm font-bold rounded-xl transition-all flex items-center justify-between group">
                      Reboot the primary firewall
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Decorative side paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" stroke="rgba(249,115,22,0.2)" strokeWidth="2" fill="none">
                <path d="M 0 50% L 100% 50%" strokeDasharray="4 4" />
                <circle cx="50%" cy="50%" r="150" strokeDasharray="4 4" opacity="0.5" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
