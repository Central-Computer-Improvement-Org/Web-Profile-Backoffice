import React from 'react';
import Image from 'next/image';
import Women from '../../../public/assets/avatar/women.webp';
import DefaultLink from '../link/defaultLink';
import { FaPhoneVolume, FaLinkedin } from 'react-icons/fa';
import DefaultButton from '../button/defaultButton';

const ListMember = () => {
  return (
    <tr className="bg-white border-b   hover:bg-gray-50 text-gray-700 ">
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
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 rounded-full">
            <Image
              src={Women}
              width={0}
              height={0}
              className="w-full h-full object-cover rounded-full"
              alt="profile"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-semibold text-gray-700">
              Nayla Amira Putri
            </h1>
            <p className="text-sm text-gray-500">nayla.amira@gmail.com</p>
          </div>
        </div>
      </th>
      <td className="text-xs font-medium px-6 py-4">WEB Development</td>
      <td className="text-xs font-medium px-6 py-4">S1 Informatika</td>
      <td className="text-xs font-medium px-6 py-4">2023</td>
      <td className="text-xs font-medium px-6 py-4">2023</td>
      <td className="text-xs font-normal px-6 py-4">
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <p>Active</p>
        </div>
      </td>
      {/* <td className="text-xs font-medium px-6 py-4 ">
        <DefaultButton
          href={'/member/edit'}
          size={'small'}
          status={'primary'}
          icon={<FaPhoneVolume />}
        />
        <DefaultButton
          href={'/member/delete'}
          size={'small'}
          status={'secondary'}
          icon={<FaLinkedin />}
        />
      </td> */}
      <td className="text-xs font-medium px-6 py-4 flex gap-3">
        <DefaultLink
          href={'/member/edit'}
          size={'small'}
          status={'primary'}
          title={'Edit'}
        />
        <DefaultLink
          href={'/member/delete'}
          size={'small'}
          status={'secondary'}
          title={'Delete'}
        />
      </td>
    </tr>
  );
};

export default ListMember;
