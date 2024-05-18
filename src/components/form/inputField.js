// components/InputField.js

import React from "react";

import Link from "next/link";

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
            {/* Preview Image */}
            {previewImage && (
              <Link 
                href={"https://103-31-38-146.sslip.io" + previewImage} 
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
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        />
        {/* Handle Validation */}
        {validations && (
          validations.map((validation, index) => (
            (validation.name === name || (validation.name === "media_uri" && type === "image")) && (
              <p key={index} className="text-sm text-red-500 mt-2">{validation.message}</p>
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
