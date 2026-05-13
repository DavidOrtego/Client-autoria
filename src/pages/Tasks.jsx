import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Loader2,
  Plus,
  CheckCircle2,
  Search,
} from "lucide-react";
import request from "../lib/api";
import { useAuth } from "../context/authContext";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskSummaryCards from "../components/TaskSummaryCards";
import TasksTable from "../components/TasksTable";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await request("/tasks", { auth: true });
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await request(`/tasks/${id}`, { method: "DELETE", auth: true });
      fetchTasks();
    } catch (err) {
      alert("Error deleting task: " + err.message);
    }
  };

  const handleStatusChange = async (task, newState) => {
    try {
      const payload = { ...task, state: newState };
      
      // Fix for MySQL date format issue: Ensure it's YYYY-MM-DD
      if (payload.expiration_date) {
        payload.expiration_date = new Date(payload.expiration_date).toISOString().split('T')[0];
      }

      await request(`/tasks/${task.id_task}`, {
        method: "PUT",
        body: payload,
        auth: true,
      });
      fetchTasks();
    } catch (err) {
      alert("Error updating task status: " + err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter(
    (t) => t.state === "pending" || t.state === "in_progress",
  );
  const myTasks = tasks.filter((t) => t.id_user === user?.id_user);
  const myPendingTasks = myTasks.filter(
    (t) => t.state === "pending" || t.state === "in_progress",
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.house_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.user_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (viewMode === "mine") {
      return matchesSearch && task.id_user === user?.id_user;
    }
    return matchesSearch;
  });

  const getStatusColor = (state) => {
    switch (state) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in_progress":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const activeTasks = filteredTasks.filter((t) => t.state !== "completed");
  const completedTasks = filteredTasks.filter((t) => t.state === "completed");

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardList className="text-brand-teal" size={36} />
            Tasks
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and organize your shared house chores.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 hover:shadow-xl active:scale-95"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Summary Cards */}
      <TaskSummaryCards
        pendingTasks={pendingTasks}
        myPendingTasks={myPendingTasks}
        myTasks={myTasks}
        tasks={tasks}
      />

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, house or person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-brand-teal/50 outline-none"
            />
          </div>

          <div className="flex p-1 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 min-w-fit">
            <button
              onClick={() => setViewMode("all")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                viewMode === "all"
                  ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setViewMode("mine")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                viewMode === "mine"
                  ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              My Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table/List */}
      <div className="space-y-8">
        {loading ? (
          <div className="glass-card rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={48} className="animate-spin text-brand-teal" />
            <p className="text-slate-500 font-medium">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="glass-card rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white flex flex-col items-center justify-center py-12 px-6 text-center">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button
              onClick={fetchTasks}
              className="rounded-xl bg-slate-900 px-6 py-2 text-white font-bold transition-all hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        ) : filteredTasks.length > 0 ? (
          <>
            <div className="glass-card rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white">
              {activeTasks.length > 0 ? (
                <TasksTable
                  tasksList={activeTasks}
                  handleStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  setEditingTask={setEditingTask}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  handleDelete={handleDelete}
                />
              ) : (
                <div className="py-12 text-center text-slate-500 font-medium border-b border-slate-100">
                  <CheckCircle2
                    size={40}
                    className="mx-auto mb-3 text-emerald-400 opacity-50"
                  />
                  <p>No active tasks found. You're all caught up!</p>
                </div>
              )}
            </div>

            {completedTasks.length > 0 && (
              <div className="glass-card rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white">
                <div className="bg-slate-50/80 px-6 py-4 flex items-center gap-2 border-b border-slate-100">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <h3 className="font-outfit font-bold text-slate-700 text-sm uppercase tracking-wider">
                    Completed History
                  </h3>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                    {completedTasks.length}
                  </span>
                </div>
                <TasksTable
                  tasksList={completedTasks}
                  handleStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  setEditingTask={setEditingTask}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  handleDelete={handleDelete}
                />
              </div>
            )}
          </>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border-2 border-dashed border-slate-200">
              <ClipboardList size={40} />
            </div>
            <h3 className="font-outfit text-2xl font-bold text-slate-800 mb-2">
              No tasks found
            </h3>
            <p className="text-slate-500 max-w-sm mb-8">
              {searchQuery
                ? `No results for "${searchQuery}". Try another search term.`
                : "You don't have any tasks right now. Start organizing your shared chores!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-brand-teal px-8 py-3 font-bold text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90"
              >
                <Plus size={20} />
                <span>Add first task</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        onSuccess={fetchTasks}
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;
