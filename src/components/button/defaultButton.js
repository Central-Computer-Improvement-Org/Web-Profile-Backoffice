import React from 'react';

export default function DefaultButton({
  type,
  size,
  full = false,
  status,
  onClick = null,
  icon = null,
  title,
}) {
  return (
    <button
      type={type}
      className={`${full ? 'w-full ' : ''}${
        status == 'primary'
          ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 '
          : status == 'secondary'
          ? 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-300 '
          : status == 'danger'
          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300 '
          : ''
      } ${
        size == 'small'
          ? 'text-sm px-3 py-1.5 '
          : size == 'base'
          ? 'text-bae px-5 py-2.5 '
          : size == 'large'
          ? 'text-lg px-5 py-3 '
          : ''
      } text-white font-medium text-center ${
        full ? '' : 'inline-flex'
      } items-center focus:ring-4 focus:outline-none rounded-lg text-sm px-5 py-2.5 `}
      onClick={onClick}
    >
      {full ? (
        ''
      ) : (
        <div
          className={`${
            size == 'small'
              ? 'text-sm '
              : size == 'base'
              ? 'text-base '
              : size == 'large'
              ? 'text-lg '
              : ''
          } ${icon && title ? 'mr-2' : ''} `}
        >
          {icon}
        </div>
      )}
      {title}
    </button>
  );
}
