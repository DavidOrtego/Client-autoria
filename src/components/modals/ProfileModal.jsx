import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Camera, Loader2, Lock, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { useTheme } from '../../context/themeContext';
import defaultUserAvatar from '../../assets/defaultUser.png';
import PasswordStrength from '../auth/PasswordStrength';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: user?.image || '',
    currentPassword: '',
    newPassword: '',
  });
  const [showImageInput, setShowImageInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sincronizar los datos del formulario cada vez que se abre el modal o cambia el usuario
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        image: user?.image || '',
        currentPassword: '',
        newPassword: '',
      });
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.image) {
        dataToSend.image = formData.image;
      }

      if (formData.newPassword) {
        dataToSend.password = formData.newPassword;
      }

      await updateProfile(dataToSend);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Ventana modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-2xl animate-scale-in">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 px-6 py-4">
          <h2 className="font-outfit text-xl font-bold text-slate-900 dark:text-white">My Profile</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 dark:bg-slate-800">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div
              className="relative group cursor-pointer"
              onClick={() => setShowImageInput(!showImageInput)}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 ring-4 ring-slate-50">
                <img
                  src={formData.image || defaultUserAvatar}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = defaultUserAvatar; }}
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <p
              className="mt-3 text-sm text-brand-teal font-bold hover:text-brand-teal/80 cursor-pointer transition-colors"
              onClick={() => setShowImageInput(!showImageInput)}
            >
              Change profile photo
            </p>
            {showImageInput && (
              <div className="w-full mt-4 animate-scale-in">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-3 px-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-brand-teal focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-brand-teal/10 outline-none"
                  placeholder="https://example.com/myphoto.jpg"
                />
              </div>
            )}
          </div>

          {/* Toggle modo oscuro */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 mb-5">
            <div className="flex items-center gap-3">
              {isDarkMode
                ? <Moon size={20} className="text-brand-teal" />
                : <Sun size={20} className="text-brand-teal" />
              }
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Dark Mode</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{isDarkMode ? 'On' : 'Off'}</p>
              </div>
            </div>
            {/* Switch */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isDarkMode ? 'bg-brand-teal' : 'bg-slate-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-brand-teal focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-brand-teal/10 outline-none"
                  placeholder={user?.name || "Your name"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-brand-teal focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-brand-teal/10 outline-none"
                  placeholder={user?.email || "your@email.com"}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-6 mt-6">
              <h3 className="font-outfit text-md font-bold text-slate-800 dark:text-slate-200 mb-4">Change Password</h3>

              <div className="space-y-4">


                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-brand-teal focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-brand-teal/10 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {formData.newPassword && (
                    <div className="mt-3">
                      <PasswordStrength contrasena={formData.newPassword} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-600 py-4 font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-2 flex items-center justify-center gap-2 rounded-2xl bg-brand-teal py-4 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 disabled:opacity-50 active:scale-95"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;
