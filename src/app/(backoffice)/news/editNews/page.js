"use client";
import DefaultButton from "@/components/button/defaultButton";
import DefaultLink from "@/components/link/defaultLink";
import InputField from "@/components/form/inputField";
import RichTextEditor from "@/components/form/inputRichText";
import InputSelect from "@/components/form/inputSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import request from "@/app/utils/request";

export default function EditNewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  // State untuk menyimpan data event
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  useEffect(() => {
    if (!id) {
      router.push("/news");
      return;
    }
    request
      .get(`/newsById`)
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
  }, [id, router]);

  return (
    <div>
      <HeadTitle title={"Edit News"}>
        {loading ? (
          <div className="text-center">Loading...</div> // Tampilkan pesan loading jika data sedang dimuat
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <InputField
                    id={"title"}
                    name={"title"}
                    placeholder={"Menuju Era Baru"}
                    type={"text"}
                    value={title}
                    required
                    label={"Title"}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={"media"}
                    name={"media"}
                    type={"file"}
                    value={mediaUrl}
                    multiple={true}
                    required
                    label={"Media"}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <RichTextEditor
                    id={"description"}
                    name={"description"}
                    placeholder={"e.g Description ..."}
                    value={description}
                    required
                    label={"Description"}
                    // onChange={(e) => {
                    //   setDescription(e.target.value);
                    // }}
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
