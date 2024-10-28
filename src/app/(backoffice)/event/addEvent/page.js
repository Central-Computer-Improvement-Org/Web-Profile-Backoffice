"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import moment from "moment";

import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import TextareaField from "@/components/form/textareaField";
import InputSelect from "@/components/form/inputSelect";
import InputField from "@/components/form/inputField";
import HeadTitle from "@/components/headTitle";

const MAX_FILE_SIZE = 2000000; // 2MB
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
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),
  mediaUri: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  budget: z.number().min(0, { message: "Budget must be at least 0" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(255, { message: "Description must be at most 255 characters long" }),
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

    request.get(`/cms/users/divisions`, payload)
    .then(function (response) {
      setDivisionDatas(response.data.data);
      setLoading(false);
    })
    .catch(function (error) {
      console.error(error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDivisions();
    setLoading(false);
  }, [fetchDivisions]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");

    try {
      const validation = formSchema.safeParse({
        name: name,
        mediaUri: mediaUri,
        budget: Number(budget),
        description: description,
      });

      if (!validation.success) {
        setValidations(validation.error.errors.map(error => ({
          name: error.path[0],
          message: error.message
        })));
        toast.dismiss();
        toast.error('Invalid Input');
        setLoading(false);
        return;
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      setLoading(false);
      return;
    };

    request.post(`/cms/events`, {
      name: name,
      description: description,
      divisionId: divisionId,
      mediaUri: mediaUri,
      heldOn: heldOn ? moment(heldOn).format("DD-MM-YYYY") : null,
      budget: Number(budget),
      isActive: isActive,
    }).then(function (response) {
      const { code, status, data, error } = response.data || {};

      if (code === 200 || code === 201) {
        toast.dismiss();
        toast.success(data?.message);
        router.push('/event');
      } else {
        const formattedStatus = status
          .split('_')
          .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        if (code === 400 && status === 'VALIDATION_ERROR') {
          setValidations(error?.validation);
          setMediaUri('');
        }
        toast.dismiss();
        toast.error(`${formattedStatus}: ${error?.message || 'An error occurred'}`);
      }
      setLoading(false);
    }).catch((error) => {
      toast.dismiss();
      const errorMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
      setLoading(false);
    });
  };

  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="flex text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-10 gap-6">
                <div className="col-span-10 sm:col-span-7">
                  <InputField
                    id={"name"}
                    name={"name"}
                    type={"text"}
                    placeholder={"e.g Gemastik"}
                    label={"Name"}
                    value={name}
                    validations={validations}
                    required
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
                    label={"Media"}
                    validations={validations}
                    required
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
                    label={"Division"}
                    value={divisionId}
                    required
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
                    label={"Held On"}
                    value={heldOn}
                    required
                    onChange={(e) => {
                      setHeldOn(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-10 sm:col-span-3">
                  <InputField
                    id={"budget"}
                    name={"budget"}
                    type={"number"}
                    placeholder={"e.g 1000000"}
                    label={"Budget"}
                    value={budget}
                    validations={validations}
                    required
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
                    label={"Status"}
                    required
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
                    label={"Description"}
                    value={description}
                    validations={validations}
                    required
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
};