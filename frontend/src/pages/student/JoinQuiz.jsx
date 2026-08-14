import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function JoinQuiz() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      handleJoin();
    }
  }, [code]);

  const handleJoin = async () => {
    try {
      const quizDetails = await api.getQuizByJoinCode(code);
      toast.success('Quiz found! Redirecting...');
      setTimeout(() => {
        navigate(`/quizzes/${quizDetails.id}`);
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid join code');
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-glow"
      >
        <BrainCircuit className="w-10 h-10 text-[var(--color-primary)] animate-pulse" />
      </motion.div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Looking up quiz...</h2>
      <p className="text-slate-500 max-w-sm">Checking the code <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold">{code}</span></p>
    </div>
  );
}
