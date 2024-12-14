'use client';

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



//'use client';

import { useEffect, useCallback } from 'react';
import { useState } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const VocabularyMap = () => {
  // Hardcoded JSON data
//   const data = {
//     word: "食べる",
//     meaning: "to eat",
//     nodes: [
//       {
//         id: "1",
//         word: "いただく",
//         meaning: "to receive (humble form of to eat)",
//         type: "synonym"
//       },
//       {
//         id: "2",
//         word: "食べてみる",
//         meaning: "to try eating",
//         type: "phrase"
//       },
//       {
//         id: "3",
//         word: "食べ物",
//         meaning: "food",
//         type: "related word"
//       },
//       {
//         id: "4",
//         word: "食べたくなる",
//         meaning: "to want to eat",
//         type: "grammar"
//       },
//       {
//         id: "5",
//         word: "食べました",
//         meaning: "ate (polite past form)",
//         type: "conjugation"
//       }
//     ]
//   };


const data = {
    word: "食べる",
    meaning: "to eat",
    kanji: "食べる",  // Kanji for the word
    readings: ["たべる"],  // Kana reading(s)
    type: "verb",  // General type of the word
    usage: "Commonly used verb in daily life",
    nodes: [
      {
        id: "1",
        word: "いただく",
        meaning: "to receive (humble form of to eat)",
        type: "synonym",
        example: "お料理をいただく (I humbly receive the meal)",
        readings: ["いただく"],
        kanji: "いただく",
        usage: "Humble form, used in formal situations",
      },
      {
        id: "2",
        word: "食べてみる",
        meaning: "to try eating",
        type: "phrase",
        example: "新しい料理を食べてみる (I try eating new dishes)",
        readings: ["たべてみる"],
        kanji: "食べてみる",
        usage: "Common phrase used when trying something new",
      },
      {
        id: "3",
        word: "食べ物",
        meaning: "food",
        type: "related word",
        example: "食べ物を買う (Buy food)",
        readings: ["たべもの"],
        kanji: "食べ物",
        usage: "Refers to anything edible",
      },
      {
        id: "4",
        word: "食べたくなる",
        meaning: "to want to eat",
        type: "grammar",
        example: "お腹が空いて食べたくなる (I get hungry and want to eat)",
        readings: ["たべたくなる"],
        kanji: "食べたくなる",
        usage: "Used when expressing desire to eat",
      },
      {
        id: "5",
        word: "食べました",
        meaning: "ate (polite past form)",
        type: "conjugation",
        example: "昼ご飯を食べました (I ate lunch)",
        readings: ["たべました"],
        kanji: "食べました",
        usage: "Polite past form of 食べる",
      },
      {
        id: "6",
        word: "食べ過ぎる",
        meaning: "to overeat",
        type: "collocation",
        example: "夜遅くに食べ過ぎる (Overeat late at night)",
        readings: ["たべすぎる"],
        kanji: "食べ過ぎる",
        usage: "Refers to eating too much",
      },
      {
        id: "7",
        word: "食事",
        meaning: "meal",
        type: "related word",
        example: "朝食は食事です (Breakfast is a meal)",
        readings: ["しょくじ"],
        kanji: "食事",
        usage: "Formal term for a meal",
      },
      {
        id: "8",
        word: "食べ合わせ",
        meaning: "food pairing",
        type: "idiomatic phrase",
        example: "この料理は食べ合わせが良い (This dish has a good food pairing)",
        readings: ["たべあわせ"],
        kanji: "食べ合わせ",
        usage: "Refers to food combinations that go well together",
      },
    ],
  };

















  const initialNodes = [
    {
      id: '0',
      type: 'input',
      data: { label: `${data.word} - ${data.meaning}` },
      position: { x: 0, y: 0 }
    },
    ...data.nodes.map((node) => ({
      id: node.id,
      data: { label: `${node.word} - ${node.meaning}` },
      position: { x: 0, y: 0 }
    }))
  ];

  const initialEdges = data.nodes.map((node) => ({
    id: `edge-${node.id}`,
    source: '0',
    target: node.id,
    animated: true,
    style: { stroke: '#ff0072' }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, position: { x: node.position.x, y: node.position.y } }
            : n
        )
      );
    },
    [setNodes]
  );

  useEffect(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    // Adding nodes to graph
    nodes.forEach((node) => {
      g.setNode(node.id, { width: 172, height: 36 });
    });

    // Adding edges to graph
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    // Perform layout
    dagre.layout(g);

    // Check if node positions need to be updated
    const updatedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node(node.id);
      if (node.position.x !== nodeWithPosition.x || node.position.y !== nodeWithPosition.y) {
        return { ...node, position: { x: nodeWithPosition.x, y: nodeWithPosition.y } };
      }
      return node;
    });

    // Only update nodes if there are any changes
    const hasPositionChanged = updatedNodes.some((node, index) => {
      return node.position.x !== nodes[index].position.x || node.position.y !== nodes[index].position.y;
    });

    if (hasPositionChanged) {
      setNodes(updatedNodes);
    }
  }, [nodes, edges, setNodes]); // Ensure the effect only runs when nodes or edges change

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop} // Handle node drag stop event
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
