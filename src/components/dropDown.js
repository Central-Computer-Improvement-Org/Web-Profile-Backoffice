// components/Dropdown.js

'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({ options, onSelect, href, icon, title }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative ">
      {/* <button
        className={`flex items-center p-2 text-gray-500 rounded-lg  hover:bg-gray-100  group w-full
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || 'Select an option'}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 12a1 1 0 0 1-.707-.293l-3-3a1 1 0 0 1 1.414-1.414L10 10.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-.707.293z"
          />
        </svg>
      </button> */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-2 text-gray-500 rounded-lg  hover:bg-gray-100  group w-full ${
          isActive ? 'bg-gray-100' : ''
        }`}
      >
        <div className="flex items-center">
          <div
            className={`w-5 transition duration-75  group-hover:text-gray-900 flex items-center ${
              isActive ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            {icon}
          </div>
          <span className="ms-3">{title}</span>
        </div>
        <FaChevronDown />
      </button>
      {isOpen && (
        <ul className=" ">
          {options.map((option, index) => (
            <li key={index}>
              <a
                href={option.href}
                className={`flex items-center p-2 text-base ${
                  isActive ? 'text-gray-900' : 'text-gray-500'
                } transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 `}
              >
                {option.menu}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
