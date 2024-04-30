/* eslint-disable @next/next/no-img-element */
"use client";
import request from "@/app/utils/request";
import DefaultLink from "@/components/link/defaultLink";
import ListDivision from "@/components/listTable/listDivision";
import ListMember from "@/components/listTable/listMember";
import Pagination from "@/components/pagination";
import DefaultTable from "@/components/table/defaultTable";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDescription } from "react-icons/md";

function DetailDivisionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");

  const [datas, setDatas] = useState([]);

  const [loading, setLoading] = useState(true);

  const rowMenu = [
    // Perbaiki penulisan rowMenu
    { menu: "NAME" },
    { menu: "DIVISION" },
    { menu: "MAJOR" },
    { menu: "ENTRY UNIVERSITY" },
    { menu: "ENTRY COMMUNITY" },
    { menu: "STATUS" },
    { menu: "" },
  ];
  useEffect(() => {
    request
      .get("/member")
      .then(function (response) {
        setDatas(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
    request
      .get(`/divisionById`)
      .then(function (response) {
        const data = response.data.data;
        setName(data.name);
        setLogoUrl(data.logoUrl);
        setDescription(data.description);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id, router]);
  return (
    <div>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <div className="flow-root ">
                  <h3 className="text-xl font-semibold mb-4">Logo Division</h3>
                  <img src={logoUrl} alt="" className="w-full rounded-2xl" />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <div className="flow-root ">
                  <h3 className="text-xl font-semibold mb-4">Division</h3>
                  <div className="mb-8">
                    <p class="mb-3 text-gray-500 ">{name}</p>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <div className="mb-8">
                    <p class="mb-3 text-gray-500 ">{description}</p>
                    <p class="text-gray-500 ">
                      Deliver great service experiences fast - without the
                      complexity of traditional ITSM solutions.Accelerate
                      critical development work, eliminate toil, and deploy
                      changes with ease, with a complete audit trail for every
                      change.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <DefaultLink
                      href={"/division/editDivision?id=AWD-1"}
                      size={"base"}
                      status={"primary"}
                      title={"Edit"}
                    />
                    <DefaultLink
                      href={"/division"}
                      size={"base"}
                      status={"secondary"}
                      title={"Back"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="">
        <div className="p-4 ">
          <h3 className=" text-xl font-semibold ">
            Member Division Web Development
          </h3>
        </div>
        <div className="">
          <DefaultTable rowMenu={rowMenu}>
            {datas.map(
              (
                data,
                index // Ubah 'datas' menjadi 'data' untuk setiap iterasi
              ) => (
                <ListMember
                  key={index}
                  photoUrl={data.profileUrl}
                  name={data.name}
                  email={data.email}
                  divisi={data.division}
                  major={data.major}
                  entryUniversity={data.yearUniversityEnrolled}
                  entryCommunity={data.yearCommunityEnrolled}
                  status={data.isActive}
                  nim={data.nim}
                />
              )
            )}
          </DefaultTable>
          <Pagination />
        </div>
      </div>
    </div>
  );
}

export default DetailDivisionPage;
