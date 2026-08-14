import axiosInstance from '../lib/api';

export const api = {
  // Student Dashboard
  getStudentDashboard: async () => {
    const response = await axiosInstance.get('/attempts/');
    const attempts = response.data || [];
    
    // Calculate stats
    const total_attempts = attempts.length;
    const highest_score = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
    const passed_quizzes = attempts.filter(a => a.status === 'PASSED').length;
    const average_score = attempts.length > 0 
      ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length) 
      : 0;

    const recent_attempts = [...attempts]
      .sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
      .slice(0, 5)
      .map(a => ({
        ...a,
        quiz_title: a.quiz?.title || 'Unknown Quiz',
        passing_score: a.quiz?.passing_score || 50
      }));

    const performance_history = [...attempts]
      .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
      .map(a => ({
        title: a.quiz?.title || 'Quiz',
        percentage: a.percentage
      }));

    return {
      total_attempts,
      average_score,
      highest_score,
      passed_quizzes,
      recent_attempts,
      performance_history
    };
  },

  // Admin Dashboard
  getAdminDashboard: async () => {
    const response = await axiosInstance.get('/admin/analytics');
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  },
  toggleUserStatus: async (userId) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },
  createCategory: async (data) => {
    const response = await axiosInstance.post('/categories', data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },

  // Quizzes
  getQuizzes: async () => {
    const response = await axiosInstance.get('/quizzes');
    return response.data;
  },
  getAdminQuizzes: async () => {
    const response = await axiosInstance.get('/quizzes');
    return response.data;
  },
  getQuiz: async (id) => {
    const response = await axiosInstance.get(`/quizzes/${id}`);
    return response.data;
  },
  getQuizByJoinCode: async (code) => {
    const response = await axiosInstance.get(`/quizzes/join/${code}`);
    return response.data;
  },
  createQuiz: async (data) => {
    const response = await axiosInstance.post('/quizzes', data);
    return response.data;
  },
  updateQuiz: async (id, data) => {
    const response = await axiosInstance.put(`/quizzes/${id}`, data);
    return response.data;
  },
  deleteQuiz: async (id) => {
    const response = await axiosInstance.delete(`/quizzes/${id}`);
    return response.data;
  },

  // Questions
  createQuestion: async (quizId, data) => {
    const response = await axiosInstance.post(`/quizzes/${quizId}/questions`, data);
    return response.data;
  },
  updateQuestion: async (questionId, data) => {
    const response = await axiosInstance.put(`/questions/${questionId}`, data);
    return response.data;
  },
  deleteQuestion: async (questionId) => {
    const response = await axiosInstance.delete(`/questions/${questionId}`);
    return response.data;
  },

  // Attempts
  startAttempt: async (quizId) => {
    const response = await axiosInstance.post(`/quizzes/${quizId}/attempts`);
    return response.data;
  },
  getAttempt: async (attemptId) => {
    const response = await axiosInstance.get(`/attempts/${attemptId}`);
    return response.data;
  },
  submitAttempt: async (attemptId, answers) => {
    const response = await axiosInstance.post(`/attempts/${attemptId}/submit`, { answers });
    return response.data;
  },
  getAttemptResult: async (attemptId) => {
    const response = await axiosInstance.get(`/attempts/${attemptId}/result`);
    return response.data;
  }
};
