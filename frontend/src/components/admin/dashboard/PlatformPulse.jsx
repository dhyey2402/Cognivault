import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PlatformPulse({ data }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="glass-panel p-6 rounded-3xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Platform Pulse
          </h2>
          <p className="text-sm text-slate-400 mt-1">Assessment completion volume (30 Days)</p>
        </div>
      </div>

      <div className="h-72 w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12, fill: '#64748b'}} 
                tickLine={false} 
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                tick={{fontSize: 12, fill: '#64748b'}} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="attempts" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAttempts)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#22d3ee', className: 'animate-pulse' }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">No activity data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
