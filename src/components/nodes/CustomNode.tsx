import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { getNodeTypeColor } from '../../utils/nodeUtils';
import type { NodeType, WorkflowNode } from '../../types/workflow';
import './CustomNode.css';

export const CustomNode: React.FC<NodeProps<WorkflowNode['data']>> = ({ data, selected, type }) => {
  const nodeType = (type ?? 'task') as NodeType;
  const color = getNodeTypeColor(nodeType);

  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`} style={{ borderColor: color }}>
      <Handle type="target" position={Position.Top} />

      <div className="node-content">
        <div className="node-type" style={{ backgroundColor: color }}>
          {String(data.label ?? nodeType)}
        </div>
        <div className="node-body">
          {typeof data.title === 'string' && data.title && <p className="node-title">{data.title}</p>}
          {typeof data.description === 'string' && data.description && <p className="node-desc">{data.description}</p>}
          {typeof data.startTitle === 'string' && data.startTitle && <p className="node-title">{data.startTitle}</p>}
          {typeof data.approverRole === 'string' && data.approverRole && <p className="node-desc">Role: {data.approverRole}</p>}
          {typeof data.endMessage === 'string' && data.endMessage && <p className="node-title">{data.endMessage}</p>}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
