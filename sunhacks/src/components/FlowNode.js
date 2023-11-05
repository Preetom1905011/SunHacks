import React from "react";
import "../styles/flowNode.scss";
import { useState, useCallback } from 'react';
import ReactFlow, { Controls, Background, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: '!!!!!' },
    position: { x: 200, y: 200 },
  },
];

const initialEdges = [{ id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' },
                      { id: '2-3', source: '2', target: '3', label: '----', type: 'step' }];

export default function FlowNode() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onPosChange = () => {
    const updatedEdges = initialEdges.map(edge => {
      if (edge.id === '2-3') {
        return {...edge, source: '1', target: '3', id: '1-3'}; // Update the specific edge
      }
      return edge; // Leave other edges unchanged
    });
    console.log(updatedEdges)
    setEdges(updatedEdges)
  }
  return (
    <div className="flowContainer">
      <div style={{ height: "100%" }}>
        <ReactFlow 
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}>
          <Background />
          <Controls />
        </ReactFlow>
        <button onClick={onPosChange}>Switch</button>
      </div>
    </div>
  );
}
