import React, { useState, useEffect } from 'react';
import { PiggyBank, Loader2, Plus, ArrowUpRight, BanknoteArrowDown, Search } from 'lucide-react';
import request from '../lib/api';
import { useAuth } from '../context/authContext';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('all');

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

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const myExpenses = expenses.filter(exp => exp.id_user === user?.id_user);
  const myTotalSpent = myExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = 
      exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.house_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.user_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (viewMode === 'mine') {
      return matchesSearch && exp.id_user === user?.id_user;
    }
    return matchesSearch;
  });

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
        
        <button 
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 hover:shadow-xl active:scale-95"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card relative overflow-hidden flex flex-col gap-1 rounded-3xl p-6 bg-gradient-to-br from-brand-teal/5 to-transparent border-brand-teal/10">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PiggyBank size={80} />
          </div>
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total House Spending</span>
          <span className="font-outfit text-4xl font-black text-slate-900 mt-2">
            {totalSpent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </span>
          <div className="mt-4 flex items-center gap-2 text-brand-teal text-sm font-bold bg-brand-teal/10 w-fit px-3 py-1 rounded-full">
            <ArrowUpRight size={16} />
            <span>All time</span>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden flex flex-col gap-1 rounded-3xl p-6 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
            <BanknoteArrowDown size={80} />
          </div>
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">My Contributions</span>
          <span className="font-outfit text-4xl font-black text-slate-900 mt-2">
            {myTotalSpent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </span>
          <div className="mt-4 flex items-center gap-2 text-indigo-600 text-sm font-bold bg-indigo-50 w-fit px-3 py-1 rounded-full">
            <span>{myExpenses.length} expenses recorded</span>
          </div>
        </div>

        <div className="glass-card hidden lg:flex relative overflow-hidden flex-col gap-1 rounded-3xl p-6 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Houses</span>
          <span className="font-outfit text-4xl font-black text-slate-900 mt-2">
            {[...new Set(expenses.map(e => e.id_house))].length}
          </span>
          <p className="text-slate-400 text-sm mt-4">Houses with shared activity</p>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by description, house or person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-brand-teal/50 outline-none"
            />
          </div>
          
          <div className="flex p-1 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 min-w-fit">
            <button 
              onClick={() => setViewMode('all')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                viewMode === 'all' 
                  ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Expenses
            </button>
            <button 
              onClick={() => setViewMode('mine')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                viewMode === 'mine' 
                  ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              My Expenses
            </button>
          </div>
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