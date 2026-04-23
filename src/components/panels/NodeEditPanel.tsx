import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useWorkflowStore } from '../../store/workflowStore';
import { StartNodeForm } from '../forms/StartNodeForm';
import { TaskNodeForm } from '../forms/TaskNodeForm';
import { ApprovalNodeForm } from '../forms/ApprovalNodeForm';
import { AutomatedStepNodeForm } from '../forms/AutomatedStepNodeForm';
import { EndNodeForm } from '../forms/EndNodeForm';
import { getNodeTypeColor } from '../../utils/nodeUtils';
import type { NodeType } from '../../types/workflow';
import './NodeEditPanel.css';

interface KeyValueEntry {
  key: string;
  value: string;
}

type FormValues = Record<string, unknown> & {
  metadataEntries?: KeyValueEntry[];
  customFieldEntries?: KeyValueEntry[];
};

const entriesToRecord = (entries: KeyValueEntry[] | undefined): Record<string, string> => {
  if (!entries) return {};
  return entries.reduce<Record<string, string>>((acc, entry) => {
    const key = entry.key.trim();
    if (key) {
      acc[key] = entry.value;
    }
    return acc;
  }, {});
};

export const NodeEditPanel: React.FC = () => {
  const { currentWorkflow, selectedNodeId, updateNode } = useWorkflowStore();
  const methods = useForm<FormValues>({ mode: 'onChange' });

  const selectedNode = useMemo(
    () => currentWorkflow?.nodes.find(n => n.id === selectedNodeId),
    [currentWorkflow, selectedNodeId]
  );

  const nodeType = (selectedNode?.type || 'task') as NodeType;

  const renderForm = () => {
    if (!selectedNode) return null;

    switch (nodeType) {
      case 'start':
        return <StartNodeForm />;
      case 'task':
        return <TaskNodeForm />;
      case 'approval':
        return <ApprovalNodeForm />;
      case 'automatedStep':
        return <AutomatedStepNodeForm />;
      case 'end':
        return <EndNodeForm />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  React.useEffect(() => {
    if (selectedNode) {
      methods.reset({
        ...selectedNode.data,
        metadataEntries: Object.entries((selectedNode.data.metadata as Record<string, string>) ?? {}).map(
          ([key, value]) => ({ key, value })
        ),
        customFieldEntries: Object.entries((selectedNode.data.customFields as Record<string, string>) ?? {}).map(
          ([key, value]) => ({ key, value })
        ),
      });
    }
  }, [selectedNode, methods]);

  const onSubmit = (data: FormValues) => {
    if (selectedNode) {
      const payload: Record<string, unknown> = { ...data };

      delete payload.metadataEntries;
      delete payload.customFieldEntries;

      if (selectedNode.type === 'start') {
        payload.metadata = entriesToRecord(data.metadataEntries);
      }

      if (selectedNode.type === 'task') {
        payload.customFields = entriesToRecord(data.customFieldEntries);
      }

      updateNode(selectedNode.id, payload);
    }
  };

  if (!selectedNode) {
    return (
      <div className="edit-panel">
        <div className="empty-state">
          <p>Select a node to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-panel">
      <div className="panel-header">
        <h3>Edit Node</h3>
        <div className="node-badge" style={{ backgroundColor: getNodeTypeColor(nodeType) }}>
          {nodeType}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onChange={() => onSubmit(methods.getValues())}>
          {renderForm()}
        </form>
      </FormProvider>

      <div className="panel-info">
        <p><strong>Node ID:</strong> {selectedNode.id}</p>
        <p><strong>Position:</strong> ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</p>
      </div>
    </div>
  );
};
