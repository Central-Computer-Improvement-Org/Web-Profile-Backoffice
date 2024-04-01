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
      className={`
      ${full ? 'w-full ' : 'w-auto'}
      ${
        size == 'small'
          ? 'text-sm  '
          : size == 'base'
          ? 'text-bae '
          : size == 'large'
          ? 'text-lg '
          : ''
      }
      ${
        status == 'primary'
          ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 '
          : status == 'secondary'
          ? 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-300 '
          : status == 'danger'
          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300 '
          : ''
      }
      ${icon && title ? 'inline-flex ' : ''}
         items-center justify-center px-3 py-2 font-medium text-center text-white rounded-lg focus:ring-4 `}
      onClick={onClick}
    >
      <div className="text-xl mr-2 -ml-1">{icon}</div>
      {title}
    </button>
  );
}
