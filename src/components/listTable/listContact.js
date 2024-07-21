/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import DefaultLink from '../link/defaultLink';
import { formatDescription } from '@/app/utils/stringUtils';
import DefaultButton from '../button/defaultButton';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import request from '@/app/utils/request';

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

  const onDelete = async (e) => {
    // setLoading(true);
    toast.loading('Deleting data...');
    e.preventDefault();

    request.delete(`/cms/contact?id=${id}`).then(function (response) {
      if (response.data?.code === 200 || response.data?.code === 201) {
        toast.dismiss();
        toast.success(response.data.data.message);
        fetchData();
      } else if (
        response.response.data.code === 404 &&
        response.response.data.status == 'NOT_FOUND'
      ) {
        toast.dismiss();
        toast.error('Division not found.');
      } else if (response.response.data.code === 500) {
        toast.dismiss();
        toast.error(response.response.data.error.message);
      }
      // setLoading(false);
    });
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50 text-gray-700 cursor-pointer">
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
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <div className="w-10 h-10 ">
          <img
            src={'https://kevinid.pythonanywhere.com' + iconUri}
            width={0}
            height={0}
            className="w-full h-full object-fill "
            alt="profile"
          />
        </div>
      </th>
      <td className="text-xs font-medium px-6 py-4">{platform}</td>
      <td className="text-xs font-medium px-6 py-4">{name}</td>
      <td className="text-xs font-medium px-6 py-4">
        {status ? 'Active' : 'InActive'}
      </td>
      <td className="text-xs font-medium px-6 py-4 flex gap-3">
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
