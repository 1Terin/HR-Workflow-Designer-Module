import React from 'react';
import { useFormContext } from 'react-hook-form';
export const ApprovalNodeForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-section">
      <h4>Approval Node Configuration</h4>

      <div className="form-group">
        <label>Approval Title *</label>
        <input
          {...register('title', { required: 'Approval title is required' })}
          type="text"
          placeholder="e.g., Manager Review"
        />
        {errors.title && <span className="error">{String(errors.title.message ?? 'Title is required')}</span>}
      </div>

      <div className="form-group">
        <label>Approver Role *</label>
        <select {...register('approverRole', { required: 'Approver role is required' })}>
          <option value="">Select a role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP (HR Business Partner)</option>
          <option value="Director">Director</option>
          <option value="Executive">Executive</option>
          <option value="Custom">Custom Role</option>
        </select>
        {errors.approverRole && <span className="error">{String(errors.approverRole.message ?? 'Approver role is required')}</span>}
      </div>

      <div className="form-group">
        <label>Auto-Approve Threshold (Score)</label>
        <input
          {...register('autoApproveThreshold', {
            valueAsNumber: true,
            min: 0,
          })}
          type="number"
          placeholder="Leave empty or 0 for no auto-approval"
          min="0"
        />
        <p className="help-text">If score exceeds this, automatically approve</p>
      </div>
    </div>
  );
};
