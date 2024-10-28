"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";

import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import TextareaField from "@/components/form/textareaField";
import InputField from "@/components/form/inputField";
import HeadTitle from "@/components/headTitle";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name : z
    .string()
    .min(3, { message: "Name must be at least 3 characters long"})
    .max(30, { message: "Name must be at most 30 characters long"}),
  logoUri: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `The maximum file size that can be uploaded is 2MB`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  description : z
    .string()
    .min(3, { message: "Description must be at least 3 characters long"})
    .max(255, { message: "Description must be at most 255 characters long"}),
});


export default function EditDivisionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const [oldData, setOldData] = useState([]);
  const [name, setName] = useState("");
  const [logoUri, setLogoUri] = useState("");
  const [description, setDescription] = useState("");
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Updating data...");
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        name: name,
        logoUri: logoUri,
        description: description,
      });

      if (!validation.success) {
        setValidations(validation.error.errors.map(error => ({
          name: error.path[0],
          message: error.message
        })));
        toast.dismiss();
        toast.error("Invalid Input");
        setLoading(false);
        return;
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const requestBody = {
      name: name,
      description: description,
    };
  
    if (logoUri !== null && logoUri !== "") {
      requestBody.logoUri = logoUri;
    }

    request.patch(`/cms/users/divisions?id=${id}`, requestBody)
    .then(function (response) {
      const { code, status, data, error } = response.data;

      if (code === 200 || code === 201) {
        toast.dismiss();
        toast.success(data?.message);
        router.push('/division');
      } else {
        const formattedStatus = status
          .split('_')
          .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        if (code === 400 && status === 'VALIDATION_ERROR') {
          setValidations(error?.validation);
          setLogoUri("");
        }
        toast.dismiss();
        toast.error(`${formattedStatus}: ${error?.message || 'An error occurred'}`);
      }
      setLoading(false);
    }).catch(function (error) {
      toast.dismiss();
      toast.error(error?.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!id) {
      router.push("/division");
      return;
    }
    request
      .get(`/cms/users/divisions?id=${id}`)
      .then(function (response) { 
        const data = response.data.data;
        setName(data.name);
        setDescription(data.description);
        setLoading(false);
        setOldData(data);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id, router]);
  
  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="col-span-6 sm:col-span-4">
                  <InputField
                    id={"name"}
                    name={"name"}
                    type={"text"}
                    placeholder={"Web Development"}
                    label={"Name"}
                    value={name}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={"logoUri"}
                    name={"logoUri"}
                    label={"Logo"}
                    type={"image"}
                    multiple={false}
                    imageOnly={true}
                    previewImage={oldData.logoUri}
                    validations={validations}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setLogoUri(img);
                      }
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
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