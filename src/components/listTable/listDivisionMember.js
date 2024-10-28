/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import request from "@/app/utils/request";
import DefaultButton from '../button/defaultButton';
import LogoNotfound from '/public/assets/icon/notfound.svg';


const ListDivisionMember = ({
  photoUri,
  name,
  email,
  divisi,
  major,
  entryUniversity,
  entryCommunity,
  status,
  nim,
  fetchData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEdit = (nim) => {
    router.push(`/member/editMember?nim=${nim}`);
  };

  const onDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Deleting data...");

    request
      .delete(`/cms/users?nim=${nim}`, {
        divisionId: divisi.id,
      })
      .then(function (response) {
      const { code, status, data, error } = response.data;

      if (code === 200 || code === 201) {
        toast.dismiss();
        toast.success(data?.message);
        router.push('/member');
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
        router.push(`/member/detailMember?nim=${nim}`);
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
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full">
            <img
              src={
                photoUri
                  ? `${process.env.NEXT_PUBLIC_HOST}` + photoUri
                  : LogoNotfound.src
              }
              width={0}
              height={0}
              className="object-cover w-full h-full rounded-full"
              alt="Picture member CCI"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-semibold text-gray-700">{name}</h1>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>
      </th>
      <td className="px-6 py-4 text-xs font-medium">{divisi.name}</td>
      <td className="px-6 py-4 text-xs font-medium">{major}</td>
      <td className="px-6 py-4 text-xs font-medium">
        {/* {moment(entryUniversity).format(" D MMM YYYY")} */}
        {entryUniversity}
      </td>
      <td className="px-6 py-4 text-xs font-medium">
        {/* {moment(entryCommunity).format(" DD MMM YYYY")} */}
        {entryCommunity}
      </td>
      <td className="px-6 py-4 text-xs font-normal">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'
              }`}
          />
          <p>{status ? 'Active' : 'Inactive'}</p>
        </div>
      </td>
      <td className="z-50 flex gap-3 px-6 py-4 text-xs font-medium">
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation(); // Menghentikan penyebaran event ke elemen parent (tr)
            handleEdit(nim);
          }}
          size="small"
          status="primary"
          title="Edit"
        />
        <DefaultButton
          onClick={
            (e) => {
              e.stopPropagation();
              onDelete(e);
            }
          }
          type={"button"}
          size={"small"}
          status={"secondary"}
          title={"Delete"}
        />
      </td>
    </tr>
  );
};

export default ListDivisionMember;