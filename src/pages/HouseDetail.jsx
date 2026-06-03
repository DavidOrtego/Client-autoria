import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardList,
  PiggyBank,
  Settings,
  MapPin,
  DoorClosed,
  UserPlus,
  Trash2,
  Calendar,
  Plus,
  Edit2,
  TrendingUp,
  Star,
} from "lucide-react";
import request, { confirmAction, showAlert } from "../lib/api";
import { useAuth } from "../context/authContext";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import AddMemberModal from "../components/modals/AddMemberModal";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import CreateExpenseModal from "../components/modals/CreateExpenseModal";
import EditHouseModal from "../components/modals/EditHouseModal";
import defaultUserAvatar from "../assets/defaultUser.png";
import casa1 from "../assets/casa1.png";
import casa2 from "../assets/casa2.png";
import casa3 from "../assets/casa3.png";
import casa4 from "../assets/casa4.png";
import casa5 from "../assets/casa5.png";
import casa6 from "../assets/casa6.png";

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
  const [activeTab, setActiveTab] = useState("members");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState("pending");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchHouseData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const [houseRes, membersRes, tasksRes, expensesRes] = await Promise.all(
          [
            request(`/houses/${id}`, { auth: true }),
            request(`/house-members/house/${id}`, { auth: true }),
            request(`/tasks/house/${id}`, { auth: true }),
            request(`/expenses/house/${id}`, { auth: true }),
          ],
        );

        setHouse(houseRes.data);
        setMembers(membersRes.data || []);
        setTasks(tasksRes.data || []);
        setExpenses(expensesRes.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching house data:", err);
        setError("Could not load house details. Please try again.");
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [id],
  );

  const fetchReviews = useCallback(async () => {
    try {
      const reviewRes = await request(`/reviews/house/${id}`, { auth: true });
      const reviewList = Array.isArray(reviewRes)
        ? reviewRes
        : reviewRes.data || reviewRes.reviews || reviewRes || [];
      setReviews(reviewList);
    } catch {
      try {
        const reviewRes = await request(`/houses/${id}/reviews`, {
          auth: true,
        });
        const reviewList = Array.isArray(reviewRes)
          ? reviewRes
          : reviewRes.data || reviewRes.reviews || reviewRes || [];
        setReviews(reviewList);
      } catch {
        console.warn("Failed to load reviews from both endpoints.");
        setReviews([]);
      }
    }
  }, [id]);

  const loadHousePage = useCallback(async () => {
    await fetchHouseData();
    await fetchReviews();
  }, [fetchHouseData, fetchReviews]);

  useEffect(() => {
    void loadHousePage();
  }, [loadHousePage]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!reviewComment.trim()) {
      showAlert({ title: "Error", text: "Please write a comment before submitting your review.", icon: "error" });
      return;
    }

    setSubmittingReview(true);
    try {
      let createdReview;

        createdReview = await request("/reviews", {
          method: "POST",
          body: {
            id_house: Number(id),
            rating: Number(reviewRating),
            comment: reviewComment.trim(),
          },
          auth: true,
        });

      const newReview = Array.isArray(createdReview)
        ? createdReview[0]
        : createdReview.data || createdReview.review || createdReview;

      setReviews((current) => [newReview, ...current]);
      setReviewRating(5);
      setReviewComment("");
      showAlert({ title: "Success", text: "Review submitted successfully!", icon: "success" });
    } catch (err) {
      showAlert({ title: "Error", text: err.message || "Unable to submit review.", icon: "error" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteHouse = async () => {
    const confirmed = await confirmAction({
      title: "Delete House?",
      text: "Are you absolutely sure you want to delete this house? This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
    });
    if (!confirmed) return;

    try {
      await request(`/houses/${id}`, { method: "DELETE", auth: true });
      navigate("/vives/home");
    } catch (err) {
      showAlert({ title: "Error", text: err.message, icon: "error" });
    }
  };

  const handleLeaveHouse = async () => {
    const confirmed = await confirmAction({
      title: "Leave House?",
      text: "Are you sure you want to leave this house? You will lose access to all its tasks and expenses.",
      confirmButtonText: "Yes, leave",
    });
    if (!confirmed) return;
    try {
      await request(
        `/house-members/house/${id}/user/${user?.id_user || user?.id}`,
        { method: "DELETE", auth: true },
      );
      navigate("/vives/home");
    } catch (err) {
      showAlert({
        title: "Error",
        text: "Error leaving house: " + err.message,
        icon: "error",
      });
    }
  };

  const handleRemoveMember = async (userId) => {
    const confirmed = await confirmAction({
      title: "Remove Member?",
      text: "Are you sure you want to remove this member from the house?",
      confirmButtonText: "Yes, remove",
    });
    if (!confirmed) return;

    // Actualización visual inmediata
    const prevMembers = [...members];
    setMembers(members.filter((m) => m.id_user !== userId));

    try {
      await request(`/house-members/house/${id}/user/${userId}`, {
        method: "DELETE",
        auth: true,
      });
      fetchHouseData(false);
    } catch (err) {
      setMembers(prevMembers);
      showAlert({
        title: "Error",
        text: "Error removing member: " + err.message,
        icon: "error",
      });
    }
  };

  const handleStatusChange = async (task, newState) => {
    // Actualización visual rápida
    const prevTasks = [...tasks];
    setTasks(
      tasks.map((t) =>
        t.id_task === task.id_task ? { ...t, state: newState } : t,
      ),
    );

    try {
      await request(`/tasks/${task.id_task}`, {
        method: "PUT",
        body: { state: newState },
        auth: true,
      });
      fetchHouseData(false);
    } catch (err) {
      setTasks(prevTasks);
      showAlert({
        title: "Error",
        text: "Error updating task status: " + err.message,
        icon: "error",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = await confirmAction({
      title: "Delete Task?",
      text: "Are you sure you want to delete this task?",
      confirmButtonText: "Yes, delete",
    });
    if (!confirmed) return;

    // Actualización visual rápida
    const prevTasks = [...tasks];
    setTasks(tasks.filter((t) => t.id_task !== taskId));

    try {
      await request(`/tasks/${taskId}`, { method: "DELETE", auth: true });
      fetchHouseData(false);
    } catch (err) {
      setTasks(prevTasks);
      showAlert({
        title: "Error",
        text: "Error deleting task: " + err.message,
        icon: "error",
      });
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const confirmed = await confirmAction({
      title: "Delete Expense?",
      text: "Are you sure you want to delete this expense?",
      confirmButtonText: "Yes, delete",
    });
    if (!confirmed) return;

    // Actualización rápida
    const prevExpenses = [...expenses];
    setExpenses(expenses.filter((e) => e.id_expense !== expenseId));

    try {
      await request(`/expenses/${expenseId}`, { method: "DELETE", auth: true });
      fetchHouseData(false);
    } catch (err) {
      setExpenses(prevExpenses);
      showAlert({
        title: "Error",
        text: "Error deleting expense: " + err.message,
        icon: "error",
      });
    }
  };

  const tabs = [
    { id: "members", label: "Members", icon: Users },
    { id: "tasks", label: "Tasks", icon: ClipboardList },
    { id: "expenses", label: "Expenses", icon: PiggyBank },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const completedTasksCount = useMemo(
    () => tasks.filter((t) => t.state === "complete").length,
    [tasks],
  );
  const calculatedLevel = Number(house?.level || 0) + completedTasksCount;
  const imagenAMostrar = obtenerImagenNivel(calculatedLevel);

  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.state === taskFilter),
    [tasks, taskFilter],
  );

  const totalHouseSpending = useMemo(
    () => expenses.reduce((acc, curr) => acc + Number(curr.amount), 0),
    [expenses],
  );

  const expensesBreakdown = useMemo(() => {
    const breakdown = expenses.reduce((acc, expense) => {
      const userId = expense.id_user;
      if (!acc[userId]) {
        acc[userId] = {
          name: expense.user_name,
          image: expense.user_image,
          total: 0,
        };
      }
      acc[userId].total += Number(expense.amount);
      return acc;
    }, {});
    return Object.values(breakdown).sort((a, b) => b.total - a.total);
  }, [expenses]);

  if (loading) return <LoadingState message="Loading house details..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-3xl mb-6">
          <p className="font-bold text-lg">{error}</p>
        </div>
        <button
          onClick={fetchHouseData}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold"
        >
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
          <span className="text-xs font-black text-brand-teal uppercase tracking-[0.3em] mb-2 block">
            Roomie Dashboard
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            House management
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-4xl border border-slate-100 dark:border-slate-700 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 dark:bg-brand-teal text-white shadow-xl shadow-slate-900/20 dark:shadow-brand-teal/20 scale-105"
                    : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-brand-teal dark:text-white" : ""}
                />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Información de la casa */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40">
            <div className="relative h-64">
              <img
                src={imagenAMostrar}
                alt={house.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/20">
                  Level {calculatedLevel}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                  {house.name}
                </h1>
                {house.address ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(house.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-teal dark:hover:text-brand-teal transition-colors cursor-pointer group/location w-fit"
                  >
                    <MapPin
                      size={18}
                      className="text-slate-400 group-hover/location:text-brand-teal transition-colors"
                    />
                    <span className="font-medium underline decoration-dotted underline-offset-4 decoration-slate-300 dark:decoration-slate-600 hover:decoration-brand-teal dark:hover:decoration-brand-teal">
                      {house.address}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <MapPin size={18} />
                    <span className="font-medium">No address provided</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Rooms
                  </p>
                  <div className="flex items-center gap-2">
                    <DoorClosed size={18} className="text-brand-teal" />
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {house.number_of_rooms || 0}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Members
                  </p>
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-indigo-500" />
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {members.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Experience</span>
                  <span>{calculatedLevel * 100} XP</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-brand-teal to-brand-green"
                    style={{ width: `${(calculatedLevel % 10) * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de contenido dinámico*/}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-[2.5rem] bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 min-h-[600px] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-700/30">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                  {activeTab}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {activeTab === "members" &&
                    "Manage who has access to this house."}
                  {activeTab === "tasks" &&
                    "Chores and responsibilities for this home."}
                  {activeTab === "expenses" &&
                    "Track shared spending and contributions."}
                  {activeTab === "settings" &&
                    "House configuration and dangerous actions."}
                </p>
              </div>

              {activeTab === "members" && (
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="bg-brand-teal text-white p-3 rounded-2xl shadow-lg shadow-brand-teal/20 hover:scale-105 transition-all"
                >
                  <UserPlus size={20} />
                </button>
              )}
              {activeTab === "tasks" && (
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
              {activeTab === "expenses" && (
                <button
                  onClick={() => {
                    setEditingExpense(null);
                    setIsExpenseModalOpen(true);
                  }}
                  className="bg-brand-teal text-white flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg shadow-brand-teal/20 hover:scale-105 transition-all font-bold"
                >
                  <Plus size={20} />
                  <span>Add Expense</span>
                </button>
              )}
            </div>
            <div className="p-8 flex-1 bg-white dark:bg-transparent">
              {activeTab === "members" && (
                <div className="space-y-6">
                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {members.map((member) => (
                        <div
                          key={member.id_user}
                          className="flex items-center justify-between p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all group border-b-4 border-b-transparent hover:border-b-brand-teal"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-3xl overflow-hidden bg-white border-2 border-white shadow-md group-hover:rotate-3 transition-transform">
                              <img
                                src={
                                  member.image ||
                                  member.user_image ||
                                  defaultUserAvatar
                                }
                                alt={member.name || member.user_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = defaultUserAvatar;
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-black text-xl text-slate-900 dark:text-white leading-tight">
                                {member.name || member.user_name}
                              </p>
                              <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mt-1">
                                {member.email}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 border border-slate-100 dark:border-slate-700 shadow-xs uppercase">
                                  {member.rol || "Member"}
                                </span>
                                {member.join_date && (
                                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <Calendar size={10} />
                                    Joined{" "}
                                    {new Date(
                                      member.join_date,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {user?.id_user !== member.id_user && (
                            <button
                              onClick={() => handleRemoveMember(member.id_user)}
                              className="p-3 text-slate-300 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
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

              {activeTab === "tasks" && (
                <div className="space-y-8">
                  {/* Filtros para las tareas */}
                  <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-700 rounded-2xl w-fit border border-slate-100 dark:border-slate-600">
                    {[
                      { id: "pending", label: "Pending" },
                      { id: "complete", label: "Complete" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setTaskFilter(f.id)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          taskFilter === f.id
                            ? "bg-white dark:bg-brand-teal text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-0"
                            : "text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <div
                          key={task.id_task}
                          className={`relative flex flex-col p-6 rounded-4xl border transition-all hover:shadow-xl ${task.state === "complete" ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-75" : "bg-white dark:bg-slate-700/50 border-slate-100 dark:border-slate-600 hover:border-brand-teal/30 dark:hover:border-brand-teal/50"}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div
                              className={`p-3 rounded-2xl ${task.state === "complete" ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400" : "bg-brand-teal/10 text-brand-teal"}`}
                            >
                              <ClipboardList size={24} />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsTaskModalOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/5 dark:hover:bg-brand-teal/20 rounded-xl transition-all"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id_task)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          <h3
                            className={`text-xl font-bold mb-2 ${task.state === "complete" ? "text-slate-500 dark:text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}
                          >
                            {task.name}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                            {task.description || "No description provided."}
                          </p>

                          {task.expiration_date && (
                            <div className="flex items-center gap-2 mb-6 text-slate-400 group">
                              <Calendar
                                size={14}
                                className="group-hover:text-brand-teal transition-colors"
                              />
                              <span className="text-[11px] font-bold uppercase tracking-wider">
                                Due:{" "}
                                {new Date(
                                  task.expiration_date,
                                ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-600 mt-auto">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                              <div className="w-6 h-6 rounded-lg overflow-hidden bg-white dark:bg-slate-700 shadow-sm">
                                <img
                                  src={task.user_image || defaultUserAvatar}
                                  alt={task.user_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = defaultUserAvatar;
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">
                                {task.user_name || "Unassigned"}
                              </span>
                            </div>

                            <select
                              value={task.state || "pending"}
                              onChange={(e) =>
                                handleStatusChange(task, e.target.value)
                              }
                              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-brand-teal/20 cursor-pointer ${task.state === "complete" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-amber-400 text-white shadow-lg shadow-amber-400/20"} dark:bg-opacity-90`}
                            >
                              <option
                                value="pending"
                                className="text-slate-900 dark:text-white"
                              >
                                Pending
                              </option>
                              <option
                                value="complete"
                                className="text-slate-900 dark:text-white"
                              >
                                Done
                              </option>
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

              {activeTab === "expenses" && (
                <div className="space-y-4">
                  {expenses.length > 0 ? (
                    <div className="space-y-4">
                      {/* Resumen de gastos */}
                      <div
                        onClick={() =>
                          setShowExpenseBreakdown(!showExpenseBreakdown)
                        }
                        className="cursor-pointer transition-all duration-500 transform hover:scale-[1.01] active:scale-[0.99] mb-8"
                      >
                        {!showExpenseBreakdown ? (
                          <div className="bg-linear-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white flex items-center justify-between shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-brand-teal/20 transition-all duration-700" />
                            <div className="relative z-10">
                              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 flex items-center gap-3">
                                Total House Spending
                                <span className="bg-white/10 text-white px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest border border-white/10 group-hover:bg-brand-teal/20 transition-colors">
                                  CLICK FOR BREAKDOWN
                                </span>
                              </p>
                              <h4 className="text-5xl font-black">
                                {totalHouseSpending.toLocaleString("es-ES", {
                                  style: "currency",
                                  currency: "EUR",
                                })}
                              </h4>
                            </div>
                            <div className="relative z-10 bg-white/10 p-5 rounded-4xl backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                              <TrendingUp
                                size={40}
                                className="text-brand-teal"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-slate-200/40 flex flex-col justify-center relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                Spending Breakdown
                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                                  CLICK FOR TOTAL
                                </span>
                              </h4>
                            </div>
                            <div className="flex overflow-x-auto gap-6 pb-2 no-scrollbar">
                              {expensesBreakdown.map((member, idx) => (
                                <div
                                  key={idx}
                                  className="min-w-[140px] p-5 rounded-4xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 flex flex-col items-center text-center hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl dark:hover:shadow-black/20 transition-all group/member"
                                >
                                  <div className="w-14 h-14 rounded-[1.2rem] overflow-hidden bg-white border-slate-100 dark:border-slate-600 mb-4 shadow-sm border group-hover/member:scale-110 transition-transform">
                                    <img
                                      src={member.image || defaultUserAvatar}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = defaultUserAvatar;
                                      }}
                                    />
                                  </div>
                                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate w-full mb-1">
                                    {member.name}
                                  </p>
                                  <p className="font-black text-brand-teal text-lg">
                                    {member.total.toLocaleString("es-ES", {
                                      style: "currency",
                                      currency: "EUR",
                                    })}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Historial de transacciones */}
                      <div className="space-y-4">
                        {expenses
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((expense) => (
                            <div
                              key={expense.id_expense}
                              className="group flex items-center justify-between p-6 rounded-[2.5rem] bg-white dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-brand-teal/30 dark:hover:border-brand-teal/50 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all"
                            >
                              <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-teal group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                                  <PiggyBank size={28} />
                                </div>
                                <div>
                                  <h5 className="font-black text-slate-900 dark:text-white text-xl leading-tight mb-1">
                                    {expense.description}
                                  </h5>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                                      <Calendar
                                        size={14}
                                        className="text-brand-teal"
                                      />
                                      <span>
                                        {new Date(
                                          expense.date,
                                        ).toLocaleDateString("en-US", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600" />
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-md overflow-hidden border border-slate-100 dark:border-slate-600">
                                        <img
                                          src={
                                            expense.user_image ||
                                            defaultUserAvatar
                                          }
                                          alt={expense.user_name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-tight">
                                        Paid by {expense.user_name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums mr-4">
                                  {Number(expense.amount).toLocaleString(
                                    "es-ES",
                                    { style: "currency", currency: "EUR" },
                                  )}
                                </span>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingExpense(expense);
                                      setIsExpenseModalOpen(true);
                                    }}
                                    className="p-3 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/5 dark:hover:bg-brand-teal/20 rounded-2xl transition-all"
                                  >
                                    <Edit2 size={20} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteExpense(expense.id_expense)
                                    }
                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={PiggyBank}
                      title="No expenses found"
                      description="Start tracking house costs together."
                    />
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        General Configuration
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                        Edit your house details and information.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-4 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm shrink-0"
                    >
                      <Edit2 size={16} className="text-brand-teal" />
                      Edit Info
                    </button>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-500">
                        Leave House
                      </h3>
                      <p className="text-amber-600/70 dark:text-amber-500/70 font-medium text-sm">
                        You will lose access to all tasks and expenses of this
                        house.
                      </p>
                    </div>
                    <button
                      onClick={handleLeaveHouse}
                      className="flex items-center justify-center gap-2 bg-white dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-900/50 px-4 py-2.5 rounded-xl font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all shadow-sm shrink-0"
                    >
                      <DoorClosed size={16} />
                      Leave House
                    </button>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-500">
                        Danger Zone
                      </h3>
                      <p className="text-red-500/70 dark:text-red-400/70 font-medium text-sm">
                        Permanent deletion of this house.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteHouse}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md shadow-red-200 dark:shadow-red-900/20 shrink-0"
                    >
                      <Trash2 size={16} />
                      Delete House
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/30">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            House Reviews
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Leave feedback for this house and see it appear instantly after
            submission.
          </p>
        </div>
        <div className="p-8 space-y-8">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-[160px_1fr] items-center">
              <label
                htmlFor="reviewRating"
                className="text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Rating
              </label>
              <select
                id="reviewRating"
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} stars
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-[160px_1fr] items-start">
              <label
                htmlFor="reviewComment"
                className="text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Comment
              </label>
              <textarea
                id="reviewComment"
                rows="5"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
                placeholder="Explain your experience with this house..."
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submittingReview}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-brand-teal px-6 py-3 text-sm font-black text-white transition-all hover:bg-brand-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingReview ? "Sending..." : "Submit review"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div
                  key={review.id_review || review.id || review._id || idx}
                  className="rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-lg">
                        {review.user_name || review.name || "Anonymous"}
                      </p>
                      {review.created_at && (
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 dark:bg-slate-800 px-4 py-2 text-sm font-bold text-brand-teal">
                      <Star size={16} /> {review.rating || review.score || 0}/5
                    </span>
                  </div>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
                    {review.comment ||
                      review.description ||
                      "No comment provided."}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Star}
                title="No reviews yet"
                description="Submit the first review and see it appear immediately."
              />
            )}
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

      <CreateExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSuccess={() => fetchHouseData(false)}
        expense={editingExpense}
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

      {/* Modal para editar la información de la casa */}
      {isEditModalOpen && (
        <EditHouseModal
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => fetchHouseData(false)}
          house={house}
        />
      )}
    </div>
  );
};

export default HouseDetail;
