import { create } from 'zustand';
import type {
  SimulationResult,
  ValidationError,
  Workflow,
  WorkflowEdge,
  WorkflowNode,
} from '../types/workflow';
import { mockApi } from '../api/mockApi';

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  selectedNodeId: string | null;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  validationErrors: ValidationError[];

  // Workflow management
  createWorkflow: (name: string) => string;
  loadWorkflow: (id: string) => void;
  deleteWorkflow: (id: string) => void;
  updateWorkflowName: (id: string, name: string) => void;

  // Node operations
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNode['data']>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;

  // Edge operations
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (edgeId: string) => void;

  // Simulation & Validation
  validateWorkflow: () => ValidationError[];
  simulateWorkflow: () => Promise<void>;

  // Utilities
  clearAll: () => void;
}

const createInitialWorkflow = (id: string, name: string): Workflow => ({
  id,
  name,
  nodes: [],
  edges: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const syncWorkflowCollection = (workflows: Workflow[], updated: Workflow): Workflow[] =>
  workflows.map((workflow) => (workflow.id === updated.id ? updated : workflow));

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,
  validationErrors: [],

  createWorkflow: (name: string) => {
    const id = `workflow_${Date.now()}`;
    const newWorkflow = createInitialWorkflow(id, name);

    set(state => ({
      workflows: [...state.workflows, newWorkflow],
      currentWorkflow: newWorkflow,
    }));

    return id;
  },

  loadWorkflow: (id: string) => {
    set(state => ({
      currentWorkflow: state.workflows.find(w => w.id === id) || null,
      selectedNodeId: null,
      simulationResult: null,
    }));
  },

  deleteWorkflow: (id: string) => {
    set(state => ({
      workflows: state.workflows.filter(w => w.id !== id),
      currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
    }));
  },

  updateWorkflowName: (id: string, name: string) => {
    set(state => ({
      workflows: state.workflows.map(w =>
        w.id === id ? { ...w, name, updatedAt: new Date().toISOString() } : w
      ),
      currentWorkflow:
        state.currentWorkflow?.id === id
          ? { ...state.currentWorkflow, name, updatedAt: new Date().toISOString() }
          : state.currentWorkflow,
    }));
  },

  addNode: (node: WorkflowNode) => {
    set(state => {
      if (!state.currentWorkflow) return {};
      const updatedWorkflow = {
        ...state.currentWorkflow,
        nodes: [...state.currentWorkflow.nodes, node],
        updatedAt: new Date().toISOString(),
      };

      return {
        currentWorkflow: updatedWorkflow,
        workflows: syncWorkflowCollection(state.workflows, updatedWorkflow),
      };
    });
  },

  updateNode: (nodeId: string, data: Partial<WorkflowNode['data']>) => {
    set(state => {
      if (!state.currentWorkflow) return {};
      const updatedWorkflow = {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.map(n =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
        ),
        updatedAt: new Date().toISOString(),
      };

      return {
        currentWorkflow: updatedWorkflow,
        workflows: syncWorkflowCollection(state.workflows, updatedWorkflow),
      };
    });
  },

  deleteNode: (nodeId: string) => {
    set(state => {
      if (!state.currentWorkflow) return {};
      const updatedWorkflow = {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.filter(n => n.id !== nodeId),
        edges: state.currentWorkflow.edges.filter(
          e => e.source !== nodeId && e.target !== nodeId
        ),
        updatedAt: new Date().toISOString(),
      };

      return {
        currentWorkflow: updatedWorkflow,
        workflows: syncWorkflowCollection(state.workflows, updatedWorkflow),
        selectedNodeId: null,
      };
    });
  },

  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  addEdge: (edge: WorkflowEdge) => {
    set(state => {
      if (!state.currentWorkflow) return {};
      const updatedWorkflow = {
        ...state.currentWorkflow,
        edges: [...state.currentWorkflow.edges, edge],
        updatedAt: new Date().toISOString(),
      };

      return {
        currentWorkflow: updatedWorkflow,
        workflows: syncWorkflowCollection(state.workflows, updatedWorkflow),
      };
    });
  },

  deleteEdge: (edgeId: string) => {
    set(state => {
      if (!state.currentWorkflow) return {};
      const updatedWorkflow = {
        ...state.currentWorkflow,
        edges: state.currentWorkflow.edges.filter(e => e.id !== edgeId),
        updatedAt: new Date().toISOString(),
      };

      return {
        currentWorkflow: updatedWorkflow,
        workflows: syncWorkflowCollection(state.workflows, updatedWorkflow),
      };
    });
  },

  validateWorkflow: () => {
    const workflow = get().currentWorkflow;
    if (!workflow) {
      set({ validationErrors: [] });
      return [];
    }

    const errors = mockApi.validateWorkflow(workflow);
    set({ validationErrors: errors });
    return errors;
  },

  simulateWorkflow: async () => {
    const state = get();
    if (!state.currentWorkflow) return;

    set({ isSimulating: true });
    try {
      const errors = state.validateWorkflow();
      if (errors.length > 0) {
        set({ simulationResult: null });
        return;
      }

      const result = await mockApi.simulateWorkflow(state.currentWorkflow);
      set({ simulationResult: result });
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      set({ isSimulating: false });
    }
  },

  clearAll: () => {
    set({
      workflows: [],
      currentWorkflow: null,
      selectedNodeId: null,
      simulationResult: null,
      validationErrors: [],
    });
  },
}));
