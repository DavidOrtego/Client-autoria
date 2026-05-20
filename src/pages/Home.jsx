import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Home as HomeIcon, Search, ClipboardList, PiggyBank } from 'lucide-react';
import request from '../lib/api';
import HouseCard from '../components/HouseCard';
import CreateHouseModal from '../components/modals/CreateHouseModal';
import { useAuth } from '../context/authContext';
import StatsCard from '../components/ui/StatsCard';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

const Home = () => {
  const navigate = useNavigate();
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

      const tasks = tasksRes.data || [];
      const housesData = housesRes.data || [];

      const housesWithMembersAndLevels = await Promise.all(
        housesData.map(async (house) => {
          const houseId = house.id_house || house.id;
          const completedTasksCount = tasks.filter(
            t => t.id_house === houseId && t.state === 'complete'
          ).length;

          let membersCount = 0;
          try {
            const membersRes = await request(`/house-members/house/${houseId}`, { auth: true });
            membersCount = (membersRes.data || []).length;
          } catch (err) {
            console.error(`Error fetching members for house ${houseId}:`, err);
          }

          return {
            ...house,
            level: Number(house.level || 0) + completedTasksCount,
            members_count: membersCount
          };
        })
      );

      setHouses(housesWithMembersAndLevels);

      // Contar tareas pendientes
      const pendingTasks = tasks.filter(task => task.state !== 'complete');
      setPendingTasksCount(pendingTasks.length);

      // Calcular gastos totales
      const expenses = expensesRes.data || [];
      const totalExpenses = expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
      setTotalExpensesCount(`${totalExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`);

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
          <h1 className="font-outfit text-4xl font-bold text-slate-900 dark:text-white">
            Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatsCard
          title="My Houses"
          value={houses.length}
          subtitle="Managed houses"
          icon={HomeIcon}
          gradient="from-brand-teal/5 to-transparent"
          iconColor="text-brand-teal"
          tagBg="bg-brand-teal/10"
        />

        <StatsCard
          title="Pending Tasks"
          value={pendingTasksCount}
          subtitle="To be completed"
          icon={ClipboardList}
          gradient="from-indigo-500/5 to-transparent"
          iconColor="text-indigo-500"
          tagBg="bg-indigo-50"
        />

        <StatsCard
          title="Total Expenses"
          value={totalExpensesCount}
          subtitle="Overall spending"
          icon={PiggyBank}
          gradient="from-amber-500/5 to-transparent"
          iconColor="text-amber-500"
          tagBg="bg-amber-50"
        />
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
          className="w-full rounded-2xl border-none bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all focus:ring-2 focus:ring-brand-teal/50 outline-none"
        />
      </div>

      {/* Cuadrícula de casas */}
      {loading ? (
        <LoadingState message="Loading your houses..." />
      ) : error ? (
        <div className="glass-card flex flex-col items-center justify-center py-12 rounded-3xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 px-6 text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button
            onClick={obtenerDatosDelDashboard}
            className="rounded-xl bg-slate-900 dark:bg-slate-700 px-6 py-2 text-white font-bold transition-all hover:bg-slate-800 dark:hover:bg-slate-600"
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
              onClick={() => navigate(`/vives/house/${house.id_house || house.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HomeIcon}
          title={searchQuery ? 'No houses found' : "You don't have any houses yet"}
          description={searchQuery ? `We couldn't find any house matching "${searchQuery}".` : "Create your first house to start managing your shared tasks and expenses."}
          buttonText="Create my first house"
          onButtonClick={() => setIsCreateModalOpen(true)}
          isSearch={!!searchQuery}
        />
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
