import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { Users, BookOpen, FileText, Target, Activity, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary-dark)] rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Monitor platform activity and student performance.</p>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          Last updated: Just now
        </div>
      </div>

      {/* Stats Cards Row (Horizontally scrollable on mobile) */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 custom-scrollbar">
        <div className="min-w-[240px] flex-1">
          <StatCard
            title="Total Students"
            value={stats?.total_students || 0}
            icon={<Users className="w-6 h-6" />}
            bg="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
            delay={0.1}
          />
        </div>
        <div className="min-w-[240px] flex-1">
          <StatCard
            title="Total Quizzes"
            value={stats?.total_quizzes || 0}
            icon={<BookOpen className="w-6 h-6" />}
            bg="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600"
            delay={0.2}
          />
        </div>
        <div className="min-w-[240px] flex-1">
          <StatCard
            title="Questions"
            value={stats?.total_questions || 0}
            icon={<FileText className="w-6 h-6" />}
            bg="bg-gradient-to-br from-teal-100 to-teal-200 text-teal-600"
            delay={0.3}
          />
        </div>
        <div className="min-w-[240px] flex-1">
          <StatCard
            title="Total Attempts"
            value={stats?.total_attempts || 0}
            icon={<Target className="w-6 h-6" />}
            bg="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600"
            delay={0.4}
          />
        </div>
        <div className="min-w-[240px] flex-1">
          <StatCard
            title="Avg Score"
            value={`${stats?.average_score || 0}%`}
            icon={<Activity className="w-6 h-6" />}
            bg="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600"
            delay={0.5}
          />
        </div>
      </div>


    </div>
  );
}
