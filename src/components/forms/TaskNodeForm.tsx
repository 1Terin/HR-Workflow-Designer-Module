import React from 'react';
import { useFormContext } from 'react-hook-form';
import { KeyValueFields } from './KeyValueFields';

export const TaskNodeForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-section">
      <h4>Task Node Configuration</h4>

      <div className="form-group">
        <label>Task Title *</label>
        <input
          {...register('title', { required: 'Task title is required' })}
          type="text"
          placeholder="e.g., Collect Documents"
        />
        {errors.title && <span className="error">{String(errors.title.message ?? 'Title is required')}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          {...register('description')}
          placeholder="Provide task details and instructions"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Assignee</label>
        <input
          {...register('assignee')}
          type="text"
          placeholder="e.g., john@example.com or HR Team"
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          {...register('dueDate')}
          type="date"
        />
      </div>

      <fieldset className="form-section">
        <legend>Custom Fields (Optional)</legend>
        <p className="help-text">Add additional fields specific to this task</p>
        <KeyValueFields
          name="customFieldEntries"
          addLabel="+ Add Custom Field"
          emptyMessage="No custom fields added yet."
        />
      </fieldset>
    </div>
  );
};
