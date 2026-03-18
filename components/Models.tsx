import { useState } from 'react';
import { Cpu, DollarSign } from 'lucide-react';

const AVAILABLE_MODELS = [
  { id: 'glm5/zai-org/GLM-5-FP8', name: 'GLM-5 (Default)', cost: '$0.001/1K' },
  { id: 'together/moonshotai/Kimi-K2.5', name: 'Kimi K2.5', cost: '$0.002/1K' },
  { id: 'lmstudio/local-model', name: 'LM Studio (Local)', cost: 'Free' },
  { id: 'baseten/nvidia/Nemotron-120B-A12B', name: 'Nemotron 120B', cost: '$0.004/1K' },
];

export function Models() {
  const [currentModel, setCurrentModel] = useState(AVAILABLE_MODELS[0].id);
  const [switching, setSwitching] = useState(false);

  const handleModelChange = async (modelId: string) => {
    setSwitching(true);
    // Simulate model switch
    await new Promise(r => setTimeout(r, 500));
    setCurrentModel(modelId);
    setSwitching(false);
  };

  const currentModelInfo = AVAILABLE_MODELS.find(m => m.id === currentModel);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Cpu className="w-5 h-5" />
        Models
      </h2>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
        <div className="text-sm text-gray-400 mb-2">Current Model</div>
        <div className="text-lg font-medium">{currentModelInfo?.name}</div>
        <div className="text-xs text-gray-500 mt-1">{currentModel}</div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
        <div className="text-sm text-gray-400 mb-2">Switch Model</div>
        <select
          value={currentModel}
          onChange={(e) => handleModelChange(e.target.value)}
          disabled={switching}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white disabled:opacity-50"
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.cost})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Session Cost Estimate
        </div>
        <div className="text-lg font-medium text-green-400">$0.00</div>
        <div className="text-xs text-gray-500 mt-1">~0 tokens used this session</div>
      </div>
    </div>
  );
}
