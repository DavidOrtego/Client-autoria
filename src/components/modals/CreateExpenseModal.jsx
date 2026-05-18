import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Euro, FileText, Calendar, Home, User, Loader2 } from 'lucide-react';
import request from '../../lib/api';

const CreateExpenseModal = ({ isOpen, onClose, onSuccess, expense = null, initialHouseId = null }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    id_house: '',
    id_user: ''
  });
  const [houses, setHouses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHouses, setFetchingHouses] = useState(false);
  const [fetchingMembers, setFetchingMembers] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchHouses();
      if (expense) {
        setFormData({
          amount: expense.amount,
          description: expense.description,
          date: new Date(expense.date).toISOString().split('T')[0],
          id_house: expense.id_house,
          id_user: expense.id_user
        });
      } else {
        setFormData({
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          id_house: initialHouseId || '',
          id_user: ''
        });
      }
    }
  }, [isOpen, expense]);

  useEffect(() => {
    if (formData.id_house) {
      fetchMembers(formData.id_house);
    } else {
      setMembers([]);
    }
  }, [formData.id_house]);

  const fetchHouses = async () => {
    try {
      setFetchingHouses(true);
      const response = await request('/houses', { auth: true });
      setHouses(response.data || []);
    } catch (err) {
      console.error('Error fetching houses:', err);
    } finally {
      setFetchingHouses(false);
    }
  };

  const fetchMembers = async (houseId) => {
    try {
      setFetchingMembers(true);
      const response = await request(`/house-members/house/${houseId}`, { auth: true });
      setMembers(response.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setFetchingMembers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = expense ? 'PUT' : 'POST';
      const endpoint = expense ? `/expenses/${expense.id_expense}` : '/expenses';

      await request(endpoint, {
        method,
        body: {
          ...formData,
          amount: parseFloat(formData.amount)
        },
        auth: true
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-outfit text-xl font-bold text-slate-900">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Amount</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                <Euro size={20} />
              </div>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-lg font-bold text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                <FileText size={20} />
              </div>
              <input
                required
                type="text"
                placeholder="What was this for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <Calendar size={20} />
                </div>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none"
                />
              </div>
            </div>

            {/* House */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">House</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <Home size={20} />
                </div>
                <select
                  required
                  value={formData.id_house}
                  onChange={(e) => setFormData({ ...formData, id_house: e.target.value, id_user: '' })}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none appearance-none"
                >
                  <option value="" disabled>Select House</option>
                  {houses.map(house => (
                    <option key={house.id_house} value={house.id_house}>{house.name}</option>
                  ))}
                </select>
                {fetchingHouses && (
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <Loader2 size={16} className="animate-spin text-brand-teal" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User (Member) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Paid By</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-teal transition-colors">
                <User size={20} />
              </div>
              <select
                required
                disabled={!formData.id_house}
                value={formData.id_user}
                onChange={(e) => setFormData({ ...formData, id_user: e.target.value })}
                className="w-full rounded-2xl border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 transition-all focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10 outline-none appearance-none disabled:opacity-50"
              >
                <option value="" disabled>
                  {!formData.id_house ? 'Select a house first' : 'Select Member'}
                </option>
                {members.map(member => (
                  <option key={member.id_user} value={member.id_user}>{member.name}</option>
                ))}
              </select>
              {fetchingMembers && (
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Loader2 size={16} className="animate-spin text-brand-teal" />
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
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
              disabled={loading}
              className="flex-2 flex items-center justify-center gap-2 rounded-2xl bg-brand-teal py-4 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (expense ? 'Update Expense' : 'Save Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateExpenseModal;
