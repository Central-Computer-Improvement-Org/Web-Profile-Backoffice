import React from 'react';
import Select from 'react-select';

export default function InputMultipleSelect({
  name,
  id,
  option,
  value,
  label,
  onChange,
  validations
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
      <div className="relative w-full ">
        <Select
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: '#F9FAFB',
            }),
          }}
          isMulti
          instanceId={id}
          name={name}
          value={value}
          options={option}
          className="basic-multi-select "
          classNamePrefix="select"
          onChange={onChange}
        />
        {/* Handle Validation */}
        {validations && (
          validations.map((validation, index) => (
            (validation.name === name || (validation.name === "media_uri" && type === "image")) && (
              <p key={index} className="text-sm text-red-500 mt-2">{validation.message}</p>
            )
          ))
        )}
      </div>
    </div>
  );
}
