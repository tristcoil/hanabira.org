'use client';


// TODO: database schema react flow component would be ideal for our vocab structure - with many keys, but for that we need shadcn initialized
// it would be very nice though
// https://reactflow.dev/components/nodes/database-schema-node


// pages/vocab-map.js
import React from 'react';
//import VocabularyMap from '../components/VocabularyMap';

const VocabMapPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dynamic Vocabulary Map</h1>
      <VocabularyMap />
    </div>
  );
};

export default VocabMapPage;




//------------------





// components/VocabularyMap.js
//import React from 'react';
import { useCallback } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const VocabularyMap = () => {
  // Hardcoded JSON data
  const data = {
    word: "食べる",
    meaning: "to eat",
    nodes: [
      {
        id: "1",
        word: "いただく",
        meaning: "to receive (humble form of to eat)",
        type: "synonym"
      },
      {
        id: "2",
        word: "食べてみる",
        meaning: "to try eating",
        type: "phrase"
      },
      {
        id: "3",
        word: "食べ物",
        meaning: "food",
        type: "related word"
      },
      {
        id: "4",
        word: "食べたくなる",
        meaning: "to want to eat",
        type: "grammar"
      },
      {
        id: "5",
        word: "食べました",
        meaning: "ate (polite past form)",
        type: "conjugation"
      }
    ]
  };

  // Define nodes and edges
  const initialNodes = [
    {
      id: '0',
      type: 'input',
      data: { label: `${data.word} - ${data.meaning}` },
      position: { x: 250, y: 50 }
    },
    ...data.nodes.map((node, index) => ({
      id: node.id,
      data: { label: `${node.word} - ${node.meaning}` },
      position: { x: 100 * (index + 1), y: 200 }
    }))
  ];

  const initialEdges = data.nodes.map((node) => ({
    id: `edge-${node.id}`,
    source: '0',
    target: node.id,
    animated: true,
    style: { stroke: '#ff0072' }
  }));

  // State hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle edge connection
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

//export default VocabularyMap;
