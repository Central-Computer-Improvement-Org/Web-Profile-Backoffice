"use client";
import DefaultButton from "@/components/button/defaultButton";
import DefaultLink from "@/components/link/defaultLink";
import { host } from "@/app/utils/urlApi";
import InputField from "@/components/form/inputField";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EditDivisionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  // State untuk menyimpan data event
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  useEffect(() => {
    if (!id) {
      router.push("/division");
      return;
    }
    axios
      .get(`${host}/api/divisionById`)
      .then(function (response) {
        const data = response.data.data;
        setTitle(data.title);
        setDescription(data.description);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <HeadTitle title={"Edit Division"}>
        {loading ? (
          <div className="text-center">Loading...</div> // Tampilkan pesan loading jika data sedang dimuat
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <InputField
                    id={"name"}
                    name={"name"}
                    placeholder={"Web Development"}
                    type={"text"}
                    value={name}
                    required
                    label={"Name"}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={"logo"}
                    name={"logo"}
                    type={"file"}
                    value={logoUrl}
                    multiple={true}
                    required
                    label={"Logo"}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <TextareaField
                    id={"description"}
                    name={"description"}
                    placeholder={"e.g Description ..."}
                    value={description}
                    required
                    label={"Description"}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-full flex gap-3">
                  <DefaultButton
                    size={"small"}
                    status={"primary"}
                    title={"Update"}
                    type={"submit"}
                    onClick={() => {}}
                  />
                  <DefaultLink
                    size={"small"}
                    status={"secondary"}
                    title={"Back"}
                    href={"/news"}
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </HeadTitle>
    </div>
  );
}
