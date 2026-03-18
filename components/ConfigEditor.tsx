import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import Editor from '@monaco-editor/react';

const CONFIG_FILES = [
  { id: 'models', name: 'models.json', path: '~/.openclaw/models.json' },
  { id: 'agents', name: 'agents.json', path: '~/.openclaw/agents.json' },
  { id: 'gateway', name: 'gateway.json', path: '~/.openclaw/gateway.json' },
];

const mockConfigs: Record<string, any> = {
  models: {
    default: 'glm5/zai-org/GLM-5-FP8',
    aliases: {
      glm5: 'glm5/zai-org/GLM-5-FP8',
      kimi: 'together/moonshotai/Kimi-K2.5',
      lmstudio: 'lmstudio/local-model',
    },
  },
  agents: {
    main: {
      model: 'glm5',
      tools: { allow: ['*'] },
    },
    coder: {
      model: 'deepseek',
      tools: { allow: ['exec', 'read', 'write', 'edit'] },
    },
  },
  gateway: {
    port: 18789,
    host: 'localhost',
    logLevel: 'info',
  },
};

export function ConfigEditor() {
  const [selectedFile, setSelectedFile] = useState('models');
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const config = mockConfigs[selectedFile];
    const json = JSON.stringify(config, null, 2);
    setContent(json);
    setOriginalContent(json);
  }, [selectedFile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate JSON
      JSON.parse(content);
      
      // Simulate save
      await new Promise(r => setTimeout(r, 500));
      setOriginalContent(content);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = content !== originalContent;

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Config Editor
        </h2>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-yellow-400 text-sm">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-2 p-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-2 p-2 bg-green-900/50 border border-green-700 rounded text-green-300 text-sm">
          Saved successfully!
        </div>
      )}

      <div className="flex gap-2 mb-3">
        {CONFIG_FILES.map((file) => (
          <button
            key={file.id}
            onClick={() => setSelectedFile(file.id)}
            className={`px-3 py-1 rounded text-sm ${
              selectedFile === file.id
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {file.name}
          </button>
        ))}
      </div>

      <div className="flex-1 border border-gray-700 rounded overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          theme="vs-dark"
          value={content}
          onChange={(v) => setContent(v || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
