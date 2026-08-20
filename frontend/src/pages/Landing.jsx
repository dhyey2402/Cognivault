import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import SpatialBackground from '../components/ui/SpatialBackground';

// Landing Sections
import HeroSection from '../components/landing/HeroSection';
import WhyQuizora from '../components/landing/WhyQuizora';
import ExamShieldSection from '../components/landing/ExamShieldSection';
import KnowledgeGalaxySection from '../components/landing/KnowledgeGalaxySection';
import FocusDNASection from '../components/landing/FocusDNASection';
import StoryModeSection from '../components/landing/StoryModeSection';
import MemoryHeatmapSection from '../components/landing/MemoryHeatmapSection';
import ExperienceSection from '../components/landing/ExperienceSection';
import LifecycleSection from '../components/landing/LifecycleSection';
import SecurityComparisonSection from '../components/landing/SecurityComparisonSection';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans selection:bg-indigo-500/30 scroll-smooth">
      <SpatialBackground />
      
      {/* Dynamic Overlay Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-slate-950"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Quizora</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#experiences" className="hover:text-white transition-colors">Platform</a>
            <a href="#integrity" className="hover:text-white transition-colors">Integrity</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-400/50">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection />

      {/* Differentiators */}
      <WhyQuizora />

      {/* ExamShield™ Major Section */}
      <div id="integrity">
        <ExamShieldSection />
      </div>

      <div id="experiences">
        {/* Knowledge Galaxy */}
        <KnowledgeGalaxySection />

        {/* Focus DNA */}
        <FocusDNASection />

        {/* Adaptive Story Mode */}
        <StoryModeSection />

        {/* Memory Heatmap */}
        <MemoryHeatmapSection />
      </div>

      {/* Student & Admin Experience */}
      <ExperienceSection />

      {/* Assessment Lifecycle */}
      <LifecycleSection />

      {/* Security & Feature Comparison */}
      <div id="security">
        <SecurityComparisonSection />
      </div>

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <LandingFooter />

    </div>
  );
}
