// src/components/FormInput.tsx
import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder
}) => {
  return (
    <div className="mb-4 flex flex-col">
      <label className="font-bold mb-1 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`p-2.5 rounded border text-base focus:outline-none focus:ring-2 ${
          error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        }`}
      />
      {error && (
        <span className="text-red-500 text-sm mt-1 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;