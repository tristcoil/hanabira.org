"use client";

// TODO: database schema react flow component would be ideal for our vocab structure - with many keys, but for that we need shadcn initialized
// it would be very nice though
// https://reactflow.dev/components/nodes/database-schema-node

// pages/vocab-map.js
import React from "react";
import VocabularyMap from "@/components-parser/VocabularyMap";

const VocabMapPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dynamic Vocabulary Map</h1>
      <VocabularyMap data={data} />
    </div>
  );
};

export default VocabMapPage;

// ------------------------------------- //


// ----------------- vars ----------------------------- //

const data = {
  word: "食べる",
  meaning: "to eat",
  readings: ["たべる"],
  usage: "A common verb used to express eating.",
  children: [
    {
      word: "いただく",
      meaning: "to receive (humble form of to eat)",
      example: "お料理をいただく (I humbly receive the meal)",
      readings: ["いただく"],
      usage: "Used in formal or respectful situations (humble form).",
      children: [
        {
          word: "お食事",
          meaning: "a meal (respectful)",
          example: "お食事をいただく (I humbly have a meal)",
          readings: ["おしょくじ"],
          usage: "A respectful form of 食事, used in formal settings.",
        },
      ],
    },
    {
      word: "食べてみる",
      meaning: "to try eating",
      example: "新しい料理を食べてみる (I try eating new dishes)",
      readings: ["たべてみる"],
      usage: "Used when trying something for the first time.",
      children: [
        {
          word: "試す",
          meaning: "to try, to test",
          example: "新しい料理を試す (Try new dishes)",
          readings: ["ためす"],
          usage: "A synonym of 食べてみる, often used in broader contexts.",
        },
      ],
    },
    {
      word: "食べ物",
      meaning: "food",
      example: "食べ物を買う (Buy food)",
      readings: ["たべもの"],
      usage: "A generic term for food.",
      children: [
        {
          word: "食料",
          meaning: "foodstuffs, provisions",
          example: "食料を買いに行く (Go to buy provisions)",
          readings: ["しょくりょう"],
          usage: "Refers to food in terms of supplies or provisions.",
        },
      ],
    },
    {
      word: "食べたくなる",
      meaning: "to want to eat",
      example: "お腹が空いて食べたくなる (I get hungry and want to eat)",
      readings: ["たべたくなる"],
      usage: "Expression used when describing desire to eat.",
      children: [
        {
          word: "欲しい",
          meaning: "want, desire",
          example: "欲しいものを買う (Buy what I want)",
          readings: ["ほしい"],
          usage:
            "A more general term for desire, not necessarily related to food.",
        },
      ],
    },
    {
      word: "食べました",
      meaning: "ate (polite past form)",
      example: "昼ご飯を食べました (I ate lunch)",
      readings: ["たべました"],
      usage: "Polite past form of 食べる.",
      children: [
        {
          word: "食べませんでした",
          meaning: "did not eat (polite past negative)",
          example: "昼ご飯を食べませんでした (I did not eat lunch)",
          readings: ["たべませんでした"],
          usage: "Polite past negative form of 食べる.",
        },
      ],
    },
  ],
};

// const data = {
//   word: "食べる",
//   meaning: "to eat",
//   readings: ["たべる"],
//   usage: "A common verb in Japanese used to express the action of eating.",
//   children: [
//     {
//       word: "食べます",
//       meaning: "eat (polite present form)",
//       example: "ご飯を食べます (I eat rice)",
//       readings: ["たべます"],
//       usage: "Polite present form, used in formal contexts.",
//       children: []
//     },
//     {
//       word: "食べました",
//       meaning: "ate (polite past form)",
//       example: "昼ご飯を食べました (I ate lunch)",
//       readings: ["たべました"],
//       usage: "Polite past form, used in formal contexts.",
//       children: [
//         {
//           word: "食べませんでした",
//           meaning: "did not eat (polite past negative)",
//           example: "昼ご飯を食べませんでした (I did not eat lunch)",
//           readings: ["たべませんでした"],
//           usage: "Polite past negative form, used in formal contexts."
//         }
//       ]
//     },
//     {
//       word: "食べない",
//       meaning: "do not eat (casual negative present form)",
//       example: "野菜を食べない (I do not eat vegetables)",
//       readings: ["たべない"],
//       usage: "Casual negative form, used in informal settings.",
//       children: [
//         {
//           word: "食べなかった",
//           meaning: "did not eat (casual past negative)",
//           example: "朝ご飯を食べなかった (I did not eat breakfast)",
//           readings: ["たべなかった"],
//           usage: "Casual past negative form, used in informal settings."
//         }
//       ]
//     },
//     {
//       word: "食べて",
//       meaning: "eat (te-form)",
//       example: "食べてください (Please eat)",
//       readings: ["たべて"],
//       usage: "Te-form, used for making requests or linking verbs in compound sentences.",
//       children: []
//     },
//     {
//       word: "食べたい",
//       meaning: "want to eat (desiderative)",
//       example: "寿司を食べたい (I want to eat sushi)",
//       readings: ["たべたい"],
//       usage: "Desiderative form, used to express the desire to eat.",
//       children: []
//     },
//     {
//       word: "食べられる",
//       meaning: "can eat (potential form)",
//       example: "何でも食べられる (I can eat anything)",
//       readings: ["たべられる"],
//       usage: "Potential form, used to express the ability to eat.",
//       children: []
//     },
//     {
//       word: "食べよう",
//       meaning: "let's eat (volitional form)",
//       example: "ご飯を食べよう (Let's eat rice)",
//       readings: ["たべよう"],
//       usage: "Volitional form, expressing a suggestion or invitation to eat.",
//       children: []
//     }
//   ]
// };

// const data = {
//   word: "먹다",
//   meaning: "to eat",
//   readings: ["먹다"],
//   usage: "A common verb in Korean used to express the action of eating.",
//   children: [
//     {
//       word: "먹습니다",
//       meaning: "eat (polite present form)",
//       example: "밥을 먹습니다 (I eat rice)",
//       readings: ["먹습니다"],
//       usage: "Polite present form, used in formal contexts.",
//       children: []
//     },
//     {
//       word: "먹었습니다",
//       meaning: "ate (polite past form)",
//       example: "저녁을 먹었습니다 (I ate dinner)",
//       readings: ["먹었습니다"],
//       usage: "Polite past form, used in formal contexts.",
//       children: [
//         {
//           word: "먹지 않았습니다",
//           meaning: "did not eat (polite past negative)",
//           example: "아침을 먹지 않았습니다 (I did not eat breakfast)",
//           readings: ["먹지 않았습니다"],
//           usage: "Polite past negative form, used in formal contexts."
//         }
//       ]
//     },
//     {
//       word: "먹지 않다",
//       meaning: "do not eat (casual negative present form)",
//       example: "채소를 먹지 않다 (I do not eat vegetables)",
//       readings: ["먹지 않다"],
//       usage: "Casual negative present form, used in informal settings.",
//       children: [
//         {
//           word: "먹지 않았다",
//           meaning: "did not eat (casual past negative)",
//           example: "아침을 먹지 않았다 (I did not eat breakfast)",
//           readings: ["먹지 않았다"],
//           usage: "Casual past negative form, used in informal settings."
//         }
//       ]
//     },
//     {
//       word: "먹어",
//       meaning: "eat (casual present form)",
//       example: "밥을 먹어 (I eat rice)",
//       readings: ["먹어"],
//       usage: "Casual present form, used in informal or familiar contexts.",
//       children: []
//     },
//     {
//       word: "먹고 싶다",
//       meaning: "want to eat (desiderative form)",
//       example: "김치를 먹고 싶다 (I want to eat kimchi)",
//       readings: ["먹고 싶다"],
//       usage: "Desiderative form, used to express the desire to eat.",
//       children: []
//     },
//     {
//       word: "먹을 수 있다",
//       meaning: "can eat (potential form)",
//       example: "모든 음식을 먹을 수 있다 (I can eat all foods)",
//       readings: ["먹을 수 있다"],
//       usage: "Potential form, used to express the ability to eat.",
//       children: []
//     },
//     {
//       word: "먹자",
//       meaning: "let's eat (volitional form)",
//       example: "밥을 먹자 (Let's eat rice)",
//       readings: ["먹자"],
//       usage: "Volitional form, expressing a suggestion or invitation to eat.",
//       children: []
//     }
//   ]
// };

//------------------

// //'use client';

// import { useEffect, useCallback } from 'react';
// import { useState } from 'react';
// import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, BackgroundVariant } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import dagre from 'dagre';

// // import React, { useCallback, useEffect } from 'react';
// // import ReactFlow, { Controls, MiniMap, Background, BackgroundVariant, useEdgesState, useNodesState, addEdge } from 'reactflow';
// // import dagre from 'dagre';

// const VocabularyMap = () => {
//     // Data structure for nested vocabulary
//     const data = {
//       word: "食べる",
//       meaning: "to eat",
//       readings: ["たべる"],
//       usage: "A common verb used to express eating.",
//       children: [
//         {
//           word: "いただく",
//           meaning: "to receive (humble form of to eat)",
//           example: "お料理をいただく (I humbly receive the meal)",
//           readings: ["いただく"],
//           usage: "Used in formal or respectful situations (humble form).",
//           children: [
//             {
//               word: "お食事",
//               meaning: "a meal (respectful)",
//               example: "お食事をいただく (I humbly have a meal)",
//               readings: ["おしょくじ"],
//               usage: "A respectful form of 食事, used in formal settings."
//             }
//           ]
//         },
//         {
//           word: "食べてみる",
//           meaning: "to try eating",
//           example: "新しい料理を食べてみる (I try eating new dishes)",
//           readings: ["たべてみる"],
//           usage: "Used when trying something for the first time.",
//           children: [
//             {
//               word: "試す",
//               meaning: "to try, to test",
//               example: "新しい料理を試す (Try new dishes)",
//               readings: ["ためす"],
//               usage: "A synonym of 食べてみる, often used in broader contexts."
//             }
//           ]
//         },
//         {
//           word: "食べ物",
//           meaning: "food",
//           example: "食べ物を買う (Buy food)",
//           readings: ["たべもの"],
//           usage: "A generic term for food.",
//           children: [
//             {
//               word: "食料",
//               meaning: "foodstuffs, provisions",
//               example: "食料を買いに行く (Go to buy provisions)",
//               readings: ["しょくりょう"],
//               usage: "Refers to food in terms of supplies or provisions."
//             }
//           ]
//         },
//         {
//           word: "食べたくなる",
//           meaning: "to want to eat",
//           example: "お腹が空いて食べたくなる (I get hungry and want to eat)",
//           readings: ["たべたくなる"],
//           usage: "Expression used when describing desire to eat.",
//           children: [
//             {
//               word: "欲しい",
//               meaning: "want, desire",
//               example: "欲しいものを買う (Buy what I want)",
//               readings: ["ほしい"],
//               usage: "A more general term for desire, not necessarily related to food."
//             }
//           ]
//         },
//         {
//           word: "食べました",
//           meaning: "ate (polite past form)",
//           example: "昼ご飯を食べました (I ate lunch)",
//           readings: ["たべました"],
//           usage: "Polite past form of 食べる.",
//           children: [
//             {
//               word: "食べませんでした",
//               meaning: "did not eat (polite past negative)",
//               example: "昼ご飯を食べませんでした (I did not eat lunch)",
//               readings: ["たべませんでした"],
//               usage: "Polite past negative form of 食べる."
//             }
//           ]
//         }
//       ]
//     };

//     // Recursive function to convert nested vocabulary data into nodes
//     const mapVocabularyToNodes = (vocabData, parentId = null) => {
//       const node = {
//         id: `${vocabData.word}`,  // Use word as the ID
//         data: {
//           label: `${vocabData.word}\nMeaning: ${vocabData.meaning}\nExample: ${vocabData.example}\nReadings: ${vocabData.readings.join(", ")}\nUsage: ${vocabData.usage}`,  // Plain text label
//         },
//         position: { x: 0, y: 0 },
//         parent: parentId
//       };

//       const nodes = [node];
//       if (vocabData.children) {
//         vocabData.children.forEach((child) => {
//           const childNodes = mapVocabularyToNodes(child, node.id);
//           nodes.push(...childNodes);
//         });
//       }

//       return nodes;
//     };

//     // Recursive function to convert nested vocabulary data into edges
//     const mapVocabularyToEdges = (vocabData) => {
//       const edges = [];
//       if (vocabData.children) {
//         vocabData.children.forEach((child) => {
//           edges.push({
//             id: `edge-${vocabData.word}-${child.word}`,
//             source: `${vocabData.word}`,
//             target: `${child.word}`,
//             animated: true,
//             style: { stroke: '#ff0072' }
//           });
//           edges.push(...mapVocabularyToEdges(child));
//         });
//       }
//       return edges;
//     };

//     const initialNodes = mapVocabularyToNodes(data);
//     const initialEdges = mapVocabularyToEdges(data);

//     const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//     const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//     const onConnect = useCallback(
//       (params) => setEdges((eds) => addEdge(params, eds)),
//       [setEdges]
//     );

//     const onNodeDragStop = useCallback(
//       (event, node) => {
//         setNodes((nds) =>
//           nds.map((n) =>
//             n.id === node.id
//               ? { ...n, position: { x: node.position.x, y: node.position.y } }
//               : n
//           )
//         );
//       },
//       [setNodes]
//     );

//     useEffect(() => {
//       const g = new dagre.graphlib.Graph();
//       g.setGraph({});
//       g.setDefaultEdgeLabel(() => ({}));

//       // Adding nodes to graph
//       nodes.forEach((node) => {
//         g.setNode(node.id, { width: 172, height: 180 });  // Increase height for readability
//       });

//       // Adding edges to graph
//       edges.forEach((edge) => {
//         g.setEdge(edge.source, edge.target);
//       });

//       // Perform layout
//       dagre.layout(g);

//       // Check if node positions need to be updated
//       const updatedNodes = nodes.map((node) => {
//         const nodeWithPosition = g.node(node.id);
//         if (node.position.x !== nodeWithPosition.x || node.position.y !== nodeWithPosition.y) {
//           return { ...node, position: { x: nodeWithPosition.x, y: nodeWithPosition.y } };
//         }
//         return node;
//       });

//       // Only update nodes if there are any changes
//       const hasPositionChanged = updatedNodes.some((node, index) => {
//         return node.position.x !== nodes[index].position.x || node.position.y !== nodes[index].position.y;
//       });

//       if (hasPositionChanged) {
//         setNodes(updatedNodes);
//       }
//     }, [nodes, edges, setNodes]);

//     return (
//       <div style={{ width: '100%', height: '500px' }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeDragStop={onNodeDragStop}  // Handle node drag stop event
//           fitView
//         >
//           <Controls />
//           <MiniMap />
//           <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
//         </ReactFlow>
//       </div>
//     );
//   };

// //  export default VocabularyMap;
