'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

const MenuSidebar = ({ href, icon, title }) => {
  const pathname = usePathname();
  return (
    <a
      href={href}
      className={`flex items-center p-2 text-gray-500 rounded-lg  hover:bg-gray-100  group ${
        pathname == href ? 'bg-gray-100' : ''
      }`}
    >
      <div
        className={`w-5 transition duration-75  group-hover:text-gray-900 flex items-center ${
          pathname == href ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        {icon}
      </div>
      <span className="ms-3">{title}</span>
    </a>
  );
};

export default MenuSidebar;
