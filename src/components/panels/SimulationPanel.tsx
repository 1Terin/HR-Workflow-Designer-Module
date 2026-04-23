import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import './SimulationPanel.css';

export const SimulationPanel: React.FC = () => {
  const { currentWorkflow, simulationResult, isSimulating, validateWorkflow, simulateWorkflow, validationErrors } =
    useWorkflowStore();
  const [showResults, setShowResults] = useState(false);

  const handleRunSimulation = async () => {
    const errors = validateWorkflow();
    if (errors.length === 0) {
      setShowResults(true);
      await simulateWorkflow();
    } else {
      setShowResults(false);
    }
  };

  if (!currentWorkflow) {
    return (
      <div className="simulation-panel">
        <div className="empty">No workflow loaded</div>
      </div>
    );
  }

  return (
    <div className="simulation-panel">
      <div className="panel-header">
        <h3>Test & Validate</h3>
      </div>

      <div className="controls">
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="btn-primary"
        >
          {isSimulating ? 'Running...' : 'Test Workflow'}
        </button>

        <button
          onClick={() => validateWorkflow()}
          className="btn-secondary"
        >
          Validate
        </button>
      </div>

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h4>Validation Errors</h4>
          {validationErrors.map((error, idx) => (
            <div key={idx} className="error-item">
              <div className="error-type">{error.type}</div>
              <div className="error-msg">{error.message}</div>
              {error.nodeId && <div className="error-node">Node: {error.nodeId}</div>}
            </div>
          ))}
        </div>
      )}

      {showResults && simulationResult && (
        <div className="simulation-results">
          <div className="result-header">
            <h4>Execution Results</h4>
            <div className={`result-status ${simulationResult.success ? 'success' : 'failed'}`}>
              {simulationResult.success ? '✓ Success' : '✗ Failed'}
            </div>
          </div>

          <div className="result-info">
            <p><strong>Total Steps:</strong> {simulationResult.totalSteps}</p>
            <p><strong>Completed:</strong> {simulationResult.completedAt}</p>
          </div>

          {simulationResult.errors && simulationResult.errors.length > 0 && (
            <div className="result-errors">
              <h5>Errors</h5>
              {simulationResult.errors.map((err, idx) => (
                <p key={idx} className="error-text">{err}</p>
              ))}
            </div>
          )}

          <div className="execution-timeline">
            <h4>Execution Timeline</h4>
            {simulationResult.steps.length === 0 ? (
              <p className="no-steps">No steps executed</p>
            ) : (
              <div className="steps-list">
                {simulationResult.steps.map((step) => (
                  <div key={step.stepNumber} className="step-item">
                    <div className="step-number">Step {step.stepNumber}</div>
                    <div className="step-content">
                      <div className="step-label">{step.nodeLabel}</div>
                      <div className="step-type">{step.nodeId}</div>
                      <div className="step-time">{new Date(step.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div className={`step-status ${step.status}`}>{step.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
