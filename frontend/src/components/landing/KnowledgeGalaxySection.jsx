import { motion } from 'framer-motion';
import { Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function KnowledgeGalaxySection() {
  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
              <Globe className="w-4 h-4" /> Signature Feature
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Turn Performance Into a Universe.</h3>
            <p className="text-xl text-slate-400 leading-relaxed">
              Instead of presenting learning history as a boring table, Cognivault transforms performance into an interactive knowledge map. Categories become planets. Completed assessments become constellations. Strong topics become brighter regions, while weak topics become fading regions.
            </p>
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-300">
              "Student → explores → discovers → understands their knowledge."
            </blockquote>
            <Link to="/register" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold mt-4 group">
              Explore Your Galaxy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-square rounded-full bg-slate-950 border border-white/5 overflow-hidden relative shadow-[0_0_80px_rgba(16,185,129,0.15)] flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
              
              {/* Central Planet */}
              <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-cyan-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.6)] z-10"></div>
              
              {/* Constellations */}
              <svg className="absolute inset-0 w-full h-full" stroke="rgba(52,211,153,0.3)" strokeWidth="1.5" fill="none">
                <path d="M 50% 50% L 20% 30% L 30% 15%" />
                <path d="M 50% 50% L 75% 25% L 85% 45%" />
                <path d="M 50% 50% L 70% 75% L 40% 85%" />
              </svg>

              {/* Nodes */}
              <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]"></div>
              <div className="absolute top-[15%] left-[30%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
              
              <div className="absolute top-[25%] left-[75%] w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
              <div className="absolute top-[45%] left-[85%] w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)]"></div>

              <div className="absolute top-[75%] left-[70%] w-3 h-3 bg-orange-400/50 rounded-full"></div>
              <div className="absolute top-[85%] left-[40%] w-2 h-2 bg-orange-400/30 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
