import React, { useState, useEffect } from 'react';
import { Plus, Home as HomeIcon, Search, Loader2 } from 'lucide-react';
import request from '../lib/api';
import HouseCard from '../components/HouseCard';
import CreateHouseModal from '../components/CreateHouseModal';
import { useAuth } from '../context/authContext';

const Home = () => {
  const { user } = useAuth();
  const [houses, setHouses] = useState([]);
  const [pendingTasksCount, setPendingTasksCount] = useState('--');
  const [totalExpensesCount, setTotalExpensesCount] = useState('--');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const obtenerDatosDelDashboard = async () => {
    try {
      setLoading(true);
        const [housesRes, tasksRes, expensesRes] = await Promise.all([
        request('/houses', { auth: true }),
        request('/tasks', { auth: true }).catch(() => ({ data: [] })),
        request('/expenses', { auth: true }).catch(() => ({ data: [] }))
      ]);

      setHouses(housesRes.data || []);
      
      // Contar tareas pendientes
      const tasks = tasksRes.data || [];
      const pendingTasks = tasks.filter(task => task.status === 'pending');
      setPendingTasksCount(pendingTasks.length);

      // Calcular gastos totales
      const expenses = expensesRes.data || [];
      const totalExpenses = expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
      setTotalExpensesCount(`${totalExpenses.toFixed(2)}€`);

      setError(null);
    } catch (err) {
      console.error('Error al obtener los datos del dashboard:', err);
      setError('Could not load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatosDelDashboard();
  }, []);

  const filteredHouses = houses.filter(house => 
    house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (house.address && house.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in space-y-8">
      {/* Encabezado de bienvenida */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold text-slate-900">
            Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-500">
            Welcome back to Vives House.
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 hover:shadow-xl active:scale-95"
        >
          <Plus size={20} />
          <span>New House</span>
        </button>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card flex flex-col gap-1 rounded-3xl p-6">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">My Houses</span>
          <span className="font-outfit text-3xl font-bold text-slate-900">{houses.length}</span>
        </div>
        {/* Marcador de posición para futuras estadísticas como tareas pendientes o gastos totales en las casas */}
        <div className="glass-card flex flex-col gap-1 rounded-3xl p-6">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Tasks</span>
          <span className="font-outfit text-3xl font-bold text-slate-900">{pendingTasksCount}</span>
        </div>
        <div className="glass-card flex flex-col gap-1 rounded-3xl p-6">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Expenses</span>
          <span className="font-outfit text-3xl font-bold text-slate-900">{totalExpensesCount}</span>
        </div>
      </div>

      {/* Barra de búsqueda y filtrado */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search house by name or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-brand-teal/50 outline-none"
        />
      </div>

      {/* Cuadrícula de casas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={48} className="animate-spin text-brand-teal" />
          <p className="text-slate-500 font-medium">Loading your houses...</p>
        </div>
      ) : error ? (
        <div className="glass-card flex flex-col items-center justify-center py-12 rounded-3xl border-red-100 bg-red-50/30">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button 
            onClick={obtenerDatosDelDashboard}
            className="rounded-xl bg-slate-900 px-6 py-2 text-white font-bold transition-all hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      ) : filteredHouses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHouses.map((house) => (
            <HouseCard 
              key={house.id_house || house.id} 
              house={house} 
              onClick={() => console.log('Navigate to house:', house.id_house || house.id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center justify-center py-20 rounded-3xl border-dashed border-2 border-slate-200 bg-transparent text-center">
          <div className="mb-6 rounded-full bg-slate-100 p-6 text-slate-300">
            <HomeIcon size={48} />
          </div>
          <h3 className="font-outfit text-2xl font-bold text-slate-800 mb-2">
            {searchQuery ? 'No results found' : "You don't have any houses yet"}
          </h3>
          <p className="text-slate-500 max-w-sm mb-8 px-4">
            {searchQuery 
              ? `We couldn't find any house matching "${searchQuery}".`
              : 'Create your first house to start managing your shared tasks and expenses.'}
          </p>
          {!searchQuery && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-brand-teal px-8 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90"
            >
              <Plus size={20} />
              <span>Create my first house</span>
            </button>
          )}
        </div>
      )}

      {/* Create House Modal */}
      <CreateHouseModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={obtenerDatosDelDashboard}
      />
    </div>
  );
};

export default Home;
