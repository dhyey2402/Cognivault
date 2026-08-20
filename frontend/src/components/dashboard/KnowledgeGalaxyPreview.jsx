import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KnowledgeGalaxyPreview({ galaxy }) {
  if (!galaxy) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel-strong rounded-3xl p-8 lg:p-10 relative overflow-hidden group h-full flex flex-col justify-center border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.15)]">
      {/* Starfield Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full" style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.7 + 0.3,
            animation: `pulse ${Math.random() * 3 + 2}s infinite alternate`
          }}></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-white flex items-center justify-center md:justify-start gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-indigo-400" /> Knowledge Galaxy
          </h2>
          <p className="text-slate-300 text-sm mb-6 max-w-md font-light">Your mastery universe. Expand your galaxy by mastering topics and earning stars.</p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
              <div className="text-3xl font-black text-white mb-1 text-glow">{galaxy.total_stars}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stars</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
              <div className="text-3xl font-black text-white mb-1 text-glow">{galaxy.constellations?.length || 0}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constellations</div>
            </div>
          </div>
          
          <Link to="/leaderboard" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            Explore your knowledge universe <span className="text-xl leading-none">→</span>
          </Link>
        </div>

        {/* Constellations Visual */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            {galaxy.constellations?.map((c, i) => {
              const angle = (i / galaxy.constellations.length) * Math.PI * 2;
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div 
                  key={c.category_id} 
                  className="absolute group-hover:scale-105 transition-transform flex flex-col items-center justify-center z-20"
                  style={{ transform: `translate(${x}px, ${y}px)`, transitionDelay: `${i * 0.05}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/80 to-purple-500/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.6)] text-white font-bold border-2 border-white/20">
                    {c.stars}★
                  </div>
                  <div className="absolute top-full mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded">
                    {c.category_name}
                  </div>
                </div>
              );
            })}
            {/* Central Star */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300/80 to-yellow-500/80 backdrop-blur-sm shadow-[0_0_30px_rgba(252,211,77,0.4)] flex items-center justify-center border-4 border-white/10 z-10 group-hover:rotate-12 transition-transform duration-700">
              <span className="text-2xl drop-shadow-md">🌟</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
