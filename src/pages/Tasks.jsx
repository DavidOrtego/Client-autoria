import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Search,
} from "lucide-react";
import request, { confirmAction, showAlert } from "../lib/api";
import { useAuth } from "../context/authContext";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import TaskSummaryCards from "../components/TaskSummaryCards";
import TasksTable from "../components/TasksTable";
import PageHeader from "../components/ui/PageHeader";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";

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
    const confirmed = await confirmAction({
      title: "Delete Task?",
      text: "Are you sure you want to delete this task?",
      confirmButtonText: "Yes, delete"
    });
    if (!confirmed) return;

    try {
      await request(`/tasks/${id}`, { method: "DELETE", auth: true });
      fetchTasks();
    } catch (err) {
      showAlert({ title: "Error", text: "Error deleting task: " + err.message, icon: "error" });
    }
  };

  const handleStatusChange = async (task, newState) => {
    try {
      await request(`/tasks/${task.id_task}`, {
        method: "PUT",
        body: { state: newState },
        auth: true,
      });
      fetchTasks();
    } catch (err) {
      showAlert({ title: "Error", text: "Error updating task status: " + err.message, icon: "error" });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter((t) => t.state !== "complete");
  const myTasks = tasks.filter((t) => t.id_user === user?.id_user);
  const myPendingTasks = myTasks.filter((t) => t.state !== "complete");

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
      case "complete":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const activeTasks = filteredTasks.filter((t) => t.state !== "complete");
  const completedTasks = filteredTasks.filter((t) => t.state === "complete");

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header */}
      <PageHeader
        title="Tasks"
        description="Manage and organize your shared house chores."
        icon={ClipboardList}
        buttonText="Add Task"
        onButtonClick={() => {
          setEditingTask(null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* tarjetas de resumen */}
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
              className="w-full rounded-2xl border-none bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all focus:ring-2 focus:ring-brand-teal/50 outline-none"
            />
          </div>

          <div className="flex p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 min-w-fit">
            <button
              onClick={() => setViewMode("all")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === "all"
                ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setViewMode("mine")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${viewMode === "mine"
                ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
            >
              My Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de tareas */}
      <div className="space-y-8">
        {loading ? (
          <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700 rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white">
            <LoadingState message="Loading tasks..." />
          </div>
        ) : error ? (
          <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700 rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white flex flex-col items-center justify-center py-12 px-6 text-center">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button
              onClick={fetchTasks}
              className="rounded-xl bg-slate-900 dark:bg-slate-700 px-6 py-2 text-white font-bold transition-all hover:bg-slate-800 dark:hover:bg-slate-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredTasks.length > 0 ? (
          <>
            <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700 rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white">
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
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700 px-6">
                  <p>No active tasks found. You're all caught up!</p>
                </div>
              )}
            </div>

            {completedTasks.length > 0 && (
              <div className="glass-card dark:bg-slate-800/80 dark:border-slate-700 rounded-3xl overflow-hidden border-slate-200 shadow-xl shadow-slate-200/20 bg-white">
                <div className="bg-slate-50/80 dark:bg-slate-700/50 px-6 py-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-outfit font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">
                    Completed History
                  </h3>
                  <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
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
          <EmptyState
            icon={ClipboardList}
            title="No tasks found"
            description={searchQuery ? `No results for "${searchQuery}". Try another search term.` : "You don't have any tasks right now. Start organizing your shared chores!"}
            buttonText="Add first task"
            onButtonClick={() => setIsCreateModalOpen(true)}
            isSearch={!!searchQuery}
          />
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
