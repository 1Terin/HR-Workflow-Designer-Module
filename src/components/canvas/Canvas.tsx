import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { CustomNode } from '../nodes/CustomNode';
import { getDefaultNodeData } from '../../utils/nodeUtils';
import type { NodeType, WorkflowNode } from '../../types/workflow';
import 'reactflow/dist/style.css';
import './Canvas.css';

const nodeTypes = {
  start: CustomNode,
  task: CustomNode,
  approval: CustomNode,
  automatedStep: CustomNode,
  end: CustomNode,
};

export const Canvas: React.FC = () => {
  const {
    currentWorkflow,
    addNode,
    addEdge: storeAddEdge,
    deleteNode,
    deleteEdge,
    selectNode,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(currentWorkflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentWorkflow?.edges || []);

  // Sync workflow state with React Flow state
  React.useEffect(() => {
    if (currentWorkflow) {
      setNodes(currentWorkflow.nodes);
      setEdges(currentWorkflow.edges);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
      };
      setEdges((eds) => addEdge(connection, eds));
      storeAddEdge(newEdge);
    },
    [setEdges, storeAddEdge]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactflowBounds = event.currentTarget.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!nodeType) return;

      const position = {
        x: event.clientX - reactflowBounds.left,
        y: event.clientY - reactflowBounds.top,
      };

      const nodeData = getDefaultNodeData(nodeType);
      const id = `${nodeType}_${Date.now()}`;

      const newNode: WorkflowNode = {
        id,
        type: nodeType,
        position,
        data: {
          label: String(nodeData.label ?? nodeType),
          ...nodeData,
        },
      };

      addNode(newNode);
      setNodes((nds) => [...nds, newNode]);
    },
    [addNode, setNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      selectNode(node.id);
    },
    [selectNode]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      deleteNode(node.id);
    },
    [deleteNode]
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      deleteEdge(edge.id);
    },
    [deleteEdge]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
