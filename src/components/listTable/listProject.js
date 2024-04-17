/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import DefaultLink from '../link/defaultLink';
import { formatDescription } from '@/app/utils/stringUtils';
import DefaultButton from '../button/defaultButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { currency } from '@/app/utils/numberFormat';

const ListProject = ({ name, description, productionUrl, budget, id }) => {
  const router = useRouter();
  return (
    <tr
      className="bg-white border-b   hover:bg-gray-50 text-gray-700 cursor-pointer"
      onClick={() => {
        router.push(`/project/detailProject?id=${id}`);
      }}
    >
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id="checkbox-table-search-2"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500    focus:ring-2  "
          />
          <label htmlFor="checkbox-table-search-2" className="sr-only">
            checkbox
          </label>
        </div>
      </td>

      <td className="text-xs font-medium px-6 py-4">{name}</td>
      <td className="text-xs font-medium px-6 py-4">
        {formatDescription(description)}
      </td>
      <td className="text-xs font-medium px-6 py-4">{currency(budget)}</td>
      <td className="text-xs font-medium px-6 py-4">
        <p
          onClick={(e) => {
            e.stopPropagation();
            router.push(productionUrl);
          }}
          className="text-blue-600 underline cursor-pointer"
        >
          {productionUrl}
        </p>
      </td>
      <td className="text-xs font-medium px-6 py-4 flex gap-3">
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/project/editProject?id=${id}`);
          }}
          size={'small'}
          status={'primary'}
          title={'Edit'}
        />
        <DefaultLink
          href={`/project/delete/${id}`}
          size={'small'}
          status={'secondary'}
          title={'Delete'}
        />
      </td>
    </tr>
  );
};

export default ListProject;
