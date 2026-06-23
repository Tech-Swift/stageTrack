// src/components/FormSelect.tsx
import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  defaultLabel?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  defaultLabel = "-- Select Options --"
}) => {
  // Create a unique ID for pairing the label and select element
  const selectId = `select-${name}`;

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={selectId} className="font-bold mb-1 text-gray-700">
        {label}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        className={`p-2.5 rounded border text-base bg-white focus:outline-none focus:ring-2 ${
          error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
      >
        <option value="">{defaultLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-500 text-sm mt-1 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormSelect;