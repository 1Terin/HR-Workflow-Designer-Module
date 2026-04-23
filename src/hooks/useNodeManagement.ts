import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import type { NodeType, WorkflowNode } from '../types/workflow';

export const useNodeManagement = () => {
  const { addNode, updateNode, deleteNode, selectNode } = useWorkflowStore();

  const createNode = useCallback(
    (type: NodeType, position: { x: number; y: number }, data: Record<string, unknown>) => {
      const id = `${type}_${Date.now()}`;
      const newNode: WorkflowNode = {
        id,
        type,
        position,
        data: {
          label: String(data.label ?? type),
          ...data,
        },
      };
      addNode(newNode);
      return id;
    },
    [addNode]
  );

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      selectNode(nodeId);
    },
    [selectNode]
  );

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      deleteNode(nodeId);
    },
    [deleteNode]
  );

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      updateNode(nodeId, data);
    },
    [updateNode]
  );

  return {
    createNode,
    handleNodeClick,
    handleNodeDelete,
    handleNodeUpdate,
  };
};

export const useWorkflowOperations = () => {
  const {
    createWorkflow,
    loadWorkflow,
    deleteWorkflow,
    updateWorkflowName,
    validateWorkflow,
    simulateWorkflow,
    clearAll,
  } = useWorkflowStore();

  return {
    createWorkflow,
    loadWorkflow,
    deleteWorkflow,
    updateWorkflowName,
    validateWorkflow,
    simulateWorkflow,
    clearAll,
  };
};
