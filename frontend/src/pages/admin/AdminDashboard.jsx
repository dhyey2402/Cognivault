import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Users, Target, Activity, BookOpen, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import AdminHero from '../../components/admin/dashboard/AdminHero';
import ExecutiveMetric from '../../components/admin/dashboard/ExecutiveMetric';
import PlatformPulse from '../../components/admin/dashboard/PlatformPulse';
import LearningEcosystem from '../../components/admin/dashboard/LearningEcosystem';
import QuizIntelligence from '../../components/admin/dashboard/QuizIntelligence';
import AttentionCenter from '../../components/admin/dashboard/AttentionCenter';
import ActivityFeed from '../../components/admin/dashboard/ActivityFeed';
import TopPerformers from '../../components/admin/dashboard/TopPerformers';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px] text-slate-400">
        Dashboard data is unavailable.
      </div>
    );
  }

  // Calculate some simple trends based on available data (for the UI)
  const studentTrend = {
    isPositive: stats.student_stats?.new_30d > 0,
    isNeutral: stats.student_stats?.new_30d === 0,
    value: `+${stats.student_stats?.new_30d || 0}`,
    label: 'new this month'
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative z-10">
      
      <AdminHero user={user} stats={stats} />

      {/* Executive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ExecutiveMetric
          title="Total Students"
          value={stats.student_stats?.total || 0}
          subtitle={`${stats.student_stats?.active || 0} active`}
          icon={<Users className="w-6 h-6" />}
          delay={0.1}
          trend={studentTrend}
        />
        <ExecutiveMetric
          title="Total Attempts"
          value={stats.attempt_stats?.total || 0}
          subtitle={`${stats.attempt_stats?.completed || 0} completed`}
          icon={<Target className="w-6 h-6" />}
          delay={0.2}
        />
        <ExecutiveMetric
          title="Avg Score"
          value={`${stats.attempt_stats?.average_score || 0}%`}
          subtitle={`Pass rate: ${stats.pass_fail_analytics?.pass_percentage || 0}%`}
          icon={<Activity className="w-6 h-6" />}
          delay={0.3}
        />
        <ExecutiveMetric
          title="Published Quizzes"
          value={stats.quiz_stats?.published || 0}
          subtitle={`${stats.quiz_stats?.draft || 0} in draft`}
          icon={<BookOpen className="w-6 h-6" />}
          delay={0.4}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Primary Data) */}
        <div className="lg:col-span-2 space-y-8">
          <PlatformPulse data={stats.attempts_over_time} />
          <QuizIntelligence quizzes={stats.quiz_intelligence || stats.popular_quizzes} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LearningEcosystem categories={stats.category_health} />
            <TopPerformers performers={stats.top_performers} />
          </div>
        </div>

        {/* Right Column (Live/Attention) */}
        <div className="space-y-8">
          <AttentionCenter items={stats.attention_items} />
          <ActivityFeed activities={stats.recent_activity} />
        </div>

      </div>

    </div>
  );
}
