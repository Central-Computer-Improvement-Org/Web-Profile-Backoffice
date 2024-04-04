// components/InputField.js

import React from 'react';

const InputField = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  icon = null,
  label = null,
  disabled,
}) => {
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
      <div className="relative w-full ">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        />
        {icon && (
          <div className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-black flex justify-center items-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
