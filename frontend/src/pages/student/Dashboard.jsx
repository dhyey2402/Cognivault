import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Target, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardHero from '../../components/dashboard/DashboardHero';
import MetricCard from '../../components/dashboard/MetricCard';
import ContinueLearning from '../../components/dashboard/ContinueLearning';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import KnowledgeGalaxyPreview from '../../components/dashboard/KnowledgeGalaxyPreview';
import FocusDNAPreview from '../../components/dashboard/FocusDNAPreview';
import MemoryHeatmapPreview from '../../components/dashboard/MemoryHeatmapPreview';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [galaxy, setGalaxy] = useState(null);
  const [dna, setDna] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [recentAttemptId, setRecentAttemptId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Primary Data Fetch
      const [data, galaxyData] = await Promise.all([
        api.getStudentDashboard(),
        api.getKnowledgeGalaxy().catch(() => null)
      ]);
      setStats(data);
      if (galaxyData) setGalaxy(galaxyData);

      // Secondary Data Fetch (Focus DNA & Heatmap for the most recent attempt)
      const attempts = data?.recent_attempts || [];
      if (attempts.length > 0) {
        const latestId = attempts[0].id;
        setRecentAttemptId(latestId);
        
        // Fetch them simultaneously, ignoring individual failures
        Promise.all([
          api.getFocusDNA(latestId).catch(() => null),
          api.getMemoryHeatmap(latestId).catch(() => null)
        ]).then(([dnaData, heatmapData]) => {
          if (dnaData) setDna(dnaData);
          if (heatmapData) setHeatmap(heatmapData);
        });
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    total_attempts = 0,
    average_score = 0,
    highest_score = 0,
    passed_quizzes = 0,
    recent_attempts = [],
    performance_history = []
  } = stats || {};

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative z-10">
      
      {/* Hero Section */}
      <DashboardHero user={user} stats={stats} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Attempted"
          value={total_attempts}
          colorClass="text-indigo-400"
          icon={<Target className="w-6 h-6" />}
          delay={0.1}
        />
        <MetricCard
          title="Avg Score"
          value={`${average_score}%`}
          colorClass="text-amber-400"
          icon={<Trophy className="w-6 h-6" />}
          delay={0.2}
        />
        <MetricCard
          title="Best Score"
          value={`${highest_score}%`}
          colorClass="text-emerald-400"
          icon={<CheckCircle2 className="w-6 h-6" />}
          delay={0.3}
        />
        <MetricCard
          title="Passed"
          value={passed_quizzes}
          colorClass="text-purple-400"
          icon={<Clock className="w-6 h-6" />}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning recommendation */}
          <ContinueLearning recentAttempts={recent_attempts} />
          
          {/* Performance Chart */}
          <PerformanceChart history={performance_history} />

          {/* Knowledge Galaxy Preview */}
          <KnowledgeGalaxyPreview galaxy={galaxy} />
        </div>

        <div className="space-y-8">
          {/* Focus DNA Preview */}
          <FocusDNAPreview dnaData={dna} attemptId={recentAttemptId} />
          
          {/* Memory Heatmap Preview */}
          <MemoryHeatmapPreview heatmapData={heatmap} attemptId={recentAttemptId} />
          
          {/* Activity Timeline */}
          <ActivityTimeline attempts={recent_attempts} />
        </div>
      </div>
    </div>
  );
}
