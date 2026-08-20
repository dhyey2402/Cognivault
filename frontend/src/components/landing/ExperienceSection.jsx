import { motion } from 'framer-motion';
import { Users, Server, Globe, Search, BookOpen, Activity, Lock, BarChart, ShieldAlert } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function ExperienceSection() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* Student Experience */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold mb-6">
            <Users className="w-4 h-4" /> Student Experience
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">A Complete Learning Journey.</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto">
            {[
              { label: "Discover", icon: Search },
              { label: "Assess", icon: BookOpen },
              { label: "Explore Results", icon: Activity },
              { label: "Understand", icon: BarChart },
              { label: "Build Knowledge", icon: Globe }
            ].map((step, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex flex-col items-center group">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all shadow-lg">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-300">{step.label}</div>
                </div>
                {i < 4 && (
                  <div className="hidden md:block w-8 border-t-2 border-dashed border-white/20"></div>
                )}
                {i < 4 && (
                  <div className="md:hidden h-8 border-l-2 border-dashed border-white/20 my-2"></div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Admin Experience */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border border-white/10 rounded-[3rem] p-8 md:p-16 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="text-center mb-16 relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Powerful Control. Beautifully Simple.</h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Cognivault should feel equally powerful for Administrators and Students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
              <Users className="w-6 h-6 text-indigo-400 mb-4" />
              <h4 className="text-lg font-bold mb-2 text-white">Student Management</h4>
              <p className="text-sm text-slate-400">View student progress, history, and aggregate performance metrics seamlessly.</p>
            </div>
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
              <BookOpen className="w-6 h-6 text-indigo-400 mb-4" />
              <h4 className="text-lg font-bold mb-2 text-white">Assessment Builder</h4>
              <p className="text-sm text-slate-400">Construct complex assessments, toggle Story Mode, and enable ExamShield instantly.</p>
            </div>
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
              <ShieldAlert className="w-6 h-6 text-indigo-400 mb-4" />
              <h4 className="text-lg font-bold mb-2 text-white">Integrity Analytics</h4>
              <p className="text-sm text-slate-400">Review detailed timeline logs of all ExamShield integrity events per attempt.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
