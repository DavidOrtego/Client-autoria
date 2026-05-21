import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import request, { showAlert } from '../../lib/api';

const EditHouseModal = ({ onClose, onSuccess, house }) => {
  const [formData, setFormData] = useState({
    name: house.name,
    address: house.address || '',
    number_of_rooms: house.number_of_rooms || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await request(`/houses/${house.id_house || house.id}`, {
        method: 'PUT',
        body: formData,
        auth: true
      });
      onSuccess();
      onClose();
    } catch (err) {
      showAlert({ title: "Error", text: err.message, icon: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl p-8 animate-scale-in border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Edit House</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-transparent dark:border-slate-600 rounded-2xl p-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-brand-teal dark:focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-transparent dark:border-slate-600 rounded-2xl p-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-brand-teal dark:focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Rooms</label>
            <input
              type="number"
              value={formData.number_of_rooms}
              onChange={(e) => setFormData({ ...formData, number_of_rooms: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-transparent dark:border-slate-600 rounded-2xl p-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-brand-teal dark:focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-teal text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-brand-teal/90 disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditHouseModal;
