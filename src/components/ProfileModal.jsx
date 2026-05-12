import React, { useState, useEffect } from 'react';
import { X, User, Mail, Camera, Lock } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold font-outfit text-slate-800">My Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
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
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
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
              className="mt-3 text-sm text-brand-teal font-semibold hover:text-brand-teal/80 cursor-pointer transition-colors"
              onClick={() => setShowImageInput(!showImageInput)}
            >
              Change profile photo
            </p>
            {showImageInput && (
              <div className="w-full mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                  placeholder="https://example.com/myphoto.jpg"
                />
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                  placeholder={user?.name || "Your name"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-colors"
                  placeholder={user?.email || "your@email.com"}
                />
              </div>
            </div>

            

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold border border-red-100 flex items-center justify-center">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-teal text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-teal/90 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
