import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Tags, FolderOpen, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: 'bg-indigo-500', icon: 'FolderOpen' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined colors and icons for the redesigned cards (dark mode compatible)
  const colorOptions = [
    { name: 'Indigo', class: 'bg-indigo-500', light: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    { name: 'Rose', class: 'bg-rose-500', light: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    { name: 'Emerald', class: 'bg-emerald-500', light: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    { name: 'Amber', class: 'bg-amber-500', light: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    { name: 'Sky', class: 'bg-sky-500', light: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
    { name: 'Purple', class: 'bg-purple-500', light: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  ];

  const iconOptions = ['FolderOpen', 'Code', 'Calculator', 'FlaskConical', 'Globe', 'Palette', 'Book', 'Cpu'];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      // Inject visual properties
      const enhancedData = data.map((c, i) => ({
        ...c,
        visuals: colorOptions[i % colorOptions.length]
      }));
      setCategories(enhancedData);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        description: category.description,
        color: category.visuals?.class || colorOptions[0].class
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', color: colorOptions[Math.floor(Math.random() * colorOptions.length)].class });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        toast.success('Category updated');
      } else {
        await api.createCategory(formData);
        toast.success('Category created');
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Tags className="w-8 h-8 text-[var(--color-primary)]" /> Categories
          </h1>
          <p className="text-slate-400 mt-1">Organize quizzes by subject or topic.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[var(--color-primary-light)] shadow-sm hover:shadow-glow transition-all active:scale-[0.98] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Category
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel rounded-3xl h-64 border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-xl mb-4 animate-pulse"></div>
                <div className="w-3/4 h-6 bg-white/10 rounded-md animate-pulse mb-3"></div>
                <div className="w-full h-4 bg-white/5 rounded-md animate-pulse"></div>
              </div>
              <div className="border-t border-white/10 pt-4 mt-6">
                <div className="w-full h-8 bg-white/5 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const visuals = category.visuals || colorOptions[0];
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={category.id}
                className={`group relative glass-panel rounded-3xl shadow-sm hover:shadow-glow border border-white/10 hover:${visuals.border} overflow-hidden transition-all duration-300 flex flex-col h-full hover:-translate-y-1`}
              >
                {/* Background Tint */}
                <div className={`absolute inset-0 ${visuals.light} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                
                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${visuals.light} ${visuals.text} flex items-center justify-center mb-6 shadow-sm border ${visuals.border}`}>
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {category.name}
                  </h2>
                  
                  <p className="text-slate-400 text-sm line-clamp-2 flex-1 mb-6">
                    {category.description || 'No description provided.'}
                  </p>
                  
                  <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="text-sm font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors bg-white/5 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-sm font-bold text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors bg-white/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl border border-dashed border-white/20 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
            <FolderOpen className="w-10 h-10 text-[var(--color-primary-light)] opacity-50" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-2">No categories yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Create your first category to start organizing quizzes and content effectively.</p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-light)] shadow-sm hover:shadow-glow transition-all active:scale-[0.98] inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create Category
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel bg-slate-900 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-glow border border-white/10"
            >
              <h2 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-white"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-white resize-none"
                    placeholder="What is this category about?"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-500" /> Color Accent
                  </label>
                  <div className="flex gap-3">
                    {colorOptions.map(color => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.class })}
                        className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-all ${
                          formData.color === color.class ? 'ring-4 ring-offset-2 ring-[var(--color-primary)] ring-offset-slate-900 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-3 text-slate-300 font-bold bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-3 text-white font-bold bg-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary-light)] shadow-sm hover:shadow-glow transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Save Category'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
