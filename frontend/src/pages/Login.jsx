import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { LogIn, BrainCircuit, Lightbulb, Trophy, Target, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { getErrorMessage } from '../utils/error';
export default function Login() {
  const storedEmail = localStorage.getItem('rememberedEmail');
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: storedEmail || ''
    }
  });
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN' || user.role === 'TEACHER') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const userProfile = await login(data.email, data.password, rememberMe);
      toast.success('Welcome back!');
      if (userProfile.role === 'ADMIN' || userProfile.role === 'TEACHER') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      // trigger shake animation
      document.getElementById('login-form').classList.add('animate-shake');
      setTimeout(() => {
        document.getElementById('login-form')?.classList.remove('animate-shake');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel (Decorative) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--color-primary)]">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-80" style={{
          background: 'radial-gradient(circle at 15% 50%, #4F46E5 0%, transparent 50%), radial-gradient(circle at 85% 30%, #0EA5E9 0%, transparent 50%), radial-gradient(circle at 50% 80%, #6366F1 0%, transparent 50%)',
          filter: 'blur(60px)',
          animation: 'pulse-glow 15s infinite alternate'
        }}></div>

        {/* Floating Icons */}
        <motion.div 
          animate={{ y: [-10, 10, -10] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 text-white/20"
        >
          <BrainCircuit size={64} />
        </motion.div>
        <motion.div 
          animate={{ y: [10, -10, 10] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-2/3 left-1/5 text-white/20"
        >
          <Lightbulb size={48} />
        </motion.div>
        <motion.div 
          animate={{ y: [-15, 15, -15] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-1/4 text-white/20"
        >
          <Trophy size={56} />
        </motion.div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-center text-white">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl max-w-sm"
          >
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Where Knowledge Meets Clarity</h2>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              Join thousands of students mastering their subjects through intelligent assessment.
            </p>
            <div className="inline-flex items-center gap-2 bg-black/20 rounded-full px-4 py-2 text-sm font-medium border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              12,847 quizzes completed this month
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div className="flex items-center gap-2 mb-8">
            <BrainCircuit className="w-8 h-8 text-[var(--color-primary)]" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Quizora</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Sign in to continue your learning journey</p>

          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  {...register('email', { required: 'Email is required' })}
                  className="peer w-full bg-slate-50 border-b-2 border-slate-200 px-4 pt-5 pb-2 text-slate-900 placeholder-transparent focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-t-xl"
                  placeholder="Email"
                />
                <label 
                  htmlFor="email"
                  className="absolute left-4 top-1 text-slate-400 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] font-medium"
                >
                  Email address
                </label>
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    ⚠ {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', { required: 'Password is required' })}
                  className="peer w-full bg-slate-50 border-b-2 border-slate-200 px-4 pt-5 pb-2 text-slate-900 placeholder-transparent focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-t-xl pr-10"
                  placeholder="Password"
                />
                <label 
                  htmlFor="password"
                  className="absolute left-4 top-1 text-slate-400 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] font-medium"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    ⚠ {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded focus:ring-[var(--color-primary)] checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)] transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-5 h-5 p-1 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] relative group">
                  Forgot password?
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all group-hover:w-full"></span>
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] hover:to-[var(--color-primary-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] shadow-sm hover:shadow-glow transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex space-x-1.5 items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LogIn className="h-5 w-5 text-indigo-300 group-hover:text-white transition-colors" />
                    </span>
                    Sign in
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">or continue with</span>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] relative group">
                Sign up
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all group-hover:w-full"></span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
