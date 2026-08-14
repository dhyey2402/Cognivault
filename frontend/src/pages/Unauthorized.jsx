import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-md w-full px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm"
        >
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </motion.div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Access Restricted</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          You don't have permission to view this page. Please contact your administrator or sign in with an authorized account.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] hover:to-[var(--color-primary-light)] font-bold shadow-sm hover:shadow-glow transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center py-3 px-4 border-2 border-slate-200 rounded-xl text-slate-600 bg-transparent hover:bg-slate-50 hover:border-slate-300 font-bold transition-all active:scale-[0.98]"
          >
            Sign in with a different account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
