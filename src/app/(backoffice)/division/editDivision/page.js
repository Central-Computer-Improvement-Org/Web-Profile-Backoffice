"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import request from "@/app/utils/request";
import toast from "react-hot-toast";

import { z } from "zod";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name : z
    .string()
    .min(3, { message: "Name must be at least 3 characters long."})
    .max(30, { message: "Name must be at most 30 characters long."}),
  logoUri: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `The maximum file size that can be uploaded is 2MB`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  description : z
    .string()
    .min(3, { message: "Description must be at least 3 characters long."})
    .max(255, { message: "Description must be at most 255 characters long."}),
})


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
    toast.loading("Saving data...");
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        name: name,
        logoUri: logoUri,
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
          setValidations(validations => [...validations, ...key]);
        })
        setLoading(false);
        toast.dismiss();
        toast.error("Invalid Input.");
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error("Something went wrong!");
      console.error(error);
    }

    const requestBody = {
      name: name,
      description: description,
    };
  
    if (logoUri !== null && logoUri !== "") {
      requestBody.logoUri = logoUri;
    }

    request
      .patch(`/cms/users/divisions?id=${id}`, 
        requestBody
      )
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push("/division");
        } else if (response.response.data.code === 400 && response.response.data.status == "VALIDATION_ERROR") {
          setValidations(response.response.data.error.validation);
          setLogoUri("");
          toast.dismiss();
          toast.error(response.response.data.error.message);
        } else if (response.response.data.code === 500 ) {
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false)
      })
  }

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
                    validations={validations}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={"logoUri"}
                    name={"logoUri"}
                    type={"image"}
                    multiple={false}
                    previewImage={oldData.logoUri}
                    imageOnly={true}
                    label={"Logo"}
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
