import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Home, MapPin, Hash, Image as ImageIcon } from 'lucide-react';
import request from '../lib/api';

const CreateHouseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    number_of_rooms: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        address: '',
        number_of_rooms: '',
        image: '',
      });
      setError('');
    }
  }, [isOpen]);

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
      };

      if (formData.address) dataToSend.address = formData.address;
      if (formData.number_of_rooms) dataToSend.number_of_rooms = Number(formData.number_of_rooms);
      if (formData.image) dataToSend.image = formData.image;

      await request('/houses', {
        method: 'POST',
        body: dataToSend,
        auth: true,
      });

      onSuccess(); // Refresh the list of houses
      onClose(); // Close the modal
    } catch (err) {
      setError(err.message || "Failed to create house");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold font-outfit text-slate-800">Create New House</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateHouseModal;
