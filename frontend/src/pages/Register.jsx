import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { UserPlus, Rocket, GraduationCap, Star, Book, CheckCircle, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('STUDENT');

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 33;
    if (password.length >= 10) strength += 33;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength += 34;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColor = strength <= 33 ? 'bg-red-400' : strength <= 66 ? 'bg-amber-400' : 'bg-emerald-400';
  const strengthText = strength <= 33 ? 'Weak' : strength <= 66 ? 'Medium' : 'Strong';
  const strengthTextColor = strength <= 33 ? 'text-red-500' : strength <= 66 ? 'text-amber-500' : 'text-emerald-500';

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(data.name, data.email, data.password, selectedRole);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to register');
      document.getElementById('register-form').classList.add('animate-shake');
      setTimeout(() => {
        document.getElementById('register-form')?.classList.remove('animate-shake');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel (Decorative) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--color-secondary)]">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-80" style={{
          background: 'radial-gradient(circle at 15% 50%, #0EA5E9 0%, transparent 50%), radial-gradient(circle at 85% 30%, #38BDF8 0%, transparent 50%), radial-gradient(circle at 50% 80%, #6366F1 0%, transparent 50%)',
          filter: 'blur(60px)',
          animation: 'pulse-glow 15s infinite alternate'
        }}></div>

        {/* Floating Icons */}
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 text-white/20">
          <Rocket size={64} />
        </motion.div>
        <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-2/3 left-1/5 text-white/20">
          <GraduationCap size={48} />
        </motion.div>
        <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-1/3 right-1/4 text-white/20">
          <Star size={56} />
        </motion.div>
        <motion.div animate={{ y: [12, -12, 12] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-1/4 right-1/3 text-white/20">
          <Book size={50} />
        </motion.div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-center text-white">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl max-w-sm"
          >
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Begin Your Learning Adventure</h2>
            <p className="text-sky-100 mb-8 leading-relaxed">
              Create an account to start taking quizzes, tracking your progress, and mastering new skills.
            </p>
            <div className="inline-flex items-center gap-2 bg-black/20 rounded-full px-4 py-2 text-sm font-medium border border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Join 5,200+ students already on board
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 overflow-y-auto py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="w-8 h-8 text-[var(--color-primary)]" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Cognivault</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create your account</h2>
          <p className="text-slate-500 mb-8">Start your learning journey with Cognivault</p>

          <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="relative group">
                <input type="text" id="name" {...register('name', { required: 'Name is required' })} className="peer w-full bg-slate-50 border-b-2 border-slate-200 px-4 pt-5 pb-2 text-slate-900 placeholder-transparent focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-t-xl" placeholder="Name" />
                <label htmlFor="name" className="absolute left-4 top-1 text-slate-400 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] font-medium">Full name</label>
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">⚠ {errors.name.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="relative group">
                <input type="email" id="email" {...register('email', { required: 'Email is required' })} className="peer w-full bg-slate-50 border-b-2 border-slate-200 px-4 pt-5 pb-2 text-slate-900 placeholder-transparent focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-t-xl" placeholder="Email" />
                <label htmlFor="email" className="absolute left-4 top-1 text-slate-400 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] font-medium">Email address</label>
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">⚠ {errors.email.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${selectedRole === 'STUDENT' ? 'border-[var(--color-primary)] bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="STUDENT" checked={selectedRole === 'STUDENT'} onChange={() => setSelectedRole('STUDENT')} className="sr-only" />
                  <GraduationCap className={`w-6 h-6 mb-2 ${selectedRole === 'STUDENT' ? 'text-[var(--color-primary)]' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm ${selectedRole === 'STUDENT' ? 'text-[var(--color-primary)]' : 'text-slate-700'}`}>Student</span>
                  <span className="text-xs text-slate-500 mt-1 leading-snug">Take quizzes & track progress</span>
                  {selectedRole === 'STUDENT' && <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[var(--color-primary)] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>}
                </label>
                <label className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${selectedRole === 'TEACHER' ? 'border-[var(--color-primary)] bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="TEACHER" checked={selectedRole === 'TEACHER'} onChange={() => setSelectedRole('TEACHER')} className="sr-only" />
                  <Book className={`w-6 h-6 mb-2 ${selectedRole === 'TEACHER' ? 'text-[var(--color-primary)]' : 'text-slate-400'}`} />
                  <span className={`font-bold text-sm ${selectedRole === 'TEACHER' ? 'text-[var(--color-primary)]' : 'text-slate-700'}`}>Teacher</span>
                  <span className="text-xs text-slate-500 mt-1 leading-snug">Create & manage assessments</span>
                  {selectedRole === 'TEACHER' && <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[var(--color-primary)] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"></div></div>}
                </label>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="relative group">
                <input type="password" id="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} className="peer w-full bg-slate-50 border-b-2 border-slate-200 px-4 pt-5 pb-2 text-slate-900 placeholder-transparent focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-t-xl" placeholder="Password" />
                <label htmlFor="password" className="absolute left-4 top-1 text-slate-400 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] font-medium">Password</label>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width: `${strength}%` }}></div>
                  </div>
                  <p className={`text-[11px] font-medium mt-1 ${strengthTextColor}`}>Password strength: {strengthText}</p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-500">⚠ {errors.password.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="relative group">
                <input type="password" id="confirmPassword" {...register('confirmPassword', { required: 'Confirm password' })} className="peer w-full bg-slate-50 border-b-2 border-slate-200 px-4 pt-5 pb-2 text-slate-900 placeholder-transparent focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all rounded-t-xl" placeholder="Confirm Password" />
                <label htmlFor="confirmPassword" className="absolute left-4 top-1 text-slate-400 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-primary)] font-medium">Confirm Password</label>
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-emerald-500" />
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-2">
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
                      <UserPlus className="h-5 w-5 text-indigo-300 group-hover:text-white transition-colors" />
                    </span>
                    Create Account
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">
                By signing up, you agree to our <a href="#" className="text-[var(--color-primary)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--color-primary)] hover:underline">Privacy Policy</a>
              </p>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center text-sm text-slate-500 pb-8">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] relative group">
              Sign in
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all group-hover:w-full"></span>
            </Link>
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
