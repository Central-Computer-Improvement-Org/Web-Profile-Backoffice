'use client';
import InputField from '@/components/form/inputField';
import HeadTitle from '@/components/headTitle';
import DefaultLink from '@/components/link/defaultLink';

import { IoIosSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';

import React, { useEffect, useState } from 'react';
import DefaultTable from '@/components/table/defaultTable';
import axios from 'axios';
import { host } from '@/app/utils/urlApi';

export default function DivisionPage() {
  const [search, setSearch] = useState('');
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowMenu = [
    // Perbaiki penulisan rowMenu
    { menu: 'ID' },
    { menu: 'LOGO' },
    { menu: 'DESCRIPTION' },
    { menu: '' },
  ];

  useEffect(() => {
    axios
      .get(`${host}/api/division`)
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
      <HeadTitle title={'All Division'}>
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
                  placeholder={'Search for division'}
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
              title={'Add division'}
              href={'/division/addDivision'}
              icon={<FaPlus />}
              onClick={() => {}}
            />
          </div>
        </div>
      </HeadTitle>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <DefaultTable rowMenu={rowMenu}></DefaultTable>
        </div>
      )}
    </div>
  );
}
