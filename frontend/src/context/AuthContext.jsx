import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/users/me');
          setUser({ token, ...response.data });
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    fetchUser();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects username
    formData.append('password', password);
    formData.append('remember_me', rememberMe);
    
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const { access_token } = response.data;
    
    if (rememberMe) {
      localStorage.setItem('token', access_token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', access_token);
      localStorage.removeItem('token');
    }
    
    // Fetch profile
    const profileRes = await api.get('/users/me');
    setUser({ token: access_token, ...profileRes.data });
    
    return profileRes.data;
  };

  const register = async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
