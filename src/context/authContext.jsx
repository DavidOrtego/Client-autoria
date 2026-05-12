import React, { createContext, useContext, useState, useEffect } from 'react';
import request from '../lib/api';
import { login as loginService, register as registerService } from '../lib/auth';
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

      // 1. Obtener la ID del usuario validando el token
      const meRes = await request('/auth/me', { auth: true });
      if (meRes?.data?.id) {
        // 2. Obtener toda la informacion
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

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    // 1. Hace el login y guarda el token en lib/auth.js
    const response = await loginService(email, password);
    
    // 2. Devuelve los datos del usuario en response.data.user
    // y los tokens en response.data.token y los asigna.
    if (response.data && response.data.user) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (name, email, password) => {
    // 1. Hace el registro y guarda el token 
    const response = await registerService(name, email, password);
    
    // 2. Lo mismo para el registro, evitamos doble llamada
    if (response.data && response.data.user) {
      setUser(response.data.user);
    }
    return response;
  };

  const updateProfile = async (userData) => {
    if (!user?.id_user) throw new Error("No hay usuario autenticado");
    
    const response = await request(`/users/${user.id_user}`, {
      method: 'PUT',
      body: userData,
      auth: true
    });
    
    // Refrescar los datos del usuario localmente
    await fetchUser();
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    updateProfile,
    logout,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && <Outlet />}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
