import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function ExamShieldSection() {
  return (
    <section id="integrity" className="relative z-10 py-32 px-6 bg-slate-900/30 border-y border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold mb-6">
            <Shield className="w-4 h-4" /> ExamShield™
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Assessments designed for integrity.
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Cognivault creates a monitored examination environment that detects suspicious activity, protects assessment content, and gives administrators a transparent integrity trail for every attempt.
          </p>
        </div>

        <motion.div 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          className="max-w-4xl mx-auto relative z-10"
        >
          {/* Mockup Container */}
          <div className="bg-slate-950 rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.15)] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="font-bold text-white tracking-wide">SECURE MODE ACTIVE</div>
                  <div className="text-xs text-indigo-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> Monitoring
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-400 bg-slate-950 px-4 py-2 rounded-lg border border-white/5">
                Session ID: CV-9824-AX
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
              {/* Protection Status */}
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Protection Status</h4>
                <div className="space-y-4">
                  {[
                    "Tab Monitoring",
                    "Focus Monitoring",
                    "Fullscreen",
                    "Clipboard Protection",
                    "Navigation Protection"
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <span className="text-slate-300 font-medium">{item}</span>
                      <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Active
                      </span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                    <span className="text-slate-300 font-medium">Integrity Events</span>
                    <span className="flex items-center gap-2 text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-lg">
                      02
                    </span>
                  </div>
                </div>
              </div>

              {/* Integrity Timeline */}
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Integrity Timeline
                </h4>
                <div className="relative border-l-2 border-white/10 ml-3 space-y-8 pb-4">
                  {[
                    { time: "10:18:03", event: "Student left assessment window", type: "alert" },
                    { time: "10:18:11", event: "Student returned", type: "info" },
                    { time: "10:21:44", event: "Fullscreen exited manually", type: "alert" },
                    { time: "10:22:02", event: "Fullscreen restored", type: "info" }
                  ].map((log, i) => (
                    <div key={i} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-slate-950 ${log.type === 'alert' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                      <div className="text-xs font-mono text-slate-500 mb-1">{log.time}</div>
                      <div className={`text-sm font-medium ${log.type === 'alert' ? 'text-amber-200' : 'text-slate-300'}`}>
                        {log.event}
                      </div>
                    </div>
                  ))}
                  {/* Fading line gradient at bottom */}
                  <div className="absolute -bottom-4 -left-[2px] w-[2px] h-12 bg-gradient-to-b from-white/10 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
