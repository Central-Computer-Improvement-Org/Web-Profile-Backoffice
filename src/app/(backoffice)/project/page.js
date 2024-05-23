'use client';

import React, { useEffect, useState, useCallback } from 'react';
import InputField from '@/components/form/inputField';

import { IoIosSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';

import DefaultLink from '@/components/link/defaultLink';
import HeadTitle from '@/components/headTitle';
import DefaultTable from '@/components/table/defaultTable';
import request from '@/app/utils/request';
import Pagination from '@/components/pagination';
import ListProject from '@/components/listTable/listProject';

import { useDebounce } from 'use-debounce';
import { useSearchParams, useRouter } from 'next/navigation';

// Sorting Constants
const ORDERING = 'updatedAt';
const SORT = 'desc';

// Pagination Constants
const LIMIT = 10;

export default function ProjectPage() {
   const searchParams = useSearchParams();
   const router = useRouter();

   const page = searchParams.get('page') ?? '1';

   const [searchQuery, setSearchQuery] = useState('');
   const [projectDatas, setProjectDatas] = useState([]);

   const [recordsTotal, setRecordsTotal] = useState(0);

   const [debounceValue] = useDebounce(searchQuery, 500);

   const [loading, setLoading] = useState(true);
   
   const rowMenu = [
      { menu: 'ICON' },
      { menu: 'TITLE' },
      { menu: 'DESCRIPTION' },
      { menu: 'BUDGET' },
      { menu: 'PRODUCTION URL' },
      { menu: '' },
   ];

   const fetchProjects = useCallback(async () => {
      const payload = {
         search: debounceValue,
         page: page,
         limit: LIMIT,
         ordering: ORDERING,
         sort: SORT,
       };
       request
         .get(`/cms/projects`, payload)
         .then(function (response) {
           setProjectDatas(response.data.data);
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
      router.push('/project?page=1');
    } else {
      fetchProjects();
    }
  }, [page, fetchProjects, router]);

  useEffect(() => {
    if (debounceValue !== '') {
      router.push('/project?page=1');
    } else {
      fetchProjects();
    }
  }, [debounceValue, fetchProjects, router]);
   return (
      <div>
         <HeadTitle title={'All Projects'}>
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
                           placeholder={'Search for project'}
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
                     title={'Add Project'}
                     href={'/project/addProject'}
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
                  {projectDatas.map((data, index) => (
                     <ListProject
                        key={index}
                        iconUri={data.iconUri}
                        name={data.name}
                        description={data.description}
                        productionUrl={data.productionUri}
                        budget={data.budget}
                        id={data.id}
                        fetchData={fetchProjects}
                     />
                  ))}
               </DefaultTable>
               <Pagination recordsTotal={recordsTotal} page={page} link="project" />
            </div>
         )}
      </div>
   );
}
