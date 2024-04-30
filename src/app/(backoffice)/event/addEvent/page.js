"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import InputSelect from "@/components/form/inputSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import React, { useState } from "react";

export default function AddEventPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [media, setMedia] = useState("");
  const [heldOn, setHeldOn] = useState("");
  const [budget, setBudget] = useState("");
  return (
    <div>
      <HeadTitle title={"Add Event"}>
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
          <form action="#">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <InputField
                  id={"name"}
                  name={"name"}
                  placeholder={"CCI SUMMIT"}
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
                  id={"media"}
                  name={"media"}
                  type={"file"}
                  value={media}
                  required
                  label={"Media"}
                  onChange={(e) => {
                    setMedia(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <InputSelect
                  id={"divisionId"}
                  name={"division"}
                  placeholder={"Web Development"}
                  type={"text"}
                  value={divisionId}
                  required
                  label={"Division"}
                  onChange={(e) => {
                    setDivisionId(e.target.value);
                  }}
                >
                  <option>Web Development</option>
                  <option>UI/UX Design</option>
                  <option>Data Resarch</option>
                  <option>Networking</option>
                </InputSelect>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <InputField
                  id={"heldOn"}
                  name={"heldOn"}
                  type={"month"}
                  value={heldOn}
                  required
                  label={"Held On"}
                  onChange={(e) => {
                    setHeldOn(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <InputField
                  id={"budget"}
                  name={"budget"}
                  placeholder={"0"}
                  type={"text"}
                  value={budget}
                  required
                  label={"Budget"}
                  onChange={(e) => {
                    setBudget(e.target.value);
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
