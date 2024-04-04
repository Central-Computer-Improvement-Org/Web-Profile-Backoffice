/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import DefaultLink from "@/components/link/defaultLink";
import DefaultButton from "@/components/button/defaultButton";
import HeadTitle from "@/components/headTitle";
import DefaultTable from "@/components/table/defaultTable";
import InputField from "@/components/form/inputField";
import ListEvent from "@/components/listTable/listEvent";
import axios from "axios";
import request from "@/app/utils/request";

import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import React, { useEffect, useState } from "react";

export default function EventPage() {
  // Gunakan huruf besar untuk nama fungsi komponen
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowMenu = [
    // Perbaiki penulisan rowMenu
    { menu: "NAME" },
    { menu: "DIVISION" },
    { menu: "DESCRIPTION" },
    { menu: "HELD ON" },
    { menu: "BUDGET" },
    { menu: "" },
  ];

  useEffect(() => {
    request
      .get("/event")
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
      <HeadTitle title={"All Event"}>
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
                  placeholder={"Search for event"}
                  type={"text"}
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
            {datas.map(
              (
                data,
                index // Ubah 'datas' menjadi 'data' untuk setiap iterasi
              ) => (
                <ListEvent
                  key={index}
                  name={data.name}
                  description={data.description}
                  division={data.divisionId.name}
                  heldOn={data.heldOn}
                  budget={data.budget}
                  id={data.id}
                />
              )
            )}
          </DefaultTable>
          <div className="flex items-center mb-4 sm:mb-0 py-5">
            <a
              href="#"
              className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 "
            >
              <svg
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
            >
              <svg
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <span className="text-sm font-normal text-gray-500 ">
              Showing <span className="font-semibold text-gray-900 ">1-20</span>{" "}
              of <span className="font-semibold text-gray-900 ">2290</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
