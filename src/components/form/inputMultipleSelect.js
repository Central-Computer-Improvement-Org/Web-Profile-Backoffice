import React from 'react';
import Select from 'react-select';

export default function InputMultipleSelect({
  name,
  id,
  option,
  value,
  label,
  onChange,
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
          id={id}
          name={name}
          value={value}
          options={option}
          className="basic-multi-select "
          classNamePrefix="select"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
