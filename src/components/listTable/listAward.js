/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import DefaultLink from '../link/defaultLink';
import { formatDescription } from '@/app/utils/stringUtils';
import { FaUserPlus } from 'react-icons/fa';

function HoverItem({ name, profileUrl }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-10 h-10 rounded-full border-gray-200">
        <img
          alt="profile"
          className="w-full h-full rounded-full object-cover"
          src={profileUrl}
        />
      </div>
      {isHovered && (
        <div className="absolute bottom-[15px] flex flex-col items-center mb-5 transition duration-300 ease-in-out opacity-100">
          <span
            className="relative rounded-md z-10 p-4 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg"
            style={{ whiteSpace: 'nowrap' }}
          >
            {name}
          </span>
          <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
        </div>
      )}
    </div>
  );
}

const ListAward = ({ issuer, description, contributor, id }) => {
  let awardIdFound = false; // Variabel lokal untuk melacak apakah ada awardId yang sesuai
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

      <td className="text-xs font-medium px-6 py-4">{issuer}</td>
      <td className="text-xs font-medium px-6 py-4">
        {formatDescription(description)}
      </td>
      <td className="text-xs font-medium px-6 py-4">
        {contributor
          ? contributor.map((data, index) => {
              if (data.awardId === id) {
                awardIdFound = true; // Jika ada awardId yang sesuai, set variabel lokal menjadi true
                return (
                  <div key={index} className="flex items-center gap-1 relative">
                    {data.contributor &&
                      data.contributor.map((contributor, index) => {
                        if (index < 3) {
                          return (
                            <HoverItem
                              key={index}
                              name={contributor.name}
                              profileUrl={contributor.profileUrl}
                            />
                          );
                        }
                      })}
                    {data.contributor && data.contributor.length > 3 ? (
                      <div
                        className={`w-10 h-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center`}
                      >
                        <FaUserPlus className="text-xl" />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                );
              }
              return null;
            })
          : '-'}
        {!awardIdFound && <h1>-</h1>}{' '}
      </td>

      <td className="text-xs font-medium px-6 py-4 flex gap-3">
        <DefaultLink
          href={`/award/detailAward?id=${id}`}
          size={'small'}
          status={'primary'}
          title={'Detail'}
        />
        <DefaultLink
          href={`/award/delete/${id}`}
          size={'small'}
          status={'secondary'}
          title={'Delete'}
        />
      </td>
    </tr>
  );
};

export default ListAward;
