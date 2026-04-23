import type { SimulationResult, SimulationStep, ValidationError, Workflow } from '../types/workflow';

export interface AutomationAction {
  id: string;
  label: string;
  description?: string;
  params: string[];
}

// Mock automation actions
const MOCK_ACTIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Send an email to specified recipient',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    description: 'Generate a document from template',
    params: ['template', 'recipient', 'format'],
  },
  {
    id: 'create_task',
    label: 'Create Task',
    description: 'Create a task for follow-up',
    params: ['assignee', 'taskName', 'priority'],
  },
  {
    id: 'update_database',
    label: 'Update Database',
    description: 'Update employee database',
    params: ['field', 'value', 'recordId'],
  },
  {
    id: 'send_notification',
    label: 'Send Notification',
    description: 'Send system notification',
    params: ['channel', 'message'],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockApi = {
  // Get available automation actions
  async getAutomations(): Promise<AutomationAction[]> {
    await delay(200);
    return MOCK_ACTIONS;
  },

  // Validate workflow structure
  validateWorkflow(workflow: Workflow): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for start node
    const hasStart = workflow.nodes.some(n => n.type === 'start');
    if (!hasStart) {
      errors.push({
        type: 'MISSING_START',
        message: 'Workflow must have a Start node',
      });
    }

    // Check for end node
    const hasEnd = workflow.nodes.some(n => n.type === 'end');
    if (!hasEnd) {
      errors.push({
        type: 'MISSING_END',
        message: 'Workflow must have an End node',
      });
    }

    // Check start node is first
    if (workflow.nodes.length > 0) {
      const firstNode = workflow.nodes[0];
      if (firstNode.type !== 'start') {
        const startNode = workflow.nodes.find(n => n.type === 'start');
        if (startNode) {
          errors.push({
            type: 'START_NOT_FIRST',
            message: 'Start node should typically be first',
            nodeId: startNode.id,
          });
        }
      }
    }

    // Check for cycles (simplified)
    const visitNode = (nodeId: string, visited = new Set<string>()): boolean => {
      if (visited.has(nodeId)) return true; // Cycle detected
      visited.add(nodeId);

      const outgoing = workflow.edges.filter(e => e.source === nodeId);
      for (const edge of outgoing) {
        if (visitNode(edge.target, new Set(visited))) {
          return true;
        }
      }
      return false;
    };

    for (const node of workflow.nodes) {
      if (visitNode(node.id)) {
        errors.push({
          type: 'CYCLE_DETECTED',
          message: 'Workflow contains a cycle',
          nodeId: node.id,
        });
        break;
      }
    }

    // Check for disconnected nodes
    for (const node of workflow.nodes) {
      if (node.type !== 'start') {
        const hasIncoming = workflow.edges.some(e => e.target === node.id);
        if (!hasIncoming) {
          errors.push({
            type: 'DISCONNECTED_NODE',
            message: `Node "${node.data.label}" has no incoming connection`,
            nodeId: node.id,
          });
        }
      }
    }

    return errors;
  },

  // Simulate workflow execution
  async simulateWorkflow(workflow: Workflow): Promise<SimulationResult> {
    await delay(500);

    const validationErrors = this.validateWorkflow(workflow);
    if (validationErrors.length > 0) {
      return {
        workflowId: workflow.id,
        success: false,
        totalSteps: 0,
        steps: [],
        completedAt: new Date().toISOString(),
        errors: validationErrors.map(e => e.message),
      };
    }

    // Build execution path
    const steps: SimulationStep[] = [];
    const visited = new Set<string>();
    let currentNodeId = workflow.nodes.find(n => n.type === 'start')?.id;
    let stepNumber = 1;

    while (currentNodeId && !visited.has(currentNodeId) && stepNumber <= 50) {
      visited.add(currentNodeId);
      const currentNode = workflow.nodes.find(n => n.id === currentNodeId);

      if (!currentNode) break;

      // Simulate step
      const step: SimulationStep = {
        stepNumber,
        nodeId: currentNode.id,
        nodeLabel: String(currentNode.data.label ?? currentNode.type),
        timestamp: new Date(Date.now() + stepNumber * 1000).toISOString(),
        status: 'completed',
        data: {
          type: currentNode.type,
          ...currentNode.data,
        },
      };

      steps.push(step);

      // Find next node
      const nextEdge = workflow.edges.find(e => e.source === currentNodeId);
      currentNodeId = nextEdge?.target;
      stepNumber++;

      // Simulate some async operations
      if (currentNode.type === 'automatedStep' || currentNode.type === 'approval') {
        await delay(100);
      }
    }

    return {
      workflowId: workflow.id,
      success: true,
      totalSteps: steps.length,
      steps,
      completedAt: new Date().toISOString(),
    };
  },

  // Mock export workflow
  exportWorkflow(workflow: Workflow): string {
    return JSON.stringify(workflow, null, 2);
  },

  // Mock import workflow
  importWorkflow(json: string): Workflow {
    return JSON.parse(json);
  },
};
