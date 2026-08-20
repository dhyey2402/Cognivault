import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function LifecycleSection() {
  const steps = [
    "CREATE", "DESIGN", "PUBLISH", "ASSESS", "ANALYZE", "IMPROVE"
  ];

  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">The Assessment Lifecycle</h2>
          <p className="text-xl text-slate-400">Cognivault connects the entire educational journey seamlessly.</p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto py-10">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }} variants={sectionVariants}
                className="w-full md:w-auto flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold mb-4 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                  {i + 1}
                </div>
                <div className="text-sm font-bold text-white tracking-widest">{step}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
