/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import ListEvent from "@/components/listTable/listEvent";
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

import { useDebounce } from "use-debounce";
import { useSearchParams, useRouter } from "next/navigation";

// Sorting Constants
const ORDERING = "updatedAt";
const SORT = "desc";

// Pagination Constants
const LIMIT = 10;

export default function EventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") ?? "1";

  const [eventDatas, setEventDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [recordsTotal, setRecordsTotal] = useState(0);

  const [debounceValue] = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);

  const rowMenu = [
    { menu: "NAME" },
    { menu: "DIVISION" },
    { menu: "DESCRIPTION" },
    { menu: "HELD ON" },
    { menu: "BUDGET" },
    { menu: "STATUS" },
    { menu: "" },
  ];

  const fetchEvents = useCallback(async () => {
    const payload = {
      name: debounceValue,
      page: page,
      limit: LIMIT,
      ordering: ORDERING,
      sort: SORT,
    };

    request
      .get(`/cms/events`, payload)
      .then(function (response) {
        setEventDatas(response.data.data);
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
      router.push("/event?page=1");
    } else {
      fetchEvents();
    }
  }, [debounceValue, page, fetchEvents, router]);

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
                  placeholder={"Search for Event"}
                  type={"text"}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    console.log(searchQuery);
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
              title={"Add event"}
              href={"/event/addEvent"}
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
            {eventDatas.map(
              (
                data,
                index // Ubah 'eventDatas' menjadi 'data' untuk setiap iterasi
              ) => (
                <ListEvent
                  key={index}
                  name={data.name}
                  division={data.division}
                  description={data.description}
                  heldOn={data.heldOn}
                  budget={data.budget}
                  isActive={data.isActive}
                  id={data.id}
                  fetchData={fetchEvents}
                />
              )
            )}
          </DefaultTable>
          <Pagination recordsTotal={recordsTotal} page={page} link="event" />
        </div>
      )}
    </div>
  );
}
