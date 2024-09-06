/* eslint-disable @next/next/no-img-element */
"use client";
import request from "@/app/utils/request";
import InputField from "@/components/form/inputField";
import DefaultLink from "@/components/link/defaultLink";
import Pagination from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import { IoLinkSharp } from "react-icons/io5";
import { currency } from "@/app/utils/numberFormat";
import { StateContext } from "@/app/(backoffice)/state";

import { useDebounce } from 'use-debounce';

// Sorting Constants
const ORDERING = 'name';
const SORT = 'asc';

// Pagination Constants
const LIMIT = 10;

function DetailProjectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const page = searchParams.get('page') ?? '1';

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [description, setDescription] = useState("");
  const [productionUri, setProductionUri] = useState("");
  const [repositoryUri, setRepositoryUri] = useState("");
  const { setProjectName, setProjectId } = useContext(StateContext);

  const [contributors, setContributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [recordsTotal, setRecordsTotal] = useState(0);

  const [debounceValue] = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    request
      .get(`/cms/projects?id=${id}`)
      .then(function (response) {
        const data = response.data.data;
        setName(data.name);
        setDescription(data.description);
        setImageUri(data.imageUri);
        setProductionUri(data.productionUri);
        setRepositoryUri(data.repositoryUri);
        setBudget(data.budget);
        setProjectName(data.name);
        setProjectId(data.id);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id, setProjectName, setProjectId]);

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
      .get(`/cms/projects`, payload)
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
      router.push("/project");
      return;
    }
  }, [id, fetchProject, router]);

  useEffect(() => {
    if (page < 1) {
      router.push(`/project/detailProject?id=${id}&page=1`);
    } else {
      fetchProject();
      fetchContributor();
      setLoading(false)
    }
  }, [id, page, fetchProject, fetchContributor, router]);

  useEffect(() => {
    if (debounceValue !== '') {
      router.push(`/project/detailProject?id=${id}&page=1`);
    } else {
      fetchProject();
      fetchContributor();
      setLoading(false)
    }
  }, [id, debounceValue, fetchProject, fetchContributor, router]);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
          <div className="col-span-full xl:col-auto">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className="flow-root">
                <div className="mb-4">
                  <img
                    src={`https://103-31-38-146.sslip.io${imageUri}`}
                    width={0}
                    height={0}
                    className="w-full h-[250px] object-cover rounded-md"
                    alt="profile"
                  />
                </div>
                <div className="flex flex-col gap-4 mb-4">
                  <h3 className="text-xl font-semibold ">Title Project</h3>
                  <p className="text-lg text-gray-500 md:text-lg">{name}</p>
                </div>
                
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex gap-2">
                    <DefaultLink
                      href={productionUri}
                      size={"small"}
                      status={"primary"}
                      title={"Visit Production"}
                      icon={<IoLinkSharp />}
                    />
                    <DefaultLink
                      href={repositoryUri}
                      size={"small"}
                      status={"secondary"}
                      title={" Visit Repository"}
                      icon={<IoLinkSharp />}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 mb-4 ">
                  <h3 className="text-xl font-semibold ">Budget</h3>
                  <p className="mb-3 text-lg text-gray-500 md:text-lg ">
                    {currency(budget)}
                  </p>
                </div>
                <div className="flex flex-col gap-4 mb-4 ">
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
              <div className="flex justify-between ">
                <h3 className="text-xl font-semibold">Contributor Project</h3>
              </div>
              <div className="flex items-center justify-between lg:mt-4">
                <div className="items-center justify-between hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
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
              <div className="container mx-auto mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
                  {contributors &&
                    contributors.map((data, index) => (
                      <div
                        key={index}
                        className="m-2 transition-all duration-200 transform border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:border-opacity-0 hover:-translate-y-1"
                      >
                        <div className="m-3">
                          <div className="flex flex-col items-center pb-10">
                            {data.profileUri ? (
                              <div className="w-24 h-24 mb-3 rounded-full shadow-lg">
                                <img
                                  className="object-cover w-24 h-24 rounded-full"
                                  src={"http://103.187.147.80:8000" + data.profileUri}
                                  alt="Bonnie image"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 mb-3 bg-gray-200 rounded-full shadow-lg"></div>
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
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center border-2 rounded-lg text-primary-600 border-primary-700 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300"
                              >
                                Detail
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <Pagination recordsTotal={recordsTotal} page={page} link={`project/detailProject?id=${id}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailProjectPage;
