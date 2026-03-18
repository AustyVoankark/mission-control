import { useState } from 'react';
import { MessageCircle, RefreshCw, Check, X } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastMessage?: string;
  lastActivity?: string;
}

// Mock data - in production this would come from gateway
const mockChannels: Channel[] = [
  { id: '1', name: 'WhatsApp', type: 'whatsapp', status: 'connected', lastMessage: '10 min ago' },
  { id: '2', name: 'Telegram', type: 'telegram', status: 'disconnected' },
  { id: '3', name: 'Discord', type: 'discord', status: 'connected', lastMessage: '2 hours ago' },
];

export function Channels() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [reauthing, setReauthing] = useState<string | null>(null);

  const handleReauth = async (channelId: string) => {
    setReauthing(channelId);
    // Simulate reauth
    setTimeout(() => {
      setChannels(channels.map(c => 
        c.id === channelId ? { ...c, status: 'connected' } : c
      ));
      setReauthing(null);
    }, 2000);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Channels
      </h2>
      <div className="grid gap-3">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium capitalize">{channel.name}</span>
                <div className="flex items-center gap-1">
                  {channel.status === 'connected' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-xs ${
                    channel.status === 'connected' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {channel.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleReauth(channel.id)}
                disabled={reauthing === channel.id}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${reauthing === channel.id ? 'animate-spin' : ''}`} />
                Re-auth
              </button>
            </div>
            {channel.lastMessage && (
              <div className="mt-2 text-xs text-gray-400">
                Last message: {channel.lastMessage}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
