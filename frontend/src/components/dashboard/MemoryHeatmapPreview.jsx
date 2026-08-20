import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemoryHeatmapPreview({ heatmapData, attemptId }) {
  // A compact visualization of the heatmap data
  // heatmapData should have an array of nodes/topics with retention strength (0-100)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="glass-panel p-6 rounded-3xl h-full flex flex-col relative overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:border-white/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-400" /> Memory Heatmap
        </h3>
        {attemptId && (
          <Link to={`/results/${attemptId}`} className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded-full hover:bg-white/5">
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {heatmapData && heatmapData.nodes?.length > 0 ? (
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-5 gap-2">
            {heatmapData.nodes.slice(0, 15).map((node, i) => {
              // Calculate color based on retention/score
              const strength = node.retention || node.score || 0;
              let bgColor = 'bg-slate-700/50';
              if (strength >= 80) bgColor = 'bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
              else if (strength >= 50) bgColor = 'bg-indigo-500/80';
              else if (strength > 0) bgColor = 'bg-rose-500/80';

              return (
                <div 
                  key={i} 
                  className={`w-full aspect-square rounded-md ${bgColor} border border-white/10`}
                  title={node.topic || 'Topic'}
                />
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-4 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            <span>Needs Review</span>
            <span>Strong</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-slate-500">
            <Brain className="w-6 h-6" />
          </div>
          <p className="text-slate-400 text-sm max-w-[200px]">Complete a quiz to generate your retention heatmap.</p>
        </div>
      )}
    </motion.div>
  );
}
