import type { Edge, Node } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automatedStep' | 'end';

export interface BaseNodeData {
  label: string;
  title?: string;
  [key: string]: unknown;
}

export interface StartNodeData extends BaseNodeData {
  startTitle: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold?: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  title: string;
  actionId?: string;
  actionParams?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage?: string;
  summaryFlag?: boolean;
}

export type WorkflowNode = Node<
  StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedStepNodeData | EndNodeData,
  NodeType
>;

export type WorkflowEdge = Edge;

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationError {
  type: string;
  message: string;
  nodeId?: string;
}

export interface WorkflowValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export interface SimulationStep {
  stepNumber: number;
  nodeId: string;
  nodeLabel: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'error';
  data?: Record<string, unknown>;
}

export interface SimulationResult {
  workflowId: string;
  success: boolean;
  totalSteps: number;
  steps: SimulationStep[];
  completedAt: string;
  errors?: string[];
}
