import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

// Mock file tree
const mockFileTree: FileNode = {
  name: '~/.openclaw/workspace',
  type: 'folder',
  children: [
    {
      name: 'AGENTS.md',
      type: 'file',
      content: '# AGENTS.md — Operating Manual\n\n## Identity\nMagnus — manager agent...',
    },
    {
      name: 'SOUL.md',
      type: 'file',
      content: '# SOUL.md — Personality & Communication\n\n## Core Disposition\n- Efficient...',
    },
    {
      name: 'MEMORY.md',
      type: 'file',
      content: '# MEMORY.md — Long-Term Memory\n\n[2026-03-12] [TOOL] ByteRover installed...',
    },
    {
      name: 'USER.md',
      type: 'file',
      content: '# USER.md — Who I Work For\n\n**Name:** Austyn Bunting\n**Location:** Jacksonville, FL...',
    },
    {
      name: 'skills',
      type: 'folder',
      children: [
        { name: 'cashclaw-core', type: 'folder', children: [{ name: 'SKILL.md', type: 'file', content: '...' }] },
        { name: 'proactive-agent', type: 'folder', children: [{ name: 'SKILL.md', type: 'file', content: '...' }] },
      ],
    },
    {
      name: 'logs',
      type: 'folder',
      children: [{ name: '2026-03-17.md', type: 'file', content: '# Daily Log\n\n## 04:00 - Session started' }],
    },
  ],
};

function FileTreeItem({
  node,
  depth = 0,
  onSelect,
  selectedFile,
}: {
  node: FileNode;
  depth?: number;
  onSelect: (node: FileNode) => void;
  selectedFile: FileNode | null;
}) {
  const [expanded, setExpanded] = useState(depth < 1);

  const isSelected = selectedFile?.name === node.name && selectedFile?.type === node.type;

  return (
    <div>
      <div
        onClick={() => {
          if (node.type === 'folder') {
            setExpanded(!expanded);
          } else {
            onSelect(node);
          }
        }}
        className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded ${
          isSelected ? 'bg-blue-600/30' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <Folder className="w-4 h-4 text-yellow-400" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="w-4 h-4 text-gray-400" />
          </>
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      
      {node.type === 'folder' && expanded && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeItem
              key={`${child.name}-${i}`}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileBrowser() {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  return (
    <div className="p-4 h-full flex gap-4">
      <div className="w-1/3 bg-gray-800 rounded-lg border border-gray-700 overflow-y-auto">
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <span className="text-sm font-medium">Workspace</span>
          <button className="p-1 hover:bg-gray-700 rounded">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <FileTreeItem
          node={mockFileTree}
          onSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
      </div>
      
      <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {selectedFile ? (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-gray-700 text-sm font-medium">
              {selectedFile.name}
            </div>
            <div className="flex-1 p-3 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {selectedFile.content || <span className="text-gray-500">No preview available</span>}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a file to preview
          </div>
        )}
      </div>
    </div>
  );
}
