import React from 'react';
import { Clock, Edit2, Trash2, MoreVertical, Calendar } from 'lucide-react';
import defaultUserAvatar from '../assets/defaultUser.png';

const TasksTable = ({ 
  tasksList, 
  handleStatusChange, 
  getStatusColor, 
  setEditingTask, 
  setIsCreateModalOpen, 
  handleDelete 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Task</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">House</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned To</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tasksList.map((task) => (
            <tr key={task.id_task} className={`group transition-colors ${task.state === 'completed' ? 'bg-slate-50/30 hover:bg-slate-50' : 'hover:bg-slate-50/80'}`}>
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className={`font-bold text-lg ${task.state === 'completed' ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>{task.name}</span>
                  {task.description && (
                    <span className="text-slate-500 text-sm truncate max-w-[200px]">{task.description}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${task.state === 'completed' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {task.house_name}
                </span>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {task.user_name ? (
                  <div className={`flex items-center gap-2 ${task.state === 'completed' ? 'opacity-60' : ''}`}>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white">
                      {task.user_image ? (
                        <img 
                          src={task.user_image} 
                          alt={task.user_name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.src = defaultUserAvatar; }} 
                        />
                      ) : (
                        <span>{task.user_name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-slate-700 font-semibold">{task.user_name}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-sm">Unassigned</span>
                )}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {task.expiration_date ? (
                  <div className={`flex items-center gap-3 ${task.state === 'completed' ? 'opacity-60' : ''}`}>
                    <div className={`p-2 rounded-xl transition-all ${
                      task.state === 'completed' 
                        ? 'bg-slate-100 text-slate-400' 
                        : 'bg-brand-teal/5 text-brand-teal group-hover:bg-brand-teal group-hover:text-white'
                    }`}>
                      <Calendar size={18} />
                    </div>
                    <span className={`font-medium ${task.state === 'completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {new Date(task.expiration_date).toLocaleDateString('in-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">-</span>
                )}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <select
                  value={task.state || 'pending'}
                  onChange={(e) => handleStatusChange(task, e.target.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(task.state || 'pending')} focus:outline-none appearance-none cursor-pointer pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234A5568%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-size-[8px_8px] bg-position-[right_10px_center]`}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingTask(task);
                      setIsCreateModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/5 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id_task)}
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
  );
};

export default TasksTable;
