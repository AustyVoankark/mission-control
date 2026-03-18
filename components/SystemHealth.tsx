import { useState, useEffect } from 'react';
import { HardDrive, Cpu, Clock, Users, Wifi } from 'lucide-react';

interface SystemMetrics {
  diskUsed: number;
  diskTotal: number;
  diskUnit: string;
  memoryUsed: number;
  memoryTotal: number;
  memoryUnit: string;
  uptime: string;
  sessions: number;
  latency: number;
}

const mockMetrics: SystemMetrics = {
  diskUsed: 234,
  diskTotal: 500,
  diskUnit: 'GB',
  memoryUsed: 4.2,
  memoryTotal: 16,
  memoryUnit: 'GB',
  uptime: '2h 45m',
  sessions: 3,
  latency: 12,
};

function ProgressBar({ value, max, color = 'blue' }: { value: number; max: number; color?: string }) {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${colorClasses[color as keyof typeof colorClasses]}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>(mockMetrics);

  useEffect(() => {
    // Simulate metrics refresh
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        latency: Math.floor(Math.random() * 20) + 10,
        memoryUsed: 4 + Math.random() * 2,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const diskPercent = (metrics.diskUsed / metrics.diskTotal) * 100;
  const memoryPercent = (metrics.memoryUsed / metrics.memoryTotal) * 100;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">System Health</h2>

      <div className="grid gap-4">
        {/* Disk */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="w-5 h-5 text-blue-400" />
            <div>
              <div className="font-medium">Disk Space</div>
              <div className="text-sm text-gray-400">
                {metrics.diskUsed} / {metrics.diskTotal} {metrics.diskUnit}
              </div>
            </div>
          </div>
          <ProgressBar
            value={metrics.diskUsed}
            max={metrics.diskTotal}
            color={diskPercent > 80 ? 'red' : diskPercent > 60 ? 'yellow' : 'blue'}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {diskPercent.toFixed(1)}% used
          </div>
        </div>

        {/* Memory */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Cpu className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-medium">Memory</div>
              <div className="text-sm text-gray-400">
                {metrics.memoryUsed.toFixed(1)} / {metrics.memoryTotal} {metrics.memoryUnit}
              </div>
            </div>
          </div>
          <ProgressBar
            value={metrics.memoryUsed}
            max={metrics.memoryTotal}
            color={memoryPercent > 80 ? 'red' : memoryPercent > 60 ? 'yellow' : 'green'}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {memoryPercent.toFixed(1)}% used
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Clock className="w-4 h-4" />
              Uptime
            </div>
            <div className="text-xl font-bold">{metrics.uptime}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Users className="w-4 h-4" />
              Active Sessions
            </div>
            <div className="text-xl font-bold">{metrics.sessions}</div>
          </div>
        </div>

        {/* Latency */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <div className="font-medium">Gateway Latency</div>
              <div className="text-sm text-gray-400">Response time to RPC calls</div>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {metrics.latency}ms
            </div>
          </div>
        </div>

        {/* Health Summary */}
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
          <div className="text-green-400 font-medium">All Systems Operational</div>
          <div className="text-sm text-green-400/70">
            Last check: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
