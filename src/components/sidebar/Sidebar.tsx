import React from 'react';
import type { NodeType } from '../../types/workflow';
import { getNodeTypeLabel, getNodeTypeColor } from '../../utils/nodeUtils';
import './Sidebar.css';

const NODE_TYPES: NodeType[] = ['start', 'task', 'approval', 'automatedStep', 'end'];

export const Sidebar: React.FC = () => {
  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', nodeType);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Node Types</h3>
        <p className="subtitle">Drag nodes to canvas</p>
      </div>

      <div className="nodes-list">
        {NODE_TYPES.map(nodeType => (
          <div
            key={nodeType}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType)}
            className="draggable-node"
            style={{
              borderLeftColor: getNodeTypeColor(nodeType),
              backgroundColor: `${getNodeTypeColor(nodeType)}10`,
            }}
          >
            <div className="node-type-indicator" style={{ backgroundColor: getNodeTypeColor(nodeType) }} />
            <div className="node-type-content">
              <p className="node-type-label">{getNodeTypeLabel(nodeType)}</p>
              <p className="node-type-desc">{getNodeTypeDescription(nodeType)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="tips">
          <h4>Tips</h4>
          <ul>
            <li>Click a node to edit it</li>
            <li>Drag to connect nodes</li>
            <li>Right-click to delete</li>
            <li>Test workflow to validate</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const getNodeTypeDescription = (type: NodeType): string => {
  const descriptions: Record<NodeType, string> = {
    start: 'Workflow entry point',
    task: 'Human task assignment',
    approval: 'Manager approval step',
    automatedStep: 'System-triggered action',
    end: 'Workflow completion',
  };
  return descriptions[type];
};
