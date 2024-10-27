/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import request from '@/app/utils/request';
import { formatDescription } from '@/app/utils/stringUtils';
import { currency } from '@/app/utils/numberFormat';
import DefaultButton from '../button/defaultButton';
import LogoNotfound from '/public/assets/icon/notfound.svg';


const ListProject = ({ name, iconUri, description, productionUrl, budget, id, fetchData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Deleting data...');

    request.delete(`/cms/projects?id=${id}`).then(function (response) {
      const { code, status, data, error } = response.data;

      if (code === 200 || code === 201) {
        toast.dismiss();
        toast.success(data?.message);
        router.push('/project');
        fetchData();
      } else {
        const formattedStatus = status
          .split('_')
          .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        toast.dismiss();
        toast.error(`${formattedStatus}: ${error?.message || 'An error occurred'}`);
      }
      setLoading(false);
    });
  };

  return (
    <tr
      className="text-gray-700 bg-white border-b cursor-pointer hover:bg-gray-50"
      onClick={() => {
        router.push(`/project/detailProject?id=${id}`);
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
      <td className="px-6 py-4 text-xs font-medium">
        <div className="w-10 h-10 rounded-full">
          <img
            src={
              iconUri
                ? `${process.env.NEXT_PUBLIC_HOST}` + iconUri
                : LogoNotfound.src
            }
            width={0}
            height={0}
            className="object-cover w-full h-full rounded-full"
            alt="Project Icon"
          />
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          {name ? name : 'Not found'}
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-medium">
        {formatDescription(description)}
      </td>
      <td className="px-6 py-4 text-xs font-medium">{currency(budget)}</td>
      <td className="px-6 py-4 text-xs font-medium">
        <p
          onClick={(e) => {
            e.stopPropagation();
            router.push(productionUrl);
          }}
          className="text-blue-600 underline cursor-pointer"
        >
          {productionUrl ? productionUrl : 'Not found'}
        </p>
      </td>
      <td className="flex justify-end gap-3 px-6 py-4 text-xs font-medium">
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/project/editProject?id=${id}`);
          }}
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

export default ListProject;