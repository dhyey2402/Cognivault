import { motion } from 'framer-motion';
import { Clock, Activity } from 'lucide-react';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return 'Over a month ago';
};

export default function ActivityFeed({ activities }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      className="glass-panel rounded-3xl flex flex-col h-[400px] border border-white/10"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Recent Activity
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 dark-scrollbar">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => {
            const timeAgo = formatTimeAgo(activity.timestamp);
            
            return (
              <div key={index} className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200 leading-snug">{activity.message}</p>
                  <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeAgo}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
