/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useSearchParams, useRouter } from "next/navigation";
import { RiFilter2Line } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

import request from "@/app/utils/request";
import Pagination from "@/components/pagination";
import ListEvent from "@/components/listTable/listEvent";
import InputField from "@/components/form/inputField";
import DefaultLink from "@/components/link/defaultLink";
import HeadTitle from "@/components/headTitle";
import DefaultTable from "@/components/table/defaultTable";
import DefaultButton from "@/components/button/defaultButton";

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
  const [isActive, setIsActive] = useState({
    active: true,
    inActive: true
  });
  const [isDropdown, setIsDropdown] = useState(false);
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

  const fetchEvent = async () => {
    const payload = {
      name: debounceValue,
      page: page,
      limit: LIMIT,
      ordering: ORDERING,
      sort: SORT,
      isActive: isActive.active == true && isActive.inActive == true ? undefined : (isActive.active)
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
  };
  
  useEffect(() => {
    if (page < 1) {
      router.push("/event?page=1");
    } else {
      fetchEvent();
      setIsDropdown(false);
    }
  }, [debounceValue, page, isActive]);

  const handleDropdown = () => {
    setIsDropdown(!isDropdown);
  }

  return (
    <div>
      <HeadTitle>
      <div className="flex lg:mt-4">
        <div className="items-center hidden mb-3 space-x-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
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
                }}
                icon={<IoIosSearch />}
              />
            </div>
          </form>

          <div className="relative cursor-pointer" onClick={handleDropdown}>
            <RiFilter2Line className="w-6 h-6 text-gray-400 cursor-pointer" />
            {isDropdown && (
              <div className="absolute top-[-60px] z-10 w-[200px] mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg right-[-200px] ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div role="menu" className="p-1" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div 
                    className="flex items-center px-2 py-2 text-sm text-gray-700 bg-white rounded-md cursor-pointer hover:bg-green-300"
                    role="menuitem" 
                    id="options-menu-0" 
                    aria-disabled="false"
                    onClick={() => setIsActive({...isActive, active: !isActive.active})}
                  >
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mr-2 pointer-events-none"
                      checked={isActive.active} 
                      readOnly
                    />
                    Active
                  </div>
                  <div 
                    className="flex items-center px-2 py-2 text-sm text-gray-700 bg-white rounded-md cursor-pointer hover:bg-red-300" 
                    role="menuitem" 
                    id="options-menu-1" 
                    aria-disabled="false"
                    onClick={() => setIsActive({...isActive, inActive: !isActive.inActive})}
                  >
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mr-2 pointer-events-none"
                      checked={isActive.inActive} 
                      readOnly
                    />
                    Inactive
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <DefaultLink
            size={"small"}
            status={"primary"}
            title={"Add Event"}
            href={"/event/addEvent"}
            icon={<FaPlus />}
            onClick={() => {}}
          />
        </div>
      </div>
      </HeadTitle>
      
      {loading ? (
        <div className="flex items-center justify-center w-full h-full text-center">Loading...</div>
      ) : (
        <div className="">
          <DefaultTable rowMenu={rowMenu}>
            {eventDatas.map(
              (
                data,
                index
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
                  fetchData={fetchEvent}
                />
              )
            )}
          </DefaultTable>
          <Pagination recordsTotal={recordsTotal} page={page} link="event" />
        </div>
      )}
    </div>
  );
};