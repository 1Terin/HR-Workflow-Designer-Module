import type {
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  NodeType,
  StartNodeData,
  TaskNodeData,
} from '../types/workflow';

export const getDefaultNodeData = (type: NodeType): Record<string, unknown> => {
  switch (type) {
    case 'start':
      return {
        label: 'Start',
        startTitle: 'Workflow Start',
        metadata: {},
      } as StartNodeData;

    case 'task':
      return {
        label: 'Task',
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {},
      } as TaskNodeData;

    case 'approval':
      return {
        label: 'Approval',
        title: 'Approval Step',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      } as ApprovalNodeData;

    case 'automatedStep':
      return {
        label: 'Automated Step',
        title: 'System Action',
        actionId: '',
        actionParams: {},
      } as AutomatedStepNodeData;

    case 'end':
      return {
        label: 'End',
        endMessage: 'Workflow completed',
        summaryFlag: false,
      } as EndNodeData;

    default:
      return { label: type };
  }
};

export const getNodeTypeLabel = (type: NodeType): string => {
  const labels: Record<NodeType, string> = {
    start: '▶ Start',
    task: '✓ Task',
    approval: '⊙ Approval',
    automatedStep: '⚙ Automated',
    end: '■ End',
  };
  return labels[type];
};

export const getNodeTypeColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    start: '#10b981',
    task: '#3b82f6',
    approval: '#f59e0b',
    automatedStep: '#8b5cf6',
    end: '#ef4444',
  };
  return colors[type];
};

export const validateNodeData = (type: NodeType, data: Record<string, unknown>): string[] => {
  const errors: string[] = [];
  const getString = (value: unknown): string => (typeof value === 'string' ? value : '');

  switch (type) {
    case 'task':
      if (getString(data.title).trim() === '') {
        errors.push('Task title is required');
      }
      break;

    case 'approval':
      if (getString(data.title).trim() === '') {
        errors.push('Approval title is required');
      }
      if (getString(data.approverRole).trim() === '') {
        errors.push('Approver role is required');
      }
      break;

    case 'automatedStep':
      if (getString(data.title).trim() === '') {
        errors.push('Automated step title is required');
      }
      if (!data.actionId) {
        errors.push('Action must be selected');
      }
      break;

    case 'start':
      if (getString(data.startTitle).trim() === '') {
        errors.push('Start title is required');
      }
      break;

    case 'end':
      if (getString(data.endMessage).trim() === '') {
        errors.push('End message is required');
      }
      break;
  }

  return errors;
};
