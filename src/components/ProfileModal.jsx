import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Camera, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/authContext';
import defaultUserAvatar from '../assets/defaultUser.png';
import PasswordStrength from './auth/PasswordStrength';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
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
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-outfit text-xl font-bold text-slate-900">My Profile</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
                  placeholder="https://example.com/myphoto.jpg"
                />
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
                  placeholder={user?.name || "Your name"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
                  placeholder={user?.email || "your@email.com"}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="font-outfit text-md font-bold text-slate-800 mb-4">Change Password</h3>
              
              <div className="space-y-4">


                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
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
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-brand-teal py-4 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 disabled:opacity-50 active:scale-95"
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
