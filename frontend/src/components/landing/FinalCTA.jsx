import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] p-12 md:p-24 text-center border border-indigo-500/20 shadow-[0_0_100px_rgba(79,70,229,0.15)] relative overflow-hidden">
        {/* Subtle 3D background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-white leading-tight">
            Your Next Assessment Should Be More Intelligent.
          </h2>
          <p className="text-indigo-200 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Create engaging assessments. Protect examination integrity. Understand how students learn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-indigo-900 font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-transform text-lg shadow-xl">
              Start Exploring <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 bg-indigo-900/50 text-white font-extrabold rounded-2xl border border-indigo-500/30 hover:bg-indigo-800/50 transition-colors text-lg">
              Experience Quizora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
