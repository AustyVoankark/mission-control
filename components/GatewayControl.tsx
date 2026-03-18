import { useState } from 'react';
import { Server, Play, Square, RotateCcw, Activity } from 'lucide-react';

export function GatewayControl() {
  const [status, setStatus] = useState<'running' | 'stopped' | 'restarting'>('running');
  const [lastRestart, setLastRestart] = useState<string | null>(null);
  const [uptime] = useState('2h 45m');

  const handleStart = async () => {
    setStatus('restarting');
    await new Promise(r => setTimeout(r, 2000));
    setStatus('running');
  };

  const handleStop = async () => {
    setStatus('restarting');
    await new Promise(r => setTimeout(r, 1000));
    setStatus('stopped');
  };

  const handleRestart = async () => {
    setStatus('restarting');
    await new Promise(r => setTimeout(r, 3000));
    setStatus('running');
    setLastRestart(new Date().toLocaleTimeString());
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Server className="w-5 h-5" />
        Gateway Control
      </h2>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                status === 'running'
                  ? 'bg-green-400 animate-pulse'
                  : status === 'stopped'
                  ? 'bg-red-400'
                  : 'bg-yellow-400 animate-pulse'
              }`}
            />
            <span className="text-lg font-medium capitalize">{status}</span>
          </div>
          <span className="text-sm text-gray-400">Port 18789</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-700/50 rounded p-2">
            <div className="text-gray-400">Uptime</div>
            <div className="font-medium">{uptime}</div>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <div className="text-gray-400">Last Restart</div>
            <div className="font-medium">{lastRestart || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleStart}
          disabled={status === 'running' || status === 'restarting'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={status === 'stopped' || status === 'restarting'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square className="w-4 h-4" />
          Stop
        </button>
        <button
          onClick={handleRestart}
          disabled={status === 'restarting'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className={`w-4 h-4 ${status === 'restarting' ? 'animate-spin' : ''}`} />
          Restart
        </button>
      </div>

      <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Events</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span>Gateway started</span>
            <span className="text-gray-500 ml-auto">04:06:23</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Session main connected</span>
            <span className="text-gray-500 ml-auto">04:06:24</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>WhatsApp channel ready</span>
            <span className="text-gray-500 ml-auto">04:06:25</span>
          </div>
        </div>
      </div>
    </div>
  );
}
