/* eslint-disable @next/next/no-img-element */
"use client";
import request from "@/app/utils/request";
import DefaultLink from "@/components/link/defaultLink";
import listEvent from "@/components/listTable/listDivision";
import ListMember from "@/components/listTable/listMember";
import Pagination from "@/components/pagination";
import DefaultTable from "@/components/table/defaultTable";
import React, { useEffect, useState } from "react";
import { MdDescription } from "react-icons/md";

function DetailEventPage() {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <div>
        <div className="col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
            <div className="flow-root">
              <div className="flow-root">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 ">CCI SUMMIT</h3>
                  <img
                    src="https://img.freepik.com/free-photo/modern-office-space-with-desktops-with-modern-computers-created-with-generative-ai-technology_185193-110089.jpg?w=2000&t=st=1714246987~exp=1714247587~hmac=d01bd1798aa29ad437dc27390de665e6bee9c2b412f1c8660c6700732d0c81e7"
                    alt=""
                    className="w-1/2 rounded-2xl "
                  />
                </div>
              </div>
              <div className="flex">
                <div className="flex-auto">
                  <h3 className="text-xl font-semibold mb-4">Division</h3>
                  <div className="mb-8">
                    <p class="mb-3 text-gray-500 ">Web Development</p>
                  </div>
                </div>
                <div className="flex-auto">
                  <h3 className="text-xl font-semibold mb-4">Held On</h3>
                  <div className="mb-8">
                    <p class="mb-3 text-gray-500 ">1 January 2024</p>
                  </div>
                </div>
                <div className="flex-auto">
                  <h3 className="text-xl font-semibold mb-4">Budget</h3>
                  <div className="mb-8">
                    <p class="mb-3 text-gray-500 ">0</p>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <div className="mb-8">
                <p class="mb-3 text-gray-500 ">
                  Track work across the enterprise through an open,
                  collaborative platform. Link issues across Jira and ingest
                  data from other software development tools, so your IT support
                  and operations teams have richer contextual information to
                  rapidly respond to requests, incidents, and changes.
                </p>
                <p class="text-gray-500 ">
                  Deliver great service experiences fast - without the
                  complexity of traditional ITSM solutions.Accelerate critical
                  development work, eliminate toil, and deploy changes with
                  ease, with a complete audit trail for every change.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <DefaultLink
                  href={"/event/editEvent?id=EVT-12345"}
                  size={"base"}
                  status={"primary"}
                  title={"Edit"}
                />
                <DefaultLink
                  href={"/event"}
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
  );
}

export default DetailEventPage;
