import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import request from '../../lib/api';

const AddMemberModal = ({ onClose, houseId, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await request('/house-members', {
        method: 'POST',
        body: { id_house: houseId, email },
        auth: true
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl p-8 animate-scale-in border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Add Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 dark:text-red-400 text-sm font-bold bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl">{error}</p>}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">User Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-slate-50 dark:bg-slate-700 border border-transparent dark:border-slate-600 rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-600 focus:border-brand-teal dark:focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Invite Member'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddMemberModal;
