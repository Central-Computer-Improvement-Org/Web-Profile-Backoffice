"use client";
import DefaultButton from "@/components/button/defaultButton";
import DefaultLink from "@/components/link/defaultLink";
import InputField from "@/components/form/inputField";
// import RichTextEditor from "@/components/form/inputRichText";
import InputSelect from "@/components/form/inputSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import request from "@/app/utils/request";

import dynamic from "next/dynamic";
import { z } from "zod";
import toast from "react-hot-toast";

const RichTextEditor = dynamic(
  () => import("@/components/form/inputRichText"),
  {
    ssr: false,
  }
);

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z.string(),
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
});

export default function EditNewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  // State untuk menyimpan data event
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  useEffect(() => {
    if (!id) {
      router.push("/news");
      return;
    }
    request
      .get(`/cms/news?id=${id}`)
      .then(function (response) {
        const data = response.data.data;
        setTitle(data?.title);
        setDescription(data?.description);
        setMediaUrl(data?.mediaUri);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id, router]);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Updating data...");
    e.preventDefault();

    const requestBody = {
      title: title,
      description: description,
    };

    if (mediaUrl !== null && mediaUrl !== "") {
      requestBody.mediaUrl = mediaUrl;
    }

    try {
      const validation = formSchema.safeParse(requestBody);
      if (!validation.success) {
        setValidations(
          validation.error.errors.map((error) => ({
            name: error.path[0],
            message: error.message,
          }))
        );
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

    request
      .patch(`/cms/news?id=${id}`, requestBody)
      .then((response) => {
        const { code, status, data, error } = response.data;
        if (code === 200 || code === 201) {
          toast.dismiss();
          toast.success(data?.message);
          router.push("/news");
        } else {
          const formattedStatus = status
            .split("_")
            .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
          if (code === 400 && status === "VALIDATION_ERROR") {
            setValidations(error?.validation);
            setMediaUrl("");
          }
          toast.dismiss();
          toast.error(
            `${formattedStatus}: ${error?.message || "An error occurred"}`
          );
        }
        setLoading(false);
      })
      .catch(function (error) {
        toast.dismiss();
        toast.error(error?.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="text-center">Loading...</div> // Tampilkan pesan loading jika data sedang dimuat
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <InputField
                    id={"title"}
                    name={"title"}
                    placeholder={"Menuju Era Baru"}
                    type={"text"}
                    value={title}
                    validations={validations}
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
                    // value={mediaUrl}
                    multiple={true}
                    validations={validations}
                    previewImage={mediaUrl}
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
                    label={"Description"}
                    onChange={(htmlContent) => {
                      setDescription(htmlContent); // Simpan htmlContent di variabel description
                    }}
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
