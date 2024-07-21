/* eslint-disable @next/next/no-img-element */
"use client";
import request from "@/app/utils/request";
import InputField from "@/components/form/inputField";
import DefaultLink from "@/components/link/defaultLink";
import Pagination from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";

import { useDebounce } from 'use-debounce';

// Sorting Constants
const ORDERING = 'name';
const SORT = 'asc';

// Pagination Constants
const LIMIT = 10;

function DetailAwardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const page = searchParams.get('page') ?? '1';

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [description, setDescription] = useState("");

  const [contributors, setContributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [recordsTotal, setRecordsTotal] = useState(0);

  const [debounceValue] = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);

  const fetchAward = useCallback(async () => {
    setLoading(true);
    request
      .get(`/cms/awards?id=${id}`)
      .then(function (response) {
        const data = response.data.data;
        setTitle(data.title);
        setIssuer(data.issuer);
        setDescription(data.description);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id])

  const fetchContributor = useCallback(async () => {
    const payload = {
      id: id,
      contributorsOnly: "true",
      search: debounceValue,
      page: page,
      limit: LIMIT,
      ordering: ORDERING,
      sort: SORT,
    };
    request
      .get(`/cms/awards`, payload)
      .then(function (response) {
        setContributors(response.data.data);
        setRecordsTotal(response.data.recordsTotal);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id, debounceValue, page]);

  useEffect(() => {
    if (!id) {
      router.push("/award");
      return;
    };
  }, [id, fetchAward, router]);

  useEffect(() => {
    if (page < 1) {
      router.push(`/award/detailAward?id=${id}&page=1`);
    } else {
      fetchAward();
      fetchContributor();
      setLoading(false)
    }
  }, [id, page, fetchAward, fetchContributor, router]);

  useEffect(() => {
    if (debounceValue !== '') {
      router.push(`/award/detailAward?id=${id}&page=1`);
    } else {
      fetchAward();
      fetchContributor();
      setLoading(false)
    }
  }, [id, debounceValue, fetchAward, fetchContributor, router]);

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
                  <h3 className="text-xl font-semibold ">Issuer Award</h3>
                  <p className="mb-3 text-lg text-gray-500 md:text-lg ">
                    {issuer}
                  </p>
                </div>
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
                        id={"search"}
                        name={"search"}
                        placeholder={"Search for contributor"}
                        type={"text"}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        icon={<IoIosSearch />}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="container mt-4 mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
                  {contributors.map((data, index) => (
                    <div
                      key={index}
                      className="m-2 cursor-pointer border border-gray-200 rounded-lg hover:shadow-md hover:border-opacity-0 transform hover:-translate-y-1 transition-all duration-200"
                    >
                      <div className="m-3">
                        <div className="flex flex-col items-center pb-10">
                          {data.profileUri ? (
                            <div className="w-24 h-24 rounded-full shadow-lg mb-3">
                              <img
                                className="w-24 h-24 object-cover rounded-full"
                                src={"https://kevinid.pythonanywhere.com" +data.profileUri}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination  recordsTotal={recordsTotal} page={page} link={`award/detailAward?id=${id}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailAwardPage;
