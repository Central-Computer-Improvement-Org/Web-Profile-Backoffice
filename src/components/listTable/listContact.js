/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import request from '@/app/utils/request';
import DefaultButton from '../button/defaultButton';
import DefaultLink from '../link/defaultLink';
import LogoNotfound from '/public/assets/icon/notfound.svg';


const ListContact = ({
  iconUri,
  platform,
  name,
  status,
  accountUri,
  id,
  fetchData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const onDelete = async (e) => {
    e.preventDefault();
    toast.loading('Deleting data...');

    request.delete(`/cms/contact?id=${id}`).then(function (response) {
      const { code, status, data, error } = response.data;

      if (code === 200 || code === 201) {
        toast.dismiss();
        toast.success(data?.message);
        router.push('/contact');
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
    <tr className="text-gray-700 bg-white border-b cursor-pointer hover:bg-gray-50">
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
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <div className="w-10 h-10 ">
        <img
            src={
              iconUri
                ? `${process.env.NEXT_PUBLIC_HOST}` + iconUri
                : LogoNotfound.src
            }
            width={100}
            height={100}
            className="object-cover w-full h-full rounded-full"
            alt="Logo Platform"
          />
        </div>
      </th>
      <td className="px-6 py-4 text-xs font-medium">{platform ? platform : 'Platform not found'}</td>
      <td className="px-6 py-4 text-xs font-medium">{name ? name : 'Name not found'}</td>
      <td className="px-6 py-4 text-xs font-medium">
        {status ? 'Active' : 'InActive'}
      </td>
      <td className="flex justify-end gap-3 px-6 py-4 text-xs font-medium">
        <DefaultLink
          href={accountUri}
          size={'small'}
          status={'secondary'}
          title={'Visit Platform'}
          target={'_blank'}
        />
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/contact/editContact?id=${id}`);
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

export default ListContact;