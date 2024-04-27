"use client";
import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import InputMultipleSelect from "@/components/form/inputMultipleSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import React, { useEffect, useState } from "react";

export default function AddDevisionPage() {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request
      .get("/member")
      .then(function (response) {
        setMembers(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <HeadTitle title={"Add Division"}>
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
          <form action="#">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
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
