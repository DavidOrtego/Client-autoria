import React, { useState, useEffect } from 'react';
import { PiggyBank, Loader2 } from 'lucide-react';
import request from '../lib/api';
import { useAuth } from '../context/authContext';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await request('/expenses', { auth: true });
      setExpenses(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Could not load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold text-slate-900 flex items-center gap-3">
            <PiggyBank className="text-brand-teal" size={36} />
            Expenses
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track shared house expenses.
          </p>
        </div>
      </div>
      
      {/* Loading state rendering */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={48} className="animate-spin text-brand-teal" />
          <p className="text-slate-500 font-medium">Loading transactions...</p>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}
      
      {/* Contenido en los próximos commits */}
      
    </div>
  );
};

export default Expenses;