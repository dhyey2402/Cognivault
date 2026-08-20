import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart as BarChartIcon, TrendingUp, Users, Target } from 'lucide-react';
import PlatformPulse from '../../components/admin/dashboard/PlatformPulse';
import LearningEcosystem from '../../components/admin/dashboard/LearningEcosystem';
import QuizIntelligence from '../../components/admin/dashboard/QuizIntelligence';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load analytics data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <BarChartIcon className="w-8 h-8 text-[var(--color-primary)]" />
            Platform Analytics
          </h1>
          <p className="text-slate-500 mt-2">Deep dive into platform engagement and assessment metrics.</p>
        </div>
      </div>

      {/* Primary Analytics Section */}
      <PlatformPulse data={stats.attempts_over_time} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LearningEcosystem categories={stats.category_health} />
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <TrendingUp className="w-32 h-32 text-slate-800" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-6 w-full text-left">Pass vs Fail Ratio</h3>
           <div className="flex w-full items-center justify-evenly mt-4 relative z-10">
             <div className="text-center">
                <p className="text-emerald-500 text-5xl font-black">{stats.pass_fail_analytics?.pass_percentage || 0}%</p>
                <p className="text-slate-500 mt-2 font-medium">Pass Rate</p>
                <p className="text-slate-400 text-sm">{stats.pass_fail_analytics?.passed || 0} Passed</p>
             </div>
             <div className="h-24 w-px bg-slate-200 mx-4"></div>
             <div className="text-center">
                <p className="text-rose-500 text-5xl font-black">{stats.pass_fail_analytics?.pass_percentage ? (100 - stats.pass_fail_analytics.pass_percentage).toFixed(2) : 0}%</p>
                <p className="text-slate-500 mt-2 font-medium">Fail Rate</p>
                <p className="text-slate-400 text-sm">{stats.pass_fail_analytics?.failed || 0} Failed</p>
             </div>
           </div>
        </div>
      </div>

      <QuizIntelligence quizzes={stats.quiz_intelligence || stats.popular_quizzes} />
    </div>
  );
}
