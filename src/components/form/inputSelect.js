import React from 'react';

export default function InputSelect({
  children,
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div className="w-full ">
      {label ? (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      ) : (
        ''
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
      >
        {children}
      </select>
    </div>
  );
}
