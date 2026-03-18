import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Bot, MessageCircle, Cpu, FileText, Settings, Folder, Server, ListTodo, Activity } from 'lucide-react';

import { AgentStatus } from './components/AgentStatus';
import { Channels } from './components/Channels';
import { Models } from './components/Models';
import { Logs } from './components/Logs';
import { ConfigEditor } from './components/ConfigEditor';
import { FileBrowser } from './components/FileBrowser';
import { GatewayControl } from './components/GatewayControl';
import { TaskQueue } from './components/TaskQueue';
import { SystemHealth } from './components/SystemHealth';

import './App.css';

const tabs = [
  { id: 'agents', label: 'Agent Status', icon: Bot, component: AgentStatus },
  { id: 'channels', label: 'Channels', icon: MessageCircle, component: Channels },
  { id: 'models', label: 'Models', icon: Cpu, component: Models },
  { id: 'logs', label: 'Logs', icon: FileText, component: Logs },
  { id: 'config', label: 'Config Editor', icon: Settings, component: ConfigEditor },
  { id: 'files', label: 'File Browser', icon: Folder, component: FileBrowser },
  { id: 'gateway', label: 'Gateway', icon: Server, component: GatewayControl },
  { id: 'tasks', label: 'Task Queue', icon: ListTodo, component: TaskQueue },
  { id: 'health', label: 'System Health', icon: Activity, component: SystemHealth },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold">OpenClaw Mission Control</h1>
              <p className="text-xs text-gray-400">Magnus Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-400">Gateway: Running</span>
            </div>
            <div className="text-gray-500">Port 18789</div>
          </div>
        </div>
      </header>

      <Tabs className="flex flex-col h-[calc(100vh-64px)]">
        <TabList className="flex bg-gray-800 border-b border-gray-700 px-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer text-gray-400 hover:text-white border-b-2 border-transparent transition-colors whitespace-nowrap"
              selectedClassName="text-white border-blue-500"
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </Tab>
          ))}
        </TabList>

        <div className="flex-1 overflow-y-auto">
          {tabs.map((tab) => (
            <TabPanel key={tab.id} className="h-full">
              <tab.component />
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

export default App;
