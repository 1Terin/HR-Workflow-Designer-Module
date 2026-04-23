import React from 'react';
import { useFormContext } from 'react-hook-form';

export const EndNodeForm: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="form-section">
      <h4>End Node Configuration</h4>

      <div className="form-group">
        <label>End Message</label>
        <textarea
          {...register('endMessage')}
          placeholder="Message shown when workflow completes"
          rows={3}
        />
      </div>

      <div className="form-group checkbox">
        <input
          {...register('summaryFlag')}
          type="checkbox"
          id="summaryFlag"
        />
        <label htmlFor="summaryFlag">Generate Summary Report</label>
      </div>
    </div>
  );
};
