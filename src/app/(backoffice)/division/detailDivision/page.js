"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useSearchParams } from "next/navigation";

import { StateContext } from "@/app/(backoffice)/state";
import request from "@/app/utils/request";
import ListDivisionMember from "@/components/listTable/listDivisionMember";
import DefaultTable from "@/components/table/defaultTable";
import DefaultLink from "@/components/link/defaultLink";
import Pagination from "@/components/pagination";
import LogoNotfound from '/public/assets/icon/notfound.svg';


function DetailDivisionPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [logoUri, setLogoUri] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const { setDivisionName, setDivisionId } = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  const rowMenu = [
    { menu: "NAME" },
    { menu: "DIVISION" },
    { menu: "MAJOR" },
    { menu: "ENTRY UNIVERSITY" },
    { menu: "ENTRY COMMUNITY" },
    { menu: "STATUS" },
    { menu: "" },
  ];

  const fetchDivision = useCallback(async (divisionId) => {
    try {
      const response = await request.get(`/cms/users/divisions?id=${divisionId}`);
      const data = response.data?.data;
      setName(data.name);
      setLogoUri(data.logoUri);
      setDescription(data.description);
      setDivisionName(data.name);
      setDivisionId(divisionId);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [setDivisionName, setDivisionId]);

  const fetchMembers = useCallback(async (divisionId) => {
    try {
      const response = await request.get(`/cms/users?division=${divisionId}`);
      setMembers(response.data?.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDivision(id);
      fetchMembers(id);
    }
  }, [id, fetchDivision, fetchMembers]);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <div className="flow-root">
                  <h3 className="mb-4 text-xl font-semibold">Logo Division</h3>
                  <img
                    src={
                      logoUri
                        ? `${process.env.NEXT_PUBLIC_HOST}` + logoUri
                        : LogoNotfound.src
                    }
                    width={100}
                    height={100}
                    className="w-full rounded-2xl"
                    alt="Division Logo CCI"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <div className="flow-root ">
                  <h3 className="mb-4 text-xl font-semibold">Division</h3>
                  <div className="mb-8">
                    <p className="mb-3 text-gray-500">{name ? name : "No name found"}</p>
                  </div>
                  <h3 className="mb-4 text-xl font-semibold">Description</h3>
                  <div className="mb-8">
                    <p className="mb-3 text-gray-500">{description ? description : "No description found"}</p>
                  </div>
                  <div className="flex items-center">
                    <DefaultLink
                      href={`/division/editDivision?id=${id}`}
                      size={"base"}
                      status={"primary"}
                      title={"Edit"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )};

      <div className="">
        <div className="p-4">
          <h3 className="text-xl font-semibold">
            Member Division Web Development
          </h3>
        </div>
        <div className="">
          <DefaultTable rowMenu={rowMenu}>
            {members.map(
              (data, index) => (
                <ListDivisionMember
                  key={index}
                  photoUri={data.profileUri}
                  name={data.name}
                  email={data.email}
                  divisi={data.division}
                  major={data.major}
                  entryUniversity={data.yearUniversityEnrolled}
                  entryCommunity={data.yearCommunityEnrolled}
                  status={data.isActive}
                  nim={data.nim}
                  fetchData={() => fetchMembers(id)}
                />
              )
            )}
          </DefaultTable>
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default DetailDivisionPage;