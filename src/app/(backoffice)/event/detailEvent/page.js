/* eslint-disable @next/next/no-img-element */
"use client";
import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import InputSelect from "@/components/form/inputSelect";
import DefaultLink from "@/components/link/defaultLink";
import moment from "moment";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

function DetailEventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [division, setDivision] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [heldOn, setHeldOn] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push("/event");
      return;
    }
    request
      .get("/eventById")
      .then(function (response) {
        const data = response.data.data;
        setName(data.name);
        setDescription(data.description);
        setDivision(data.division.name);
        setMediaUrl(data.mediaUrl);
        setHeldOn(data.heldOn);
        setBudget(data.budget);
        setLoading(false); // Setelah data dimuat, atur loading menjadi false
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false); // Jika terjadi kesalahan, tetap atur loading menjadi false
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
          <div className="col-span-2 px-4 pt-6">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className="flow-root">
                <div className="flow-root">
                  <div className="mb-8 ">
                    <h3 className="text-xl font-semibold mb-4 flex justify-center">
                      {name}
                    </h3>
                    <div className="flex justify-center">
                      <img
                        src={mediaUrl}
                        alt=""
                        className="w-1/2 rounded-2xl "
                      />
                    </div>
                  </div>
                </div>
                <div className="flex ">
                  <div className="flex-auto">
                    <h3 className="text-xl font-semibold mb-4">Division</h3>
                    <div className="mb-8">
                      <p class="mb-3 text-gray-500 ">{division}</p>
                    </div>
                  </div>
                  <div className="flex-auto">
                    <h3 className="text-xl font-semibold mb-4">Held On</h3>
                    <div className="mb-8">
                      <p class="mb-3 text-gray-500 ">
                        {moment(heldOn).format("MMM YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="flex-auto">
                    <h3 className="text-xl font-semibold mb-4">Budget</h3>
                    <div className="mb-8">
                      <p class="mb-3 text-gray-500 ">{budget}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <div className="mb-8">
                  <p class="mb-3 text-gray-500 ">{description}</p>
                  <p class="mb-3 text-gray-500 ">
                    Track work across the enterprise through an open,
                    collaborative platform. Link issues across Jira and ingest
                    data from other software development tools, so your IT
                    support and operations teams have richer contextual
                    information to rapidly respond to requests, incidents, and
                    changes.
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
      )}
    </div>
  );
}

export default DetailEventPage;
