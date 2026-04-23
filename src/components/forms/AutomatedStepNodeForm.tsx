import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { mockApi } from '../../api/mockApi';
import type { AutomationAction } from '../../api/mockApi';

export const AutomatedStepNodeForm: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedActionId = watch('actionId');
  const selectedAction = useMemo(
    () => actions.find(a => a.id === selectedActionId) ?? null,
    [actions, selectedActionId]
  );

  useEffect(() => {
    const loadActions = async () => {
      try {
        const data = await mockApi.getAutomations();
        setActions(data);
      } catch (error) {
        console.error('Error loading automations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActions();
  }, []);

  return (
    <div className="form-section">
      <h4>Automated Step Configuration</h4>

      <div className="form-group">
        <label>Step Title *</label>
        <input
          {...register('title', { required: 'Step title is required' })}
          type="text"
          placeholder="e.g., Send Welcome Email"
        />
        {errors.title && <span className="error">{String(errors.title.message ?? 'Title is required')}</span>}
      </div>

      <div className="form-group">
        <label>Select Action *</label>
        {loading ? (
          <div className="loading">Loading actions...</div>
        ) : (
          <select
            {...register('actionId', { required: 'Action must be selected' })}
          >
            <option value="">-- Select an action --</option>
            {actions.map(action => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
        {errors.actionId && <span className="error">{String(errors.actionId.message ?? 'Action is required')}</span>}
      </div>

      {selectedAction && (
        <fieldset className="form-section">
          <legend>Action Parameters</legend>
          <p className="help-text">{selectedAction.description}</p>

          {selectedAction.params.map(param => (
            <div key={param} className="form-group">
              <label>{param}</label>
              <input
                {...register(`actionParams.${param}`)}
                type="text"
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
        </fieldset>
      )}
    </div>
  );
};
