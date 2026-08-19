import axiosInstance from '../lib/api';

export const api = {
  getStudentDashboard: async () => {
    const response = await axiosInstance.get('/attempts/analytics');
    return response.data;
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
    const response = await axiosInstance.put(`/quizzes/questions/${questionId}`, data);
    return response.data;
  },
  deleteQuestion: async (questionId) => {
    const response = await axiosInstance.delete(`/quizzes/questions/${questionId}`);
    return response.data;
  },

  startAttempt: async (quizId) => {
    const response = await axiosInstance.post('/attempts/start', { quiz_id: quizId });
    return response.data;
  },
  getAttempts: async () => {
    const response = await axiosInstance.get('/attempts/');
    return response.data;
  },
  getAttempt: async (attemptId) => {
    const response = await axiosInstance.get(`/attempts/${attemptId}`);
    return response.data;
  },
  submitAttempt: async (attemptId, payload) => {
    const response = await axiosInstance.post(`/attempts/${attemptId}/submit`, payload);
    return response.data;
  },
  getAttemptResult: async (attemptId) => {
    const response = await axiosInstance.get(`/attempts/${attemptId}`);
    return response.data;
  },

  // Leaderboard
  getLeaderboard: async (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axiosInstance.get('/leaderboard/', { params });
    return response.data;
  },

  // Innovation Features
  getFocusDNA: async (attemptId) => {
    const response = await axiosInstance.get(`/attempts/${attemptId}/focus-dna`);
    return response.data;
  },
  getMemoryHeatmap: async (attemptId) => {
    const response = await axiosInstance.get(`/attempts/${attemptId}/memory-heatmap`);
    return response.data;
  },
  getKnowledgeGalaxy: async () => {
    const response = await axiosInstance.get('/attempts/analytics/knowledge-galaxy');
    return response.data;
  }
};
