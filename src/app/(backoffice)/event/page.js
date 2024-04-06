/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
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
                  division={data.division.name}
                  heldOn={data.heldOn}
                  budget={data.budget}
                  id={data.id}
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
