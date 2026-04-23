import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface KeyValueFieldsProps {
  name: 'metadataEntries' | 'customFieldEntries';
  addLabel: string;
  emptyMessage: string;
}

export const KeyValueFields: React.FC<KeyValueFieldsProps> = ({ name, addLabel, emptyMessage }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div>
      {fields.length === 0 && <p className="help-text">{emptyMessage}</p>}

      {fields.map((field, index) => (
        <div key={field.id} className="key-value-row">
          <input
            {...register(`${name}.${index}.key`)}
            type="text"
            placeholder="Key"
          />
          <input
            {...register(`${name}.${index}.value`)}
            type="text"
            placeholder="Value"
          />
          <button type="button" className="btn-danger" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn-add"
        onClick={() => append({ key: '', value: '' })}
      >
        {addLabel}
      </button>
    </div>
  );
};
