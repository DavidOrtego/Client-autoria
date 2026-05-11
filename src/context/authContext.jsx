import React, { createContext, useContext, useState, useEffect } from 'react';
import request from '../lib/api';
import { Outlet } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const meRes = await request('/auth/me', { auth: true });
      if (meRes?.data?.id) {
        const userRes = await request(`/users/${meRes.data.id}`, { auth: true });
        setUser(userRes?.data || null);
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && <Outlet />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
