import React, { useState } from 'react';
import { useWorkflowStore } from './store/workflowStore';
import { Canvas } from './components/canvas/Canvas';
import { Sidebar } from './components/sidebar/Sidebar';
import { NodeEditPanel } from './components/panels/NodeEditPanel';
import { SimulationPanel } from './components/panels/SimulationPanel';
import './App.css';

function App() {
  const { currentWorkflow, workflows, createWorkflow, loadWorkflow } = useWorkflowStore();
  const [showWorkflowList, setShowWorkflowList] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      createWorkflow(newWorkflowName);
      setNewWorkflowName('');
      setShowWorkflowList(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateWorkflow();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>HR Workflow Designer</h1>
          <div className="breadcrumb">
            {currentWorkflow ? (
              <>
                <span className="breadcrumb-item">
                  <button
                    onClick={() => setShowWorkflowList(!showWorkflowList)}
                    className="breadcrumb-btn"
                  >
                    {currentWorkflow.name}
                  </button>
                </span>
              </>
            ) : (
              <span className="breadcrumb-item">No workflow</span>
            )}
          </div>
        </div>

        {showWorkflowList && (
          <div className="workflow-menu">
            <div className="workflow-list">
              {workflows.length === 0 ? (
                <p className="empty-list">No workflows yet</p>
              ) : (
                workflows.map(workflow => (
                  <button
                    key={workflow.id}
                    onClick={() => {
                      loadWorkflow(workflow.id);
                      setShowWorkflowList(false);
                    }}
                    className={`workflow-item ${currentWorkflow?.id === workflow.id ? 'active' : ''}`}
                  >
                    {workflow.name}
                  </button>
                ))
              )}
            </div>

            <div className="new-workflow">
              <input
                type="text"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="New workflow name..."
              />
              <button onClick={handleCreateWorkflow} className="btn-create">
                Create
              </button>
            </div>
          </div>
        )}

        {!showWorkflowList && (
          <button
            onClick={() => setShowWorkflowList(true)}
            className="btn-workflows"
            title={`${workflows.length} workflow${workflows.length !== 1 ? 's' : ''}`}
          >
            {workflows.length > 0 ? `${workflows.length} Workflow${workflows.length !== 1 ? 's' : ''}` : 'New Workflow'}
          </button>
        )}
      </header>

      <div className="main-layout">
        <Sidebar />

        <div className="editor-area">
          <Canvas />
          <SimulationPanel />
        </div>

        <NodeEditPanel />
      </div>
    </div>
  );
}

export default App;
