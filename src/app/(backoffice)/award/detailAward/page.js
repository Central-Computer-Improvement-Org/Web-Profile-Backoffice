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

function DetailAwardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [modalContributor, setModalContributor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(true);
  const [search, setSearch] = useState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contributor, setContributor] = useState([]);
  const [dataMember, setDataMember] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [prevSelectedMembers, setPrevSelectedMembers] = useState([]); // State untuk menyimpan nilai selectedMembers sebelum perubahan
  const [prevDataMember, setPrevDataMember] = useState([]); // State untuk menyimpan nilai selectedMembers sebelum perubahan

  useEffect(() => {
    if (!id) {
      router.push('/award');
      return;
    }

    setLoading(true);

    Promise.all([request.get('/contributorAwardById'), request.get('/member')])
      .then(function (responses) {
        const contributorResponse = responses[0].data.data;
        const memberResponse = responses[1].data.data;

        setTitle(contributorResponse.award.issuer);
        setDescription(contributorResponse.award.description);
        setContributor(contributorResponse.contributor);
        setSelectedMembers(contributorResponse.contributor);
        setPrevSelectedMembers(contributorResponse.contributor); // Menyimpan nilai selectedMembers sebelum perubahan
        setDataMember(
          memberResponse.filter((member) => {
            // Filter anggota yang tidak ada dalam selectedMembers
            return !contributorResponse.contributor.some(
              (selectedMember) => selectedMember.nim === member.nim
            );
          })
        );
        setPrevDataMember(
          memberResponse.filter((member) => {
            // Filter anggota yang tidak ada dalam selectedMembers
            return !contributorResponse.contributor.some(
              (selectedMember) => selectedMember.nim === member.nim
            );
          })
        );
        setLoading(false);
      })
      .catch(function (errors) {
        console.log(errors);
        setLoading(false);
      });
  }, [id, router]);

  const handleCheckboxChange = (member) => {
    const index = selectedMembers.findIndex(
      (selectedMember) => selectedMember.nim === member.nim
    );
    if (index === -1) {
      setSelectedMembers([...selectedMembers, member]);
      setDataMember(dataMember.filter((m) => m.nim !== member.nim));
    } else {
      setSelectedMembers(selectedMembers.filter((m) => m.nim !== member.nim));
      setDataMember([...dataMember, member]);
    }
  };

  // const nimList = selectedMembers.map((member) => member.nim);
  console.log(selectedMembers);
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
                  <h3 className="text-xl font-semibold ">Title Award</h3>
                  <p className="mb-3 text-lg text-gray-500 md:text-lg ">
                    {title}
                  </p>
                </div>
                <div className=" flex flex-col gap-4 mb-4">
                  <h3 className="text-xl font-semibold ">Description</h3>
                  <p className="mb-3 text-lg text-gray-500 md:text-lg ">
                    {description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <DefaultLink
                    href={'/award/detailAward/editAward?id=AWD-1'}
                    size={'base'}
                    status={'primary'}
                    title={'Update'}
                  />
                  <DefaultLink
                    href={'/award'}
                    size={'base'}
                    status={'secondary'}
                    title={'Back'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className=" flex justify-between">
                <h3 className="text-xl font-semibold  ">Contributor Award</h3>
              </div>
              <div className="flex justify-between items-center lg:mt-4">
                <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
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
                <div className="">
                  <DefaultButton
                    size={'small'}
                    status={'primary'}
                    title={'Add contributor'}
                    icon={<FaPlus />}
                    onClick={() => {
                      setModalContributor(!modalContributor);
                    }}
                  />
                  {modalContributor ? (
                    <div className="w-full h-screen absolute left-0 top-0 z-50 flex items-center justify-center">
                      <div className="w-full h-screen bg-black opacity-50 " />
                      <div className="absolute w-1/2 h-auto bg-white rounded-lg">
                        <div className="flex justify-between items-center p-4  border-b border-gray-200">
                          <h1 className="font-semibold text-xl">
                            Add Contributor
                          </h1>
                          <GoX
                            className="text-2xl"
                            onClick={() => {
                              setModalContributor(!modalContributor);
                              setSelectedMembers(prevSelectedMembers);
                              setDataMember(prevDataMember);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 p-4 xl:grid-cols-4 gap-5">
                          <div className="col-span-full xl:col-span-2">
                            {/* <h1 className="mb-4 font-medium text-lg">
                              List Members
                            </h1> */}
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
                            <div className="mb-4" />
                            <div className="overflow-x-auto h-96 border border-gray-200 p-4 rounded-lg flex flex-col gap-3">
                              {dataMember &&
                                dataMember.map((member) => (
                                  <div
                                    className="flex items-center gap-3"
                                    key={member.nim}
                                  >
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(member)
                                      }
                                    />
                                    <h1>{member.name}</h1>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="col-span-full xl:col-span-2">
                            <h1 className="mb-4 font-medium text-lg">
                              List Selected Members
                            </h1>
                            <div className="overflow-x-auto h-[400px] border border-gray-200 p-4 rounded-lg flex flex-col gap-3">
                              {selectedMembers.length > 0
                                ? selectedMembers.map((member) => (
                                    <div
                                      className="flex items-center gap-3"
                                      key={member.nim}
                                    >
                                      <input
                                        type="checkbox"
                                        onChange={() =>
                                          handleCheckboxChange(member)
                                        }
                                        checked
                                      />
                                      <h1>{member.name}</h1>
                                    </div>
                                  ))
                                : 'There are no contributors yet'}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end items-center gap-3 p-4  border-t border-gray-200">
                          <DefaultButton
                            size={'small'}
                            status={'secondary'}
                            title={'Cancel'}
                            onClick={() => {
                              setModalContributor(!modalContributor);
                              setSelectedMembers(prevSelectedMembers);
                              setDataMember(prevDataMember);
                            }}
                          />
                          <DefaultButton
                            size={'small'}
                            status={'primary'}
                            title={'Save'}
                            onClick={() => {}}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="container mt-4 mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
                  {contributor.map((data, index) => (
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
                            {data.division.name}
                          </span>
                          <div className="flex mt-4 md:mt-6">
                            <Link
                              href={`/member/detailMember?nim=${data.nim}`}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-primary-600 border-2 border-primary-700 rounded-lg hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300"
                            >
                              Detail
                            </Link>
                            <button
                              onClick={() => {}}
                              className="py-2 px-4 ms-2 text-sm font-medium text-secondary-600 focus:outline-none rounded-lg border-2 border-secondary-600 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                            >
                              Delete
                            </button>
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

export default DetailAwardPage;
