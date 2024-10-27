'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { IoIosSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';

import request from '@/app/utils/request';
import DefaultTable from '@/components/table/defaultTable';
import ListAward from '@/components/listTable/listAward';
import DefaultLink from '@/components/link/defaultLink';
import InputField from '@/components/form/inputField';
import Pagination from '@/components/pagination';
import HeadTitle from '@/components/headTitle';

// Sorting Constants
const ORDERING = 'updatedAt';
const SORT = 'desc';

// Pagination Constants
const LIMIT = 10;


export default function AwardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get('page') ?? '1';

  const [searchQuery, setSearchQuery] = useState('');
  const [awardDatas, setAwardDatas] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [debounceValue] = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(true);

  const rowMenu = [
    { menu: 'ISSUER' },
    { menu: 'TITLE' },
    { menu: 'DESCRIPTION' },
    { menu: '' },
  ];

  const fetchAwards = useCallback(async () => {
    const payload = {
      search: debounceValue,
      page: page,
      limit: LIMIT,
      ordering: ORDERING,
      sort: SORT,
    };
    request.get(`/cms/awards`, payload)
    .then(function (response) {
      setAwardDatas(response.data.data);
      setRecordsTotal(response.data.recordsTotal);
      setLoading(false);
    })
    .catch(function (error) {
      console.error(error);
      setLoading(false);
    });
  }, [debounceValue, page]);

  useEffect(() => {
    if (page < 1) {
      router.push('/award?page=1');
    } else {
      fetchAwards();
    }
  }, [page, fetchAwards, router]);

  useEffect(() => {
    if (debounceValue !== '') {
      router.push('/award?page=1');
    } else {
      fetchAwards();
    }
  }, [debounceValue, fetchAwards, router]);

  return (
    <div>
      <HeadTitle>
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
                  type={'text'}
                  placeholder={'Search for Award'}
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
              title={'Add Award'}
              href={'/award/addAward'}
              icon={<FaPlus />}
            />
          </div>
        </div>
      </HeadTitle>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="">
          <DefaultTable rowMenu={rowMenu}>
            {awardDatas.map(
              (
                data,
                index
              ) => (
                <ListAward
                  key={index}
                  issuer={data.issuer}
                  title={data.title}
                  description={data.description}
                  id={data.id}
                  fetchData={fetchAwards}
                />
              )
            )}
          </DefaultTable>
          <Pagination recordsTotal={recordsTotal} page={page} link="award" />
        </div>
      )}
    </div>
  );
};