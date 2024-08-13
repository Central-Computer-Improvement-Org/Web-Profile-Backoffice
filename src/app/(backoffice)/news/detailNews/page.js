/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { MdEmail } from "react-icons/md";

import { StateContext } from "@/app/(backoffice)/state";
import request from "@/app/utils/request";
import DefaultLink from "@/components/link/defaultLink";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import InputSelect from "@/components/form/inputSelect";



function DetailNewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const { setNewsName, setNewsId } = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push("/news");
      return;
    }
    request
      .get(`/news?id=${id}`)
      .then(function (response) {
        const data = response.data.data;
        setTitle(data.title);
        setDescription(data.description);
        setMediaUrl(data.mediaUrl);
        setNewsName(data.title);
        setNewsId(data.id);
        setLoading(false); // Setelah data dimuat, atur loading menjadi false
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false); // Jika terjadi kesalahan, tetap atur loading menjadi false
      });
  }, [id, router, setNewsName, setNewsId]);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="col-span-2 px-4 pt-6">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className="flow-root">
                <div className="flow-root">
                  <div className="mb-8 ">
                    <h3 className="flex justify-center mb-4 text-xl font-semibold">
                      {title}
                    </h3>
                    <div className="flex justify-center">
                      <img
                        src={mediaUrl}
                        alt=""
                        className="w-3/5 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <p className="mb-3 text-gray-500 ">{description}</p>
                  <p className="mb-3 text-white ">
                    We are on the brink of a new era driven by technological
                    advancements that fundamentally change the way we live and
                    work. Breakthroughs in information and communication
                    technology have ushered us into an era of boundless
                    connectivity, where we can easily connect with the world
                    through the internet and mobile devices. This ease of access
                    has opened doors to various services and information,
                    enabling us to lead more efficient and informed lifestyles.
                  </p>
                </div>
                <div className="flex items-center">
                  <DefaultLink
                    href={"/news/editNews?id=NWS-12345"}
                    size={"base"}
                    status={"primary"}
                    title={"Edit"}
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

export default DetailNewsPage;
