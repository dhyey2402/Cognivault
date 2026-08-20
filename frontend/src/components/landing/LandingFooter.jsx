import { BrainCircuit } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-slate-950 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
                <BrainCircuit className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Cognivault</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Intelligent assessment infrastructure built for modern education and rigorous organizational training.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Assessments</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">ExamShield™</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Solutions</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">For Students</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">For Educators</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Universities</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Organizations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-600 text-sm border-t border-white/5 pt-8">
          <p>&copy; {new Date().getFullYear()} Cognivault Technologies. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Engineered with precision.</p>
        </div>
      </div>
    </footer>
  );
}
