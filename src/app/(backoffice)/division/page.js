"use client";

import React, { useEffect, useState } from "react";
import { host } from "@/app/utils/urlApi";
import ListDivision from "@/components/listTable/listDivision";
import axios from "axios";
import InputField from "@/components/form/inputField";

import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

import DefaultLink from "@/components/link/defaultLink";
import HeadTitle from "@/components/headTitle";
import DefaultTable from "@/components/table/defaultTable";
import request from "@/app/utils/request";
import Link from "next/link";
import Pagination from "@/components/pagination";

export default function DivisionPage() {
  const [search, setSearch] = useState("");
  const [divisionDatas, setDivisionDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowMenu = [
    { menu: "NAME" },
    { menu: "LOGO" },
    { menu: "DESCRIPTION" },
    { menu: "" },
  ];
  useEffect(() => {
    request
      .get("/division")
      .then(function (response) {
        setDivisionDatas(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <HeadTitle title={"All Divisions"}>
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
                  placeholder={"Search for Division"}
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
              title={"Add Division"}
              href={"/division/addDivision"}
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
            {divisionDatas.map(
              (
                data,
                index // Ubah 'awardDatas' menjadi 'data' untuk setiap iterasi
              ) => (
                <ListDivision
                  key={index}
                  name={data.name}
                  logoUrl={data.logoUrl}
                  description={data.description}
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
