import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, PiggyBank, Menu, X, LogOut, Mail, Heart } from 'lucide-react';
import { useAuth } from '../context/authContext';
import defaultUserAvatar from '../assets/defaultUser.png';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'My Houses', path: '/vives/home', icon: <Home size={20} /> },
    { name: 'Tasks', path: '/vives/tasks', icon: <ClipboardList size={20} /> },
    { name: 'Expenses', path: '/vives/expenses', icon: <PiggyBank size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header>
      </header>
      
      <main className="flex-1 pt-20 pb-16 md:pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      
      <footer>
      </footer>
    </div>
  );
};

export default MainLayout;
