/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import ListNews from "@/components/listTable/listNews";
import axios from "axios";
import InputField from "@/components/form/inputField";

import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

import DefaultLink from "@/components/link/defaultLink";
import DefaultButton from "@/components/button/defaultButton";
import HeadTitle from "@/components/headTitle";
import DefaultTable from "@/components/table/defaultTable";
import Link from "next/link";
import request from "@/app/utils/request";
import Pagination from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

export default function NewsPage() {
  // Gunakan huruf besar untuk nama fungsi komponen
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") ?? "1";
  const [searchQuery, setSearchQuery] = useState("");
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [debounceValue] = useDebounce(searchQuery, 500);
  const [newsDatas, setNewsDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowMenu = [
    // Perbaiki penulisan rowMenu
    { menu: "TITLE" },
    { menu: "DESCRIPTION" },
    { menu: "" },
  ];

  const fetchNews = useCallback(async () => {
    //   const payload = {
    //     search: debounceValue,
    //     page: page,
    //     limit: LIMIT,
    //     ordering: ORDERING,
    //     sort: SORT,
    //   };
    request
      .get(`/cms/news`)
      .then(function (response) {
        setNewsDatas(response.data.data);
        setRecordsTotal(response.data.recordsTotal);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (page < 1) {
      router.push("/news?page=1");
    } else {
      fetchNews();
    }
  }, [page, fetchNews, router]);

  useEffect(() => {
    if (debounceValue !== "") {
      router.push("/news?page=1");
    } else {
      fetchNews();
    }
  }, [debounceValue, fetchNews, router]);

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
                  id={"search"}
                  name={"search"}
                  placeholder={"Search for news"}
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
          <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
            <DefaultLink
              size={"small"}
              status={"primary"}
              title={"Add news"}
              href={"/news/addNews"}
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
            {newsDatas.map(
              (
                data,
                index // Ubah 'datas' menjadi 'data' untuk setiap iterasi
              ) => (
                <ListNews
                  key={index}
                  title={data.title}
                  description={data.description}
                  id={data.id}
                  fetchData={fetchNews}
                />
              )
            )}
          </DefaultTable>
          <Pagination />
        </div>
      )}
    </div>
  );
}
