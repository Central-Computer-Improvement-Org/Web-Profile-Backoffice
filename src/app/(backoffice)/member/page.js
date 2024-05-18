/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ListMember from '@/components/listTable/listMember';
import InputField from '@/components/form/inputField';

import { IoIosSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';

import DefaultLink from '@/components/link/defaultLink';
import HeadTitle from '@/components/headTitle';
import DefaultTable from '@/components/table/defaultTable';
import request from '@/app/utils/request';
import Pagination from '@/components/pagination';

import { useDebounce } from 'use-debounce';
import { useSearchParams, useRouter } from 'next/navigation';

// Sorting Constants
const ORDERING = 'updatedAt';
const SORT = 'desc';

// Pagination Constants
const LIMIT = 10;

export default function Page() {
  // Gunakan huruf besar untuk nama fungsi komponen
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = (searchParams.get("page")) ?? "1";

  const [memberDatas, setMemberDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [recordsTotal, setRecordsTotal] = useState(0);

  const [debounceValue] = useDebounce(searchQuery, 500);

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

  const fetchMembers = useCallback(async () => {
    const payload = {
      search : debounceValue,
      page : page,
      limit : LIMIT,
      ordering : ORDERING,
      sort : SORT,
    }
    request
      .get(`/cms/users`, payload)
      .then(function (response) {
        setMemberDatas(response.data.data);
        setRecordsTotal(response.data.recordsTotal);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
    });
  }, [debounceValue, page]);

  useEffect(() => {
    if (page < 1) {
      router.push('/member?page=1');
    } else {
      fetchMembers();
    }
  }, [page, fetchMembers, router]);

  useEffect(() => {
    if (debounceValue !== '') {
      router.push('/member?page=1');
    } else {
      fetchMembers();
    }
  }, [debounceValue, fetchMembers, router]);
  
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
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
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
            {memberDatas.map(
              (
                data,
                index // Ubah 'datas' menjadi 'data' untuk setiap iterasi
              ) => (
                <ListMember
                  key={index}
                  photoUri={data.profileUri}
                  name={data.name}
                  email={data.email}
                  divisi={data.division}
                  major={data.major}
                  entryUniversity={data.yearUniversityEnrolled}
                  entryCommunity={data.yearCommunityEnrolled}
                  status={data.isActive}
                  nim={data.nim}
                  fetchData={fetchMembers}
                />
              )
            )}
          </DefaultTable>
          <Pagination recordsTotal={recordsTotal} page={page} link="member" />
        </div>
      )}
    </div>
  );
}
