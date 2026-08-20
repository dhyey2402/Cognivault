import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function WhyCognivault() {
  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}
      className="relative z-10 py-32 px-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
          Most platforms measure your score. <br/>
          <span className="text-indigo-400">Cognivault studies your learning journey.</span>
        </h2>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
          Traditional assessment platforms generally provide a simple score and correct/incorrect answers. Cognivault goes further by understanding how students learn, where they struggle, how they respond under pressure, and how knowledge develops over time.
        </p>
      </div>
    </motion.section>
  );
}
