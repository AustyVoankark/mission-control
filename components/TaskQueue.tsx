import { useState } from 'react';
import { ListTodo, Trash2, Clock, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  priority: 'high' | 'normal' | 'low';
  createdAt: string;
  agent?: string;
}

const mockTasks: Task[] = [
  { id: '1', name: 'Generate SEO report', status: 'running', priority: 'high', createdAt: '04:10', agent: 'main' },
  { id: '2', name: 'Draft outreach email', status: 'queued', priority: 'normal', createdAt: '04:12' },
  { id: '3', name: 'Review landing page', status: 'queued', priority: 'low', createdAt: '04:13' },
  { id: '4', name: 'Update MEMORY.md', status: 'completed', priority: 'normal', createdAt: '04:05' },
];

export function TaskQueue() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleKill = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handlePriorityChange = (taskId: string, priority: Task['priority']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, priority } : t));
  };

  const statusColors = {
    queued: 'text-yellow-400',
    running: 'text-blue-400',
    completed: 'text-green-400',
    failed: 'text-red-400',
  };

  const priorityColors = {
    high: 'bg-red-600',
    normal: 'bg-blue-600',
    low: 'bg-gray-600',
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ListTodo className="w-5 h-5" />
        Task Queue
      </h2>

      <div className="grid gap-3">
        {tasks.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No tasks in queue</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle className={`w-5 h-5 ${statusColors[task.status]}`} />
                  ) : (
                    <Clock className={`w-5 h-5 ${statusColors[task.status]}`} />
                  )}
                  <div>
                    <div className="font-medium">{task.name}</div>
                    <div className="text-xs text-gray-400">
                      {task.agent && `Agent: ${task.agent} • `}
                      Created: {task.createdAt}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(task.id, e.target.value as Task['priority'])}
                    disabled={task.status !== 'queued'}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                  >
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                  
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleKill(task.id)}
                      className="p-1 hover:bg-red-600 rounded text-red-400 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs capitalize ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`text-xs capitalize ${statusColors[task.status]}`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
