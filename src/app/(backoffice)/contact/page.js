'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { FaPlus } from 'react-icons/fa6';

import request from '@/app/utils/request';
import DefaultTable from '@/components/table/defaultTable';
import ListContact from '@/components/listTable/listContact';
import DefaultLink from '@/components/link/defaultLink';
import Pagination from '@/components/pagination';
import HeadTitle from '@/components/headTitle';

// Sorting Constants
const ORDERING = 'updatedAt';
const SORT = 'desc';

// Pagination Constants
const LIMIT = 10;

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const [searchQuery, setSearchQuery] = useState('');
  const [datasContact, setDatasContact] = useState();
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [debounceValue] = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(true);

  const rowMenu = [
    { menu: 'ICON PLATFORM' },
    { menu: 'PLATFORM' },
    { menu: 'NAME' },
    { menu: 'STATUS' },
    { menu: '' },
  ];

  const fetchDataContact = useCallback(async () => {
    const payload = {
      name: debounceValue,
      page: page,
      limit: LIMIT,
      ordering: ORDERING,
      sort: SORT,
    };

    request
      .get(`/cms/contact`, payload)
      .then(function (response) {
        setDatasContact(response.data.data);
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
      router.push('/division?page=1');
    } else {
      fetchDataContact();
    }
  }, [debounceValue, page, fetchDataContact, router]);
  return (
    <>
      <HeadTitle>
        <div className="flex lg:mt-4">
          <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
            <form className="lg:pr-3" action="#" method="GET">
              <label htmlFor="users-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1 lg:w-64 xl:w-96"></div>
            </form>
          </div>
          <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
            <DefaultLink
              size={'small'}
              status={'primary'}
              title={'Add Contact'}
              href={'/contact/addContact'}
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
            {datasContact.map(
              (
                data,
                index
              ) => (
                <ListContact
                  key={index}
                  iconUri={data.iconUri}
                  platform={data.platform}
                  name={data.value}
                  status={data.isActive}
                  accountUri={data.accountUri}
                  id={data.id}
                  fetchData={fetchDataContact}
                />
              )
            )}
          </DefaultTable>
          <Pagination recordsTotal={recordsTotal} page={page} link="contact" />
        </div>
      )}
    </>
  );
};