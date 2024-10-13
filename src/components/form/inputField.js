import React from "react";
import Link from "next/link";
// components/InputField.js

const InputField = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  previewImage,
  multiple = false,
  required = false,
  icon = null,
  label = null,
  disabled = false,
  readOnly = false,
  validations,
}) => {
  return (
    <div className="w-full ">
      {label && (  
          <div className="flex justify-between">
            <label
              htmlFor={id}
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              {label}
            </label>
            {previewImage && (
              <Link 
                href={`${process.env.NEXT_PUBLIC_HOST}` + previewImage} 
                target="_blank"
                className="block mb-2 mr-4 text-sm font-medium text-gray-900">
                Preview Image
              </Link>
            )}
          </div>
      )}

      <div className="relative w-full ">
        <input
          id={id}
          name={name}
          accept={type == "image" ? "image/*" : "*"}
          type={type === "image" ? "file" : type}
          value={value} 
          onChange={onChange}
          placeholder={placeholder}
          multiple={multiple}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        />
        {validations && (
          validations.map((validation, index) => (
            (validation.name === name || (validation.name === "media_uri" && type === "image")) && (
              <p key={index} className="mt-2 text-sm text-red-500">{validation.message}</p>
            )
          ))
        )}
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
