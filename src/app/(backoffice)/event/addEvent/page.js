"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import InputSelect from "@/components/form/inputSelect";
import InputMultipleSelect from "@/components/form/inputMultipleSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import moment from "moment";

import { toast } from "react-hot-toast";

import { z } from "zod";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Sorting Constants
const ORDERING = "name";
const SORT = "asc";

// Pagination Constants
const LIMIT = 100;
const PAGE = 1;

const defaultPayload = {
  page: PAGE,
  limit: LIMIT,
};

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(255, { message: "Name must be at most 255 characters long." }),
  mediaUri: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  budget: z.number().min(0, { message: "Budget must be at least 0." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(255, { message: "Description must be at most 255 characters long." }),
});

export default function AddEventPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [mediaUri, setMediaUri] = useState("");
  const [divisionId, setDivisionId] = useState([]);
  const [heldOn, setHeldOn] = useState("");
  const [budget, setBudget] = useState();
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");

  const [divisionDatas, setDivisionDatas] = useState([]);

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDivisions = async () => {
    const payload = {
      ...defaultPayload,
      ordering: "name",
      sort: "desc",
    };

    request
      .get(`/cms/users/divisions`, payload)
      .then(function (response) {
        setDivisionDatas(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDivisions();
    setLoading(false);
  }, [fetchDivisions]);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        name: name,
        mediaUri: mediaUri,
        budget: Number(budget),
        description: description,
      });

      if (!validation.success) {
        validation.error.errors.map((validation) => {
          const key = [
            {
              name: validation.path[0],
              message: validation.message,
            },
          ];
          setValidations((validations) => [...validations, ...key]);
        });
        setLoading(false);
        toast.dismiss();
        toast.error("Invalid Input.");
        return;
      }
    } catch (error) {
      console.error(error);
    }

    request
      .post(`/cms/events`, {
        name: name,
        description: description,
        divisionId: divisionId,
        mediaUri: mediaUri,
        heldOn: moment(heldOn).format("DD-MM-YYYY"),
        budget: Number(budget),
        isActive: isActive,
      })
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push("/event");
        } else if (
          response.response.data.code === 400 &&
          response.response.data.status == "VALIDATION_ERROR"
        ) {
          setValidations(response.response.data.error.validation);
          setMediaUri("");
          toast.dismiss();
          toast.error(response.response.data.error.message);
        } else if (response.response.data.code === 500) {
          console.error("INTERNAL_SERVER_ERROR");
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <HeadTitle>
        {loading ? (
          // center the text
          <div className="text-center flex">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-10 gap-6">
                <div className="col-span-10 sm:col-span-7">
                  <InputField
                    id={"name"}
                    name={"name"}
                    placeholder={"e.g Gemastik"}
                    type={"text"}
                    value={name}
                    validations={validations}
                    required
                    label={"Name"}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-10 sm:col-span-3">
                  <InputField
                    id={"mediaUri"}
                    name={"mediaUri"}
                    type={"image"}
                    multiple={false}
                    label={"Media"}
                    required
                    validations={validations}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setMediaUri(img);
                      }
                    }}
                  />
                </div>
                <div className="col-span-10 sm:col-span-3">
                  <InputSelect
                    id={"divisionId"}
                    name={"divisionId"}
                    type={"text"}
                    value={divisionId}
                    required
                    label={"Division"}
                    onChange={(e) => {
                      setDivisionId(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select Division
                    </option>
                    {divisionDatas &&
                      divisionDatas.map((data, index) => (
                        <option key={index} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                  </InputSelect>
                </div>
                <div className="col-span-10 sm:col-span-2">
                  <InputField
                    id={"heldOn"}
                    name={"heldOn"}
                    type={"date"}
                    value={heldOn}
                    label={"Held On"}
                    onChange={(e) => {
                      setHeldOn(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-10 sm:col-span-3">
                  <InputField
                    id={"budget"}
                    name={"budget"}
                    placeholder={"e.g 1000000"}
                    type={"number"}
                    value={budget}
                    validations={validations}
                    required
                    label={"Budget"}
                    onChange={(e) => {
                      setBudget(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-10 sm:col-span-2">
                  <InputSelect
                    id={"isActive"}
                    name={"isActive"}
                    value={isActive}
                    required
                    label={"Status"}
                    onChange={(e) => {
                      setIsActive(e.target.value);
                    }}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </InputSelect>
                </div>
                <div className="col-span-10 sm:col-span-10">
                  <TextareaField
                    id={"description"}
                    name={"description"}
                    placeholder={"e.g Description ..."}
                    value={description}
                    required
                    label={"Description"}
                    validations={validations}
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
                    disabled={loading}
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
