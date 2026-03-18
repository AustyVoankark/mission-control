import { useState, useEffect, useRef } from 'react';
import { FileText, ArrowDown } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

// Mock logs - in production this would come from WebSocket
const mockLogs: LogEntry[] = [
  { timestamp: '04:13:45', level: 'info', message: 'Gateway started on port 18789' },
  { timestamp: '04:13:46', level: 'info', message: 'Session main initialized' },
  { timestamp: '04:13:47', level: 'info', message: 'Connected to model: GLM-5' },
  { timestamp: '04:14:02', level: 'info', message: 'Message received from webchat' },
  { timestamp: '04:14:15', level: 'warn', message: 'Slow response time: 2.5s' },
  { timestamp: '04:15:00', level: 'info', message: 'Heartbeat check passed' },
  { timestamp: '04:15:30', level: 'info', message: 'Heartbeat check passed' },
];

export function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: Math.random() > 0.9 ? 'warn' : 'info',
        message: `Heartbeat check ${Math.random() > 0.1 ? 'passed' : 'warning: slow response'}`,
      };
      setLogs(prev => [...prev.slice(-50), newLog]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.level === filter);

  const levelColors = {
    info: 'text-blue-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Logs
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
              autoScroll ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
            Auto-scroll
          </button>
        </div>
      </div>
      
      <div
        ref={logRef}
        className="flex-1 bg-gray-900 rounded-lg p-3 overflow-y-auto font-mono text-sm border border-gray-700"
      >
        {filteredLogs.map((log, i) => (
          <div key={i} className="py-1">
            <span className="text-gray-500">[{log.timestamp}]</span>{' '}
            <span className={levelColors[log.level]}>[{log.level.toUpperCase().padEnd(5)}]</span>{' '}
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
