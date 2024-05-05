"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
// import RichTextEditor from "@/components/form/inputRichText";
import HeadTitle from "@/components/headTitle";
import React, { useState } from "react";

import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/form/inputRichText"),
  {
    ssr: false,
  }
);

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  return (
    <div>
      <HeadTitle title={"Add News"}>
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
              <div className="sm:col-span-6">
                <DefaultButton
                  size={"small"}
                  status={"primary"}
                  title={"Save all"}
                  type={"submit"}
                  onClick={() => {}}
                />
              </div>
            </div>
          </form>
        </div>
      </HeadTitle>
    </div>
  );
}
