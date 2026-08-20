import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <section className="relative pt-48 pb-20 px-6 min-h-screen flex flex-col justify-center items-center overflow-hidden">
      <motion.div style={{ y: yHero }} className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center relative z-10"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-indigo-500/30 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.15)]">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold tracking-widest text-indigo-200 uppercase">Intelligent Assessment Infrastructure</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white">
          Assess Knowledge. <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Understand Learning.</span> <br className="hidden md:block"/>
          Protect Integrity.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          An intelligent assessment platform built for modern learning — from immersive quizzes and deep performance insights to ExamShield™ secure assessment technology.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            Explore Cognivault
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#experiences" className="flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-slate-900/50 text-white font-bold rounded-2xl border border-white/10 hover:bg-slate-800/50 transition-all backdrop-blur-md">
            Experience a Demo
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
