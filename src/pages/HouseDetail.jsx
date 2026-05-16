import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users, ClipboardList, PiggyBank, Settings, MapPin, DoorClosed, UserPlus, Trash2, Calendar, Plus, Edit2
} from 'lucide-react';
import request from '../lib/api';
import { useAuth } from '../context/authContext';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import AddMemberModal from '../components/modals/AddMemberModal';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import defaultUserAvatar from '../assets/defaultUser.png';
import casa1 from '../assets/casa1.png';
import casa2 from '../assets/casa2.png';
import casa3 from '../assets/casa3.png';
import casa4 from '../assets/casa4.png';
import casa5 from '../assets/casa5.png';
import casa6 from '../assets/casa6.png';

const obtenerImagenNivel = (nivel) => {
  if (!nivel) return null;
  if (nivel < 10) return casa1;
  if (nivel < 20) return casa2;
  if (nivel < 30) return casa3;
  if (nivel < 40) return casa4;
  if (nivel < 50) return casa5;
  return casa6;
};

const HouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [house, setHouse] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('members');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState('pending');

  const fetchHouseData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [houseRes, membersRes, tasksRes, expensesRes] = await Promise.all([
        request(`/houses/${id}`, { auth: true }),
        request(`/house-members/house/${id}`, { auth: true }),
        request(`/tasks/house/${id}`, { auth: true }),
        request(`/expenses/house/${id}`, { auth: true })
      ]);

      setHouse(houseRes.data);
      setMembers(membersRes.data || []);
      setTasks(tasksRes.data || []);
      setExpenses(expensesRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching house data:', err);
      setError('Could not load house details. Please try again.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHouseData();
  }, [fetchHouseData]);

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    // Actualización visual inmediata
    const prevMembers = [...members];
    setMembers(members.filter(m => m.id_user !== userId));

    try {
      await request(`/house-members/house/${id}/user/${userId}`, { method: 'DELETE', auth: true });
      fetchHouseData(false);
    } catch (err) {
      setMembers(prevMembers);
      alert('Error removing member: ' + err.message);
    }
  };

  const handleStatusChange = async (task, newState) => {
    // Actualización visual rápida
    const prevTasks = [...tasks];
    setTasks(tasks.map(t => t.id_task === task.id_task ? { ...t, state: newState } : t));

    try {
      await request(`/tasks/${task.id_task}`, {
        method: "PUT",
        body: { state: newState },
        auth: true,
      });
      fetchHouseData(false);
    } catch (err) {
      setTasks(prevTasks);
      alert("Error updating task status: " + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    // Actualización visual rápida
    const prevTasks = [...tasks];
    setTasks(tasks.filter(t => t.id_task !== taskId));

    try {
      await request(`/tasks/${taskId}`, { method: "DELETE", auth: true });
      fetchHouseData(false);
    } catch (err) {
      setTasks(prevTasks);
      alert("Error deleting task: " + err.message);
    }
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'expenses', label: 'Expenses', icon: PiggyBank },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const completedTasksCount = useMemo(() => tasks.filter(t => t.state === 'complete').length, [tasks]);
  const calculatedLevel = Number(house?.level || 0) + completedTasksCount;
  const imagenAMostrar = obtenerImagenNivel(calculatedLevel);

  const filteredTasks = useMemo(() => tasks.filter(t => t.state === taskFilter), [tasks, taskFilter]);

  if (loading) return <LoadingState message="Loading house details..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-3xl mb-6">
          <p className="font-bold text-lg">{error}</p>
        </div>
        <button onClick={fetchHouseData} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-10">
      {/* Pestañas de navegación */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <span className="text-xs font-black text-brand-teal uppercase tracking-[0.3em] mb-2 block">Roomie Dashboard</span>
          <h2 className="text-3xl font-black text-slate-900">House management</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 p-2 bg-white/50 backdrop-blur-md rounded-4xl border border-slate-100 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-bold transition-all whitespace-nowrap ${isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105'
                  : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-brand-teal' : ''} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Información de la casa y estadísticas */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="relative h-64">
              <img src={imagenAMostrar} alt={house.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/20">
                  Level {calculatedLevel}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">{house.name}</h1>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={18} />
                  <span className="font-medium">{house.address || 'No address provided'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rooms</p>
                  <div className="flex items-center gap-2">
                    <DoorClosed size={18} className="text-brand-teal" />
                    <span className="text-xl font-bold text-slate-900">{house.number_of_rooms || 0}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Members</p>
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-indigo-500" />
                    <span className="text-xl font-bold text-slate-900">{members.length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Experience</span>
                  <span>{calculatedLevel * 100} XP</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-teal to-brand-green"
                    style={{ width: `${(calculatedLevel % 10) * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de contenido dinámico*/}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 min-h-[600px] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-2xl font-black text-slate-900 capitalize">{activeTab}</h2>
                <p className="text-slate-500 font-medium">
                  {activeTab === 'members' && 'Manage who has access to this house.'}
                  {activeTab === 'tasks' && 'Chores and responsibilities for this home.'}
                </p>
              </div>

              {activeTab === 'members' && (
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="bg-brand-teal text-white p-3 rounded-2xl shadow-lg shadow-brand-teal/20 hover:scale-105 transition-all"
                >
                  <UserPlus size={20} />
                </button>
              )}
              {activeTab === 'tasks' && (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="bg-brand-teal text-white flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg shadow-brand-teal/20 hover:scale-105 transition-all font-bold"
                >
                  <Plus size={20} />
                  <span>Add Task</span>
                </button>
              )}
            </div>
            <div className="p-8 flex-1 bg-white">
              {activeTab === 'members' && (
                <div className="space-y-6">
                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {members.map((member) => (
                        <div key={member.id_user} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group border-b-4 border-b-transparent hover:border-b-brand-teal">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-3xl overflow-hidden bg-white border-2 border-white shadow-md group-hover:rotate-3 transition-transform">
                              <img
                                src={member.image || member.user_image || defaultUserAvatar}
                                alt={member.name || member.user_name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = defaultUserAvatar; }}
                              />
                            </div>
                            <div>
                              <p className="font-black text-xl text-slate-900 leading-tight">{member.name || member.user_name}</p>
                              <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mt-1">{member.email}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 border border-slate-100 shadow-xs uppercase">
                                  {member.rol || 'Member'}
                                </span>
                                {member.join_date && (
                                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <Calendar size={10} />
                                    Joined {new Date(member.join_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {user?.id_user !== member.id_user && (
                            <button
                              onClick={() => handleRemoveMember(member.id_user)}
                              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Users}
                      title="No members yet"
                      description="Invite people to join your house to share tasks and expenses."
                    />
                  )}
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-8">
                  {/* Filtros para las tareas */}
                  <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl w-fit border border-slate-100">
                    {[
                      { id: 'pending', label: 'Pending' },
                      { id: 'complete', label: 'Complete' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setTaskFilter(f.id)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${taskFilter === f.id
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-400 hover:text-slate-600'
                          }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <div key={task.id_task} className={`relative flex flex-col p-6 rounded-4xl border transition-all hover:shadow-xl ${task.state === 'complete' ? 'bg-slate-50 border-slate-100 opacity-75' : 'bg-white border-slate-100 hover:border-brand-teal/30'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${task.state === 'complete' ? 'bg-slate-200 text-slate-500' : 'bg-brand-teal/10 text-brand-teal'}`}>
                              <ClipboardList size={24} />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsTaskModalOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/5 rounded-xl transition-all"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id_task)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          <h3 className={`text-xl font-bold mb-2 ${task.state === 'complete' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.name}</h3>
                          <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{task.description || 'No description provided.'}</p>

                          {task.expiration_date && (
                            <div className="flex items-center gap-2 mb-6 text-slate-400 group">
                              <Calendar size={14} className="group-hover:text-brand-teal transition-colors" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">
                                Due: {new Date(task.expiration_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                              <div className="w-6 h-6 rounded-lg overflow-hidden bg-white shadow-sm">
                                <img
                                  src={task.user_image || defaultUserAvatar}
                                  alt={task.user_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = defaultUserAvatar; }}
                                />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">{task.user_name || 'Unassigned'}</span>
                            </div>

                            <select
                              value={task.state || 'pending'}
                              onChange={(e) => handleStatusChange(task, e.target.value)}
                              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-brand-teal/20 cursor-pointer ${task.state === 'complete' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-amber-400 text-white shadow-lg shadow-amber-400/20'}`}
                            >
                              <option value="pending" className="text-slate-900">Pending</option>
                              <option value="complete" className="text-slate-900">Done</option>
                            </select>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <EmptyState
                          icon={ClipboardList}
                          title="No tasks recorded"
                          description="Add the first task to keep the house organized."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSuccess={() => fetchHouseData(false)}
        task={editingTask}
        initialHouseId={id}
      />

      {/* Modal para añadir nuevos miembros */}
      {isAddMemberModalOpen && (
        <AddMemberModal
          onClose={() => setIsAddMemberModalOpen(false)}
          houseId={id}
          onSuccess={() => fetchHouseData(false)}
        />
      )}
    </div>
  );
};

export default HouseDetail;
