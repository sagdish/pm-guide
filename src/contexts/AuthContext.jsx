import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { USE_FRONTEND_ONLY } from '../config/appMode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// comment to trigger new deployment

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pm_guide_token'));
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for auth token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        if (USE_FRONTEND_ONLY) {
          // Frontend-only: load from localStorage
          const savedUser = localStorage.getItem('pm_guide_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } else {
          // Backend mode: check with server
          try {
            const response = await axios.get(`${API}/auth/me`);
            setUser(response.data);
          } catch (error) {
            console.error('Auth check failed:', error);
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`);
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      if (USE_FRONTEND_ONLY) {
        // Frontend-only demo login
        const mockUser = {
          id: 'demo-user',
          name: email.split('@')[0],
          email: email
        };
        const mockToken = 'demo-token-' + Date.now();
        
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('pm_guide_token', mockToken);
        localStorage.setItem('pm_guide_user', JSON.stringify(mockUser));
        
        return { success: true };
      } else {
        // Backend login
        const response = await axios.post(`${API}/auth/login`, {
          email,
          password
        });

        const { access_token, user: userData } = response.data;
        
        setToken(access_token);
        setUser(userData);
        localStorage.setItem('pm_guide_token', access_token);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: USE_FRONTEND_ONLY ? 'Login failed' : (error.response?.data?.detail || 'Login failed')
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      if (USE_FRONTEND_ONLY) {
        // Frontend-only demo registration
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          name: name,
          email: email
        };
        const mockToken = 'demo-token-' + Date.now();
        
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('pm_guide_token', mockToken);
        localStorage.setItem('pm_guide_user', JSON.stringify(mockUser));
        
        return { success: true };
      } else {
        // Backend registration
        const response = await axios.post(`${API}/auth/register`, {
          name,
          email,
          password
        });

        const { access_token, user: userData } = response.data;
        
        setToken(access_token);
        setUser(userData);
        localStorage.setItem('pm_guide_token', access_token);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: USE_FRONTEND_ONLY ? 'Registration failed' : (error.response?.data?.detail || 'Registration failed')
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pm_guide_token');
    localStorage.removeItem('pm_guide_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};