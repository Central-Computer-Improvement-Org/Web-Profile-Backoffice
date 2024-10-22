import React from 'react';

export default function HeadTitle({ children, title }) {
  return (
    <div className="items-center justify-between block px-4 pb-4 bg-white sm:flex">
      <div className="w-full mb-1">
        <h1 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};