import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const response = await axios.get('/api/auth/me');
        
        if (response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    
    setLoading(false);
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData.user || userData);
    localStorage.setItem('token', userData.token);
    
    // Store user data as well for quicker access
    localStorage.setItem('user', JSON.stringify(userData.user || userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshUser
  };
};
