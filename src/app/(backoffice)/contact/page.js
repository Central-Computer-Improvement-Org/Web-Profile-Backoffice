'use client';
import request from '@/app/utils/request';
import InputField from '@/components/form/inputField';
import HeadTitle from '@/components/headTitle';
import DefaultLink from '@/components/link/defaultLink';
import ListContact from '@/components/listTable/listContact';
import Pagination from '@/components/pagination';
import DefaultTable from '@/components/table/defaultTable';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { useDebounce } from 'use-debounce';

// Sorting Constants
const ORDERING = 'updatedAt';
const SORT = 'desc';

// Pagination Constants
const LIMIT = 10;

export default function ContactPage() {
  const [datasContact, setDatasContact] = useState();
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get('page') ?? '1';

  const [searchQuery, setSearchQuery] = useState('');

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

  // const router = useRouter();

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
      <HeadTitle title={'Contact'}>
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
                index // Ubah 'awardDatas' menjadi 'data' untuk setiap iterasi
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
}
