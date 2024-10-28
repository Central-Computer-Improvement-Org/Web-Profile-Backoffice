/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {toast} from 'react-hot-toast';

import request from '@/app/utils/request';
import { formatDescription } from '@/app/utils/stringUtils';
import DefaultButton from '../button/defaultButton';


const ListAward = ({ issuer, title, description, id, fetchData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Deleting data...');

    request.delete(`/cms/awards?id=${id}`).then(function (response) {
      const { code, status, data, error } = response.data;
  
      if (code === 200 || code === 201) {
          toast.dismiss();
          toast.success(data?.message);
          router.push("/award");
          fetchData();
      } else {
          const formattedStatus = status
            .split('_')
            .map(res => res[0].toUpperCase() + res.slice(1).toLowerCase())
            .join(' ');
          setValidations(error?.validation);
          toast.dismiss();
          toast.error(`${formattedStatus}: ${error?.message || 'An error occurred'}`);
      };
      setLoading(false);
    });
  };
  
  return (
    <tr
      className="text-gray-700 bg-white border-b cursor-pointer hover:bg-gray-50"
      onClick={() => {
        router.push(`/award/detailAward?id=${id}`);
      }}
    >
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id="checkbox-table-search-2"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
          />
          <label htmlFor="checkbox-table-search-2" className="sr-only">
            checkbox
          </label>
        </div>
      </td>

      <td className="px-6 py-4 text-xs font-medium">{issuer ? issuer : 'Issuer not found'}</td>
      <td className="px-6 py-4 text-xs font-medium">{title ? title : 'Title not found'}</td>
      <td className="px-6 py-4 text-xs font-medium">
        {description ? formatDescription(description) : 'Description not found'}
      </td>
      <td className="flex justify-end gap-3 px-6 py-4 text-xs font-medium">
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/award/editAward?id=${id}`);
          }}
          href={`/award/detailAward?id=${id}`}
          size={'small'}
          status={'primary'}
          title={'Edit'}
        />
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          type={'button'}
          size={'small'}
          status={'secondary'}
          title={'Delete'}
        />
      </td>
    </tr>
  );
};

export default ListAward;