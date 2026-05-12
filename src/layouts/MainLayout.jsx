import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, PiggyBank, Menu, X, LogOut, Mail, Heart } from 'lucide-react';
import { useAuth } from '../context/authContext';
import defaultUserAvatar from '../assets/defaultUser.png';
import ProfileModal from '../components/ProfileModal';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-brand-teal/10 text-brand-teal'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all p-0.5 overflow-hidden border-slate-200 hover:border-brand-teal"
                title="Profile"
              >
                <img 
                  src={user?.image || defaultUserAvatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              </button>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Logout"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
              
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold ${
                      isActive
                        ? 'bg-brand-teal/10 text-brand-teal'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 pt-20 pb-16 md:pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      
      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Columna Principal - Logo y Marca */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 relative drop-shadow-sm">
                  <img 
                    src="/Vives.png" 
                    alt="Vives Logo" 
                    className="w-full h-full object-contain rounded-xl shadow-sm"
                  />
                </div>
                <span className="text-2xl font-bold font-outfit text-slate-900">
                  Vives House
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm text-center md:text-left font-medium">
                Manage your shared tasks and expenses transparently and friction-free. 
                Living together has never been easier.
              </p>
            </div>

            {/* Columna Enlaces */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start gap-4">
              <h4 className="text-slate-900 font-bold font-outfit">Platform</h4>
              <nav className="flex flex-col gap-3 items-center md:items-start">
                <Link to="/vives/home" className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <Home size={16} className="opacity-50" /> My Houses
                </Link>
                <Link to="/vives/tasks" className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <ClipboardList size={16} className="opacity-50" /> Tasks
                </Link>
                <Link to="/vives/expenses" className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <PiggyBank size={16} className="opacity-50" /> Expenses
                </Link>
              </nav>
            </div>

            {/* Columna Enlaces - Legal y Soporte */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4">
              <h4 className="text-slate-900 font-bold font-outfit">Community & Legal</h4>
              <nav className="flex flex-col gap-3 items-center md:items-start">
                <a href="" className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-all">Help Center</a>
                <a href="" className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-all">Privacy Policy</a>
                <a href="" className="text-sm font-semibold text-slate-600 hover:text-brand-teal transition-all">Terms of Service</a>
              </nav>
            </div>

          </div>

          {/* Línea inferior - Copyright */}
          <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-sm text-slate-500 font-medium">
              &copy; 2026 Vives House. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;
