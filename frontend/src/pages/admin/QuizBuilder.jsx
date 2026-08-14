import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Plus, Save, Trash2, GripVertical, CheckCircle2, Copy, Check, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function QuizBuilder() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for new/editing question
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState(getInitialQuestionForm());
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchQuizAndQuestions();
  }, [quizId]);

  const fetchQuizAndQuestions = async () => {
    try {
      const data = await api.getQuiz(quizId);
      setQuiz(data);
      setQuestions(data.questions || []);
    } catch (err) {
      toast.error('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  function getInitialQuestionForm() {
    return {
      text: '',
      marks: 1.0,
      difficulty: 'MEDIUM',
      explanation: '',
      options: [
        { text: '', is_correct: true },
        { text: '', is_correct: false },
      ]
    };
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${quiz?.join_code}`);
    setCopied(true);
    toast.success('Join link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Option management
  const addOption = () => {
    if (questionForm.options.length >= 6) {
      toast.error('Maximum 6 options allowed');
      return;
    }
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, { text: '', is_correct: false }]
    });
  };

  const updateOptionText = (index, text) => {
    const newOptions = [...questionForm.options];
    newOptions[index].text = text;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const setCorrectOption = (index) => {
    const newOptions = questionForm.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index
    }));
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const removeOption = (index) => {
    if (questionForm.options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    // If we removed the correct option, make the first one correct
    if (!newOptions.some(opt => opt.is_correct)) {
      newOptions[0].is_correct = true;
    }
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    
    if (!questionForm.text.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (questionForm.options.some(opt => !opt.text.trim())) {
      toast.error('All options must have text');
      return;
    }

    setIsSaving(true);
    try {
      if (editingQuestionId) {
        await api.updateQuestion(editingQuestionId, questionForm);
        toast.success('Question updated');
      } else {
        await api.createQuestion(quizId, questionForm);
        toast.success('Question added');
      }
      
      setIsAddingQuestion(false);
      setEditingQuestionId(null);
      setQuestionForm(getInitialQuestionForm());
      fetchQuizAndQuestions();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (q) => {
    setEditingQuestionId(q.id);
    setIsAddingQuestion(false);
    setQuestionForm({
      text: q.text,
      marks: q.marks,
      difficulty: q.difficulty || 'MEDIUM',
      explanation: q.explanation || '',
      options: q.options.map(opt => ({ text: opt.text, is_correct: opt.is_correct }))
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
      toast.success('Question deleted');
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8 mt-2">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/admin/quizzes" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Auto-saved
          </div>
        </div>
        
        <div className="pl-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{quiz?.title}</h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              Join Code: <span className="font-mono text-slate-900 ml-1">{quiz?.join_code}</span>
              <button onClick={handleCopyLink} className="ml-1 text-[var(--color-primary)] hover:text-indigo-800 transition-colors">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              {questions.length} Questions
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {questions.map((q, index) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              className={`bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm relative group ${
                editingQuestionId === q.id ? 'border-[var(--color-primary)] ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Drag Handle (Visual only for now) */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl hover:bg-slate-50">
                <GripVertical className="w-4 h-4" />
              </div>

              {editingQuestionId === q.id ? (
                /* Inline Edit Form */
                <div className="p-6 md:p-8 ml-6">
                  <QuestionForm 
                    formData={questionForm}
                    setFormData={setQuestionForm}
                    addOption={addOption}
                    updateOptionText={updateOptionText}
                    setCorrectOption={setCorrectOption}
                    removeOption={removeOption}
                    onCancel={() => setEditingQuestionId(null)}
                    onSave={handleSaveQuestion}
                    isSaving={isSaving}
                  />
                </div>
              ) : (
                /* Question View Card */
                <div className="p-6 md:p-8 ml-4">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex gap-3 items-start">
                      <span className="text-lg font-bold text-slate-400 mt-1">Q{index + 1}.</span>
                      <h3 className="text-xl font-bold text-slate-900 leading-relaxed">{q.text}</h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(q)} className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6 pl-10">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">{q.marks} Marks</span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wide ${
                      q.difficulty === 'HARD' ? 'bg-red-50 text-red-700' : q.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>{q.difficulty || 'MEDIUM'}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                    {q.options.map((opt) => (
                      <div key={opt.id} className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${
                        opt.is_correct ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          opt.is_correct ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'
                        }`}>
                          {opt.is_correct && <Check className="w-4 h-4" />}
                        </div>
                        <span className={`font-medium ${opt.is_correct ? 'text-emerald-900' : 'text-slate-600'}`}>{opt.text}</span>
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div className="mt-6 ml-10 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3 text-blue-900">
                      <Lightbulb className="w-5 h-5 flex-shrink-0 text-blue-500" />
                      <p className="text-sm font-medium">{q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add New Question Section */}
      <AnimatePresence>
        {!isAddingQuestion && !editingQuestionId ? (
          <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => {
              setQuestionForm(getInitialQuestionForm());
              setIsAddingQuestion(true);
            }}
            className="w-full py-8 border-2 border-dashed border-slate-300 rounded-3xl text-slate-500 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg">Add New Question</span>
          </motion.button>
        ) : isAddingQuestion ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl border-2 border-[var(--color-primary)] p-6 md:p-8 shadow-lg ring-4 ring-indigo-50"
          >
            <div className="flex items-center gap-2 mb-6 text-[var(--color-primary)] font-bold">
              <div className="px-3 py-1 bg-indigo-100 rounded-lg text-sm">New Question</div>
            </div>
            <QuestionForm 
              formData={questionForm}
              setFormData={setQuestionForm}
              addOption={addOption}
              updateOptionText={updateOptionText}
              setCorrectOption={setCorrectOption}
              removeOption={removeOption}
              onCancel={() => setIsAddingQuestion(false)}
              onSave={handleSaveQuestion}
              isSaving={isSaving}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// Extracted Question Form Component for reuse
function QuestionForm({ formData, setFormData, addOption, updateOptionText, setCorrectOption, removeOption, onCancel, onSave, isSaving }) {
  return (
    <form onSubmit={onSave} className="space-y-6">
      <textarea
        required
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        placeholder="Type your question here..."
        className="w-full px-4 py-4 text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-[var(--color-primary)] focus:ring-0 transition-colors resize-none overflow-hidden min-h-[100px]"
        rows="2"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Marks</label>
          <input
            type="number"
            required
            step="0.5"
            min="0.5"
            value={formData.marks}
            onChange={(e) => setFormData({ ...formData, marks: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-slate-900"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Options</label>
        {formData.options.map((opt, index) => (
          <div key={index} className={`flex items-center gap-3 p-2 rounded-xl border-2 transition-all ${opt.is_correct ? 'border-emerald-200 bg-emerald-50/50' : 'border-transparent hover:border-slate-200'}`}>
            <button
              type="button"
              onClick={() => setCorrectOption(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                opt.is_correct ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
              }`}
              title="Mark as correct answer"
            >
              <Check className="w-4 h-4" />
            </button>
            <input
              type="text"
              required
              value={opt.text}
              onChange={(e) => updateOptionText(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-slate-900"
            />
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {formData.options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] flex items-center gap-1 px-2 py-2"
          >
            <Plus className="w-4 h-4" /> Add Option
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Explanation (Optional)</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          placeholder="Why is this the correct answer?"
          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[var(--color-primary)] focus:ring-0 transition-colors font-medium text-slate-900 resize-none"
          rows="2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-6 py-3 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="px-8 py-3 text-white font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-xl shadow-sm hover:shadow-glow transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
          {isSaving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Question</>}
        </button>
      </div>
    </form>
  );
}
