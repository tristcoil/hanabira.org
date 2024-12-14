// CustomNode.tsx
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {
  return (
    <div className="p-4 shadow-lg rounded-lg bg-white border-2 border-gray-300 max-w-sm">
      <div className="text-center mb-2">
        <div className="text-xl font-semibold">{data.word}</div>
        <div className="text-gray-500 text-sm mb-1">Meaning: {data.meaning}</div>
      </div>
      <div className="text-sm text-gray-700 mb-2">
        <div><strong>Example:</strong> {data.example}</div>
        <div><strong>Readings:</strong> {data.readings.join(", ")}</div>
        <div><strong>Usage:</strong> {data.usage}</div>
      </div>
      <Handle type="target" position={Position.Top} className="w-8 h-2 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-8 h-2 bg-blue-500" />
    </div>
  );
}

export default memo(CustomNode);
