import React, { useState, useEffect } from 'react';
import { PiggyBank, Loader2, Plus, ArrowUpRight, BanknoteArrowDown, Search, Calendar, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import request from '../lib/api';
import { useAuth } from '../context/authContext';
import CreateExpenseModal from '../components/CreateExpenseModal';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await request(`/expenses/${id}`, { method: 'DELETE', auth: true });
      fetchExpenses();
    } catch (err) {
      alert('Error deleting expense: ' + err.message);
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
          onClick={() => {
            setEditingExpense(null);
            setIsCreateModalOpen(true);
          }}
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

      {/* Expenses Table/List */}
      <div className="glass-card rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={48} className="animate-spin text-brand-teal" />
            <p className="text-slate-500 font-medium">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button 
              onClick={fetchExpenses}
              className="rounded-xl bg-slate-900 px-6 py-2 text-white font-bold transition-all hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        ) : filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">House</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Paid By</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id_expense} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-teal/5 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all">
                          <Calendar size={18} />
                        </div>
                        <span className="text-slate-600 font-medium">
                          {new Date(expense.date).toLocaleDateString('in-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-900 font-bold text-lg">{expense.description}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">
                        {expense.house_name}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {expense.user_name?.charAt(0)}
                        </div>
                        <span className="text-slate-700 font-semibold">{expense.user_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-slate-900 font-black text-xl">
                        {Number(expense.amount).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingExpense(expense);
                            setIsCreateModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/5 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id_expense)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="group-hover:hidden">
                        <MoreVertical size={18} className="text-slate-300 ml-auto" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border-2 border-dashed border-slate-200">
              <PiggyBank size={40} />
            </div>
            <h3 className="font-outfit text-2xl font-bold text-slate-800 mb-2">No expenses found</h3>
            <p className="text-slate-500 max-w-sm mb-8">
              {searchQuery 
                ? `No results for "${searchQuery}". Try another search term.` 
                : "You haven't recorded any expenses yet. Start tracking your shared costs!"}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-brand-teal px-8 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90"
              >
                <Plus size={20} />
                <span>Add first expense</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateExpenseModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingExpense(null);
        }}
        onSuccess={fetchExpenses}
        expense={editingExpense}
      />
    </div>
  );
};

export default Expenses;