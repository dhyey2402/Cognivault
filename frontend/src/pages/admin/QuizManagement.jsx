import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, BookOpen, Link as LinkIcon, Search, LayoutGrid, List, Clock, Copy, MoreHorizontal, Globe, Globe2, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Step-based modal state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    duration_minutes: 30,
    passing_score: 50,
    max_attempts: 1,
    difficulty: 'MEDIUM'
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesData, categoriesData] = await Promise.all([
        api.getAdminQuizzes(),
        api.getCategories()
      ]);
      setQuizzes(quizzesData);
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormData(prev => ({ ...prev, category_id: categoriesData[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({
        title: quiz.title,
        description: quiz.description,
        category_id: quiz.category_id,
        duration: quiz.duration || quiz.duration_minutes || 30,
        passing_score: quiz.passing_score || 50,
        max_attempts: quiz.max_attempts || 1,
        difficulty: quiz.difficulty || 'MEDIUM'
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        category_id: categories.length > 0 ? categories[0].id : null,
        duration: 30,
        passing_score: 50,
        max_attempts: 1,
        difficulty: 'MEDIUM'
      });
    }
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingQuiz) {
        await api.updateQuiz(editingQuiz.id, formData);
        toast.success('Quiz updated');
      } else {
        await api.createQuiz(formData);
        toast.success('Quiz created');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMessage = Array.isArray(detail) ? detail[0].msg : (detail || 'Failed to save quiz');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete all questions and attempts associated with this quiz.')) return;
    try {
      await api.deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
      toast.success('Quiz deleted');
    } catch (err) {
      toast.error('Failed to delete quiz');
    }
  };

  const handleTogglePublish = async (quiz) => {
    const newStatus = quiz.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.updateQuiz(quiz.id, { status: newStatus });
      setQuizzes(quizzes.map(q => q.id === quiz.id ? { ...q, status: newStatus } : q));
      toast.success(`Quiz ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error('Failed to update quiz status');
    }
  };

  const handleCopyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`);
    toast.success('Join link copied!');
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyTheme = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
      case 'HARD': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
      default: return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-card border border-slate-100 flex flex-col gap-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[var(--color-primary)]" /> Quizzes
            </h1>
            <p className="text-slate-500 mt-1">Create and manage your assessments</p>
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-sm hover:shadow-glow hover:bg-[var(--color-primary-light)] transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create Quiz
          </button>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 transition-colors text-sm font-medium"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
        </div>
      ) : filteredQuizzes.length > 0 ? (
        viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Join Code</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuizzes.map((quiz, i) => {
                    const theme = getDifficultyTheme(quiz.difficulty);
                    return (
                      <tr key={quiz.id} className={`group hover:bg-[#FAFBFC] transition-colors ${i % 2 !== 0 ? 'bg-[#FCFCFD]' : ''}`}>
                        <td className="px-6 py-4">
                          <Link to={`/admin/quizzes/${quiz.id}/builder`} className="block">
                            <div className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{quiz.title}</div>
                            <div className="text-sm text-slate-500 line-clamp-1 mt-0.5">{quiz.description || 'No description'}</div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${theme.bg} ${theme.text} ${theme.border}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></div>
                            {quiz.difficulty || 'MEDIUM'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" /> {quiz.duration || 30}m
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                              {quiz.join_code}
                            </span>
                            <button 
                              onClick={() => handleCopyLink(quiz.join_code)}
                              className="p-1 text-slate-400 hover:text-[var(--color-primary)] hover:bg-indigo-50 rounded transition-colors"
                              title="Copy join link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleTogglePublish(quiz)}
                              className={`p-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-1 ${
                                quiz.status === 'PUBLISHED' 
                                ? 'text-emerald-600 hover:bg-emerald-50' 
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title={quiz.status === 'PUBLISHED' ? "Unpublish Quiz" : "Publish Quiz"}
                            >
                              {quiz.status === 'PUBLISHED' ? <Globe2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <Link
                              to={`/admin/quizzes/${quiz.id}/builder`}
                              className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" /> <span className="hidden sm:inline">Builder</span>
                            </Link>
                            <button
                              onClick={() => handleOpenModal(quiz)}
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit settings"
                            >
                              <SettingsIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(quiz.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const theme = getDifficultyTheme(quiz.difficulty);
              return (
                <div key={quiz.id} className="bg-white rounded-3xl shadow-sm hover:shadow-card border border-slate-100 overflow-hidden group transition-all duration-300 flex flex-col hover:-translate-y-1 relative">
                  {/* Top Color Accent */}
                  <div className={`h-2 ${theme.dot}`}></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${theme.bg} ${theme.text}`}>
                        {quiz.difficulty || 'MEDIUM'}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-bold bg-slate-50 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5" /> {quiz.duration || 30}m
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{quiz.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">{quiz.description || 'No description'}</p>
                    
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                      <div className="font-mono text-xs font-bold bg-slate-50 text-slate-700 px-2 py-1 rounded border border-slate-200">
                        {quiz.join_code}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleTogglePublish(quiz)}
                          className={`p-2 rounded-lg transition-colors ${
                            quiz.status === 'PUBLISHED' 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                          title={quiz.status === 'PUBLISHED' ? "Unpublish Quiz" : "Publish Quiz"}
                        >
                          {quiz.status === 'PUBLISHED' ? <Globe2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <Link to={`/admin/quizzes/${quiz.id}/builder`} className="p-2 bg-indigo-50 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(quiz.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6">
            <BookOpen className="w-10 h-10 text-[var(--color-primary-light)] opacity-50" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No quizzes found</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Create your first quiz to start assessing your students.</p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-light)] shadow-sm transition-all active:scale-[0.98] inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create Quiz
          </button>
        </div>
      )}

      {/* Multi-step Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-8 max-w-xl w-full relative z-10 shadow-2xl border border-slate-100">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {editingQuiz ? 'Edit Settings' : 'New Quiz'}
                </h2>
                {/* Step indicator */}
                <div className="flex gap-2">
                  {[1, 2].map(step => (
                    <div key={step} className={`w-2 h-2 rounded-full ${currentStep === step ? 'bg-[var(--color-primary)] w-4' : 'bg-slate-200'} transition-all duration-300`}></div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Quiz Title</label>
                      <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-slate-900" placeholder="e.g. Midterm Assessment" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-slate-900">
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                      <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-slate-900 resize-none" placeholder="Provide instructions or details..."></textarea>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Settings */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Duration (mins)</label>
                        <input type="number" required min="1" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] font-medium text-slate-900" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Passing Score (%)</label>
                        <input type="number" required min="1" max="100" value={formData.passing_score} onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] font-medium text-slate-900" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Max Attempts</label>
                        <input type="number" required min="1" value={formData.max_attempts} onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] font-medium text-slate-900" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty</label>
                        <select required value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] font-medium text-slate-900">
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-between pt-8 mt-6 border-t border-slate-100">
                  {currentStep === 1 ? (
                    <div key="step1-buttons" className="flex justify-between w-full">
                      <button type="button" onClick={handleCloseModal} className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                      <button type="button" onClick={() => setCurrentStep(2)} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Next Step →</button>
                    </div>
                  ) : (
                    <div key="step2-buttons" className="flex justify-between w-full">
                      <button type="button" onClick={() => setCurrentStep(1)} className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">← Back</button>
                      <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-light)] shadow-sm hover:shadow-glow transition-all active:scale-95 disabled:opacity-70">
                        {isSubmitting ? 'Saving...' : 'Save Quiz'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple icon component to avoid adding it to lucide imports at top
function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}
