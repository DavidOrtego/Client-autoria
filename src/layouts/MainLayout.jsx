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
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 relative drop-shadow-sm">
                <img 
                  src="/Vives.png" 
                  alt="Vives Logo" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform rounded-xl"
                />
              </div>
              <span className="text-xl font-bold font-outfit text-slate-900 hidden sm:block">
                Vives House
              </span>
            </Link>
          </div>
        </div>
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
