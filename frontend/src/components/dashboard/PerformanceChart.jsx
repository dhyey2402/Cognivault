import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ history }) {
  const [chartFilter, setChartFilter] = useState('Last 10');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="glass-panel p-6 lg:p-8 rounded-3xl h-full flex flex-col group hover:border-white/20 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Performance Trend
        </h2>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1 backdrop-blur-sm">
          {['Last 5', 'Last 10', 'All'].map(filter => (
            <button
              key={filter}
              onClick={() => setChartFilter(filter)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${chartFilter === filter ? 'bg-indigo-500/20 shadow-sm text-indigo-300' : 'text-slate-400 hover:text-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full min-h-[288px]">
        {history && history.length > 0 ? (
          <ResponsiveContainer width="100%" height={288} minWidth={1}>
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="title" 
                tick={{fontSize: 12, fill: '#94A3B8'}} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
              />
              <YAxis 
                tick={{fontSize: 12, fill: '#94A3B8'}} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                stroke="#818cf8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8', className: 'animate-pulse' }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">No performance data yet</p>
            <p className="text-sm text-slate-500 mt-1">Take some quizzes to see your trend</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
