import React from 'react';

export default function HeadTitle({ children, title }) {
  return (
    <div className="px-4 pb-4 bg-white block sm:flex items-center justify-between  ">
      <div className="w-full mb-1">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl mb-4">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
