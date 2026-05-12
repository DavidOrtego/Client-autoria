import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Euro, FileText, Calendar, Home, User, Loader2 } from 'lucide-react';
import request from '../lib/api';

const CreateExpenseModal = ({ isOpen, onClose, onSuccess, expense = null }) => {
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
          id_house: '',
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
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

        <div className="p-6">
           <p className="text-slate-500"></p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateExpenseModal;
