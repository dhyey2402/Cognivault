import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, getAccessToken } from '../lib/api';
import axios from 'axios'; // We might need this for raw refresh calls if needed, but api works

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh token on initial load
        const response = await axios.post('http://localhost:8000/api/v1/auth/refresh', {}, {
          withCredentials: true
        });
        const newAccessToken = response.data.access_token;
        setAccessToken(newAccessToken);
        
        // Fetch profile with new access token
        const profileRes = await api.get('/users/me');
        setUser({ token: newAccessToken, ...profileRes.data });
      } catch (error) {
        // No valid refresh token cookie or it expired
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
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
    setAccessToken(access_token);
    
    // Remember email logic for UX
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
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

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
