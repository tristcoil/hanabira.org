
// VocabularyMap.tsx
import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import CustomNode from "@/components/CustomNode";

const nodeTypes = { custom: CustomNode };

const VocabularyMap = ({ data }) => {

    // const data = {
    //   word: "食べる",
    //   meaning: "to eat",
    //   readings: ["たべる"],
    //   usage: "A common verb used to express eating.",
    //   children: [
    //     // Nested data as in original code
    //   ]
    // };


  const mapVocabularyToNodes = (vocabData, parentId = null) => {
    const node = {
      id: `${vocabData.word}`,
      type: "custom",
      data: {
        word: vocabData.word,
        meaning: vocabData.meaning,
        example: vocabData.example,
        readings: vocabData.readings,
        usage: vocabData.usage,
      },
      position: { x: 0, y: 0 },
      parent: parentId,
    };

    const nodes = [node];
    if (vocabData.children) {
      vocabData.children.forEach((child) => {
        const childNodes = mapVocabularyToNodes(child, node.id);
        nodes.push(...childNodes);
      });
    }

    return nodes;
  };

  const mapVocabularyToEdges = (vocabData) => {
    const edges = [];
    if (vocabData.children) {
      vocabData.children.forEach((child) => {
        edges.push({
          id: `edge-${vocabData.word}-${child.word}`,
          source: `${vocabData.word}`,
          target: `${child.word}`,
          animated: true,
          style: { stroke: "#007bff" },
        });
        edges.push(...mapVocabularyToEdges(child));
      });
    }
    return edges;
  };

  const initialNodes = mapVocabularyToNodes(data);
  const initialEdges = mapVocabularyToEdges(data);

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
    g.setGraph({ ranksep: 120, nodesep: 250 }); // Adjust these values for more/less spacing
    g.setDefaultEdgeLabel(() => ({}));

    // Set nodes and edges in the Dagre graph
    nodes.forEach((node) => g.setNode(node.id, { width: 180, height: 150 }));
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));

    dagre.layout(g);

    // Map Dagre positions to React Flow nodes only if there are changes
    const updatedNodes = nodes.map((node) => {
      const dagreNode = g.node(node.id);
      if (
        dagreNode &&
        (node.position.x !== dagreNode.x || node.position.y !== dagreNode.y)
      ) {
        return { ...node, position: { x: dagreNode.x, y: dagreNode.y } };
      }
      return node;
    });

    // Check if positions have changed before updating
    if (
      updatedNodes.some(
        (node, index) =>
          node.position.x !== nodes[index].position.x ||
          node.position.y !== nodes[index].position.y
      )
    ) {
      setNodes(updatedNodes);
    }
  }, [nodes, edges, setNodes]);

  return (
    <div style={{ width: "100%", height: "1200px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default VocabularyMap;