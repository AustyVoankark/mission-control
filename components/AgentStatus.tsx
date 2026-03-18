import { useSessions } from '../hooks/useGateway';
import { Activity, Bot, Clock } from 'lucide-react';

export function AgentStatus() {
  const { sessions, loading, error } = useSessions();

  if (loading) return <div className="p-4">Loading sessions...</div>;
  if (error) return <div className="p-4 text-red-400">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bot className="w-5 h-5" />
        Agent Status
      </h2>
      <div className="grid gap-3">
        {sessions.length === 0 ? (
          <div className="text-gray-400">No active sessions</div>
        ) : (
          sessions.map((session: any) => (
            <div
              key={session.key || session.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      session.status === 'active' ? 'bg-green-400' : 'bg-gray-500'
                    }`}
                  />
                  <span className="font-medium">{session.label || session.agentId || 'Unknown'}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {session.model || 'default'}
                </span>
              </div>
              {session.currentTask && (
                <div className="mt-2 text-sm text-gray-300 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {session.currentTask}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Last activity: {session.lastActivity ? new Date(session.lastActivity).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
