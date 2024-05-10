// components/TextareaField.js

import React from "react";

const TextareaField = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  icon = null,
  label = null,
  validations
}) => {
  return (
    <div className="w-full ">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="relative w-full ">
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{ height: "150px" }}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 resize-none"
        />
        {validations && (
          validations.map((validation, index) => (
            validation.name === name && (
              <p key={index} className="text-sm text-red-500 mt-2">{validation.message}</p>
            )
          ))
        )}
        {icon && (
          <div className="absolute top-0 right-0 h-full p-2.5 text-sm font-medium text-black flex justify-center items-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextareaField;
