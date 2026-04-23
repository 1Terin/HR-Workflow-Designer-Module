import React from 'react';
import { useFormContext } from 'react-hook-form';
import { KeyValueFields } from './KeyValueFields';

export const StartNodeForm: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="form-section">
      <h4>Start Node Configuration</h4>

      <div className="form-group">
        <label>Start Title *</label>
        <input
          {...register('startTitle', { required: 'Start title is required' })}
          type="text"
          placeholder="e.g., Employee Onboarding Start"
        />
      </div>

      <fieldset className="form-section">
        <legend>Metadata (Optional)</legend>
        <p className="help-text">Add optional key-value metadata</p>

        <div className="metadata-editor">
          <KeyValueFields
            name="metadataEntries"
            addLabel="+ Add Metadata"
            emptyMessage="No metadata added yet."
          />
        </div>
      </fieldset>
    </div>
  );
};
