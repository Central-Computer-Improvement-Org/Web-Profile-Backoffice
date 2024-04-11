/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useEffect, useState } from 'react';
import ListMember from '@/components/listTable/listMember';
import axios from 'axios';
import InputField from '@/components/form/inputField';

import { IoIosSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';

import DefaultLink from '@/components/link/defaultLink';
import DefaultButton from '@/components/button/defaultButton';
import HeadTitle from '@/components/headTitle';
import DefaultTable from '@/components/table/defaultTable';
import request from '@/app/utils/request';
import Pagination from '@/components/pagination';

export default function Page() {
  // Gunakan huruf besar untuk nama fungsi komponen
  const [search, setSearch] = useState('');
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowMenu = [
    // Perbaiki penulisan rowMenu
    { menu: 'NAME' },
    { menu: 'DIVISION' },
    { menu: 'MAJOR' },
    { menu: 'ENTRY UNIVERSITY' },
    { menu: 'ENTRY COMMUNITY' },
    { menu: 'STATUS' },
    { menu: '' },
  ];

  useEffect(() => {
    request
      .get('/member')
      .then(function (response) {
        setDatas(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <HeadTitle title={'All Members'}>
        <div className="flex lg:mt-4">
          <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
            <form className="lg:pr-3" action="#" method="GET">
              <label htmlFor="users-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1 lg:w-64 xl:w-96">
                <InputField
                  id={'search'}
                  name={'search'}
                  placeholder={'Search for member'}
                  type={'text'}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  icon={<IoIosSearch />}
                />
              </div>
            </form>
          </div>
          <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
            <DefaultLink
              size={'small'}
              status={'primary'}
              title={'Add member'}
              href={'/member/addMember'}
              icon={<FaPlus />}
              onClick={() => {}}
            />
          </div>
        </div>
      </HeadTitle>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="">
          <DefaultTable rowMenu={rowMenu}>
            {datas.map(
              (
                data,
                index // Ubah 'datas' menjadi 'data' untuk setiap iterasi
              ) => (
                <ListMember
                  key={index}
                  photoUrl={data.profileUrl}
                  name={data.name}
                  email={data.email}
                  devisi={data.division.name}
                  major={data.major}
                  entryUniversity={data.yearUniversityEnrolled}
                  entryCommunity={data.yearCommunityEnrolled}
                  status={data.isActive}
                  nim={data.nim}
                />
              )
            )}
          </DefaultTable>
          <Pagination />
        </div>
      )}
    </div>
  );
}
