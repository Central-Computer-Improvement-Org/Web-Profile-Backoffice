"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import React, { useState } from "react";

export default function AddAwardPage() {
  const [issuer, setIssuer] = useState("");
  const [description, setDescription] = useState("");
  return (
    <div>
      <HeadTitle title={"Add Award"}>
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
          <form action="#">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
              <div className="sm:col-span-6">
                <InputField
                  id={"issuer"}
                  name={"issuer"}
                  placeholder={"e.g Gemastik"}
                  type={"text"}
                  value={issuer}
                  required
                  label={"Issuer"}
                  onChange={(e) => {
                    setIssuer(e.target.value);
                  }}
                />
              </div>
              <div className="sm:col-span-6">
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
