"use client";
import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import InputMultipleSelect from "@/components/form/inputMultipleSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    .refine((file) => file?.size <= MAX_FILE_SIZE, `The maximum file size that can be uploaded is 2MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  description : z
    .string()
    .min(3, { message: "Description must be at least 3 characters long."})
    .max(255, { message: "Description must be at most 255 characters long."}),
})

export default function AddDevisionPage() {
  const router = useRouter();

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
      console.error(error);
    }

    request
      .post(`/cms/users/divisions`, {
        name: name,
        logoUri: logoUri,
        description: description,
      })
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
          console.error("INTERNAL_SERVER_ERROR")
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false)
      })
  }


  useEffect(() => {
      setLoading(false);
  }, []);

  return (
    <div>
      <HeadTitle title={"Add Division"}>
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
                  label={"Logo"}
                  required
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
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </div>
      </HeadTitle>
    </div>
  );
}
