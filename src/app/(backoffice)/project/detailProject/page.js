/* eslint-disable @next/next/no-img-element */
'use client';
import request from '@/app/utils/request';
import DefaultButton from '@/components/button/defaultButton';
import InputField from '@/components/form/inputField';
import DefaultLink from '@/components/link/defaultLink';
import Pagination from '@/components/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { GoX } from 'react-icons/go';
import Link from 'next/link';
import { IoLinkSharp } from 'react-icons/io5';
import { currency } from '@/app/utils/numberFormat';

function DetailProjectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [modalContributor, setModalContributor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contributorsProject, setContributorsProject] = useState();
  const [search, setSearch] = useState();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState();
  const [description, setDescription] = useState('');
  const [productionUrl, setProductionUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');

  useEffect(() => {
    if (!id) {
      router.push('/project');
      return;
    }
    setLoading(true);
    request
      .get('contributorProjectById')
      .then(function (response) {
        setName(response.data.data.name);
        setDescription(response.data.data.description);
        setProductionUrl(response.data.data.productionUrl);
        setRepositoryUrl(response.data.data.repositoryUrl);
        setBudget(response.data.data.budget);
        setContributorsProject(response.data.data.contributors);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id, router]);

  return (
    <div>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
          <div className="col-span-full xl:col-auto">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className="flow-root ">
                <div className=" flex flex-col gap-4 mb-4">
                  <h3 className="text-xl font-semibold ">Title Project</h3>
                  <p className="mb-3 text-lg text-gray-500 md:text-lg ">
                    {name}
                  </p>
                </div>
                <div className=" flex flex-col gap-4 mb-4">
                  <h3 className="text-xl font-semibold ">Budget</h3>
                  <p className="mb-3 text-lg text-gray-500 md:text-lg ">
                    {currency(budget)}
                  </p>
                </div>
                <div className=" flex flex-col gap-4 mb-4">
                  <h3 className="text-xl font-semibold ">Description</h3>
                  <p className="mb-3 text-lg text-gray-500 md:text-lg ">
                    {description}
                  </p>
                </div>
                <div className=" flex flex-col gap-4 mb-4">
                  <div className="flex gap-2">
                    <DefaultLink
                      href={productionUrl}
                      size={'small'}
                      status={'primary'}
                      title={'Visit Production'}
                      icon={<IoLinkSharp />}
                    />
                    <DefaultLink
                      href={repositoryUrl}
                      size={'small'}
                      status={'secondary'}
                      title={' Visit Repository'}
                      icon={<IoLinkSharp />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className=" flex justify-between">
                <h3 className="text-xl font-semibold  ">Contributor Project</h3>
              </div>
              <div className="flex justify-between items-center lg:mt-4">
                <div className="items-center justify-between hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
                  <form className="lg:pr-3" action="#" method="GET">
                    <label htmlFor="users-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative mt-1 lg:w-64 xl:w-96">
                      <InputField
                        id={'search'}
                        name={'search'}
                        placeholder={'Search for contributor'}
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
              </div>
              <div className="container mt-4 mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
                  {contributorsProject &&
                    contributorsProject.map((data, index) => (
                      <div
                        key={index}
                        className="m-2 cursor-pointer border border-gray-200 rounded-lg hover:shadow-md hover:border-opacity-0 transform hover:-translate-y-1 transition-all duration-200"
                      >
                        <div className="m-3">
                          <div className="flex flex-col items-center pb-10">
                            {data.profileUrl ? (
                              <div className="w-24 h-24 rounded-full shadow-lg mb-3">
                                <img
                                  className="w-24 h-24 object-cover rounded-full"
                                  src={data.profileUrl}
                                  alt="Bonnie image"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 rounded-full shadow-lg mb-3"></div>
                            )}
                            <h5 className="mb-1 text-xl font-medium text-gray-900">
                              {data.name}
                            </h5>
                            <span className="text-sm text-gray-500">
                              {data.division}
                            </span>
                            <div className="flex mt-4 md:mt-6">
                              <Link
                                href={`/member/detailMember?nim=${data.nim}`}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-primary-600 border-2 border-primary-700 rounded-lg hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300"
                              >
                                Detail
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailProjectPage;
