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

function DetailNewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push("/news");
      return;
    }
    request
      .get("/newsById")
      .then(function (response) {
        const data = response.data.data;
        setTitle(data.title);
        setDescription(data.description);
        setMediaUrl(data.mediaUrl);
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
                  <p className="mb-3 text-gray-500 ">
                    We are on the brink of a new era driven by technological
                    advancements that fundamentally change the way we live and
                    work. Breakthroughs in information and communication
                    technology have ushered us into an era of boundless
                    connectivity, where we can easily connect with the world
                    through the internet and mobile devices. This ease of access
                    has opened doors to various services and information,
                    enabling us to lead more efficient and informed lifestyles.
                  </p>
                  <p className="mb-3 text-gray-500 ">
                    Furthermore, the industrial revolution propelled by
                    automation and artificial intelligence has reshaped the
                    landscape of work. Many routine and repetitive tasks can now
                    be performed by machines and algorithms, freeing humans to
                    focus on tasks that require creativity and strategic
                    thinking. The phenomenon of remote work is also becoming
                    increasingly common, with companies leveraging online
                    collaboration technologies to enable teams to work together
                    from different locations.
                  </p>
                  <p className="text-gray-500 ">
                    However, technological advancements also bring challenges
                    that cannot be ignored. There is still a significant digital
                    divide worldwide, where some people lack adequate access to
                    information technology. Additionally, there are growing
                    concerns about data privacy and security, with an increasing
                    amount of personal information being stored digitally. These
                    challenges require sustainable solutions so that everyone
                    can benefit from technological advancements.
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
