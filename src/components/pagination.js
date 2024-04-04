import Link from 'next/link';
import React from 'react';

export default function Pagination() {
  return (
    <div className="flex items-center mb-4 sm:mb-0 py-5">
      <Link
        href="#"
        className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 "
      >
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </Link>
      <Link
        href="#"
        className="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
      >
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </Link>
      <span className="text-sm font-normal text-gray-500 ">
        Showing <span className="font-semibold text-gray-900 ">1-20</span> of{' '}
        <span className="font-semibold text-gray-900 ">2290</span>
      </span>
    </div>
  );
}
