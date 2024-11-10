"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
// import RichTextEditor from "@/components/form/inputRichText";
import HeadTitle from "@/components/headTitle";
import React, { useState } from "react";

import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import request from "@/app/utils/request";
import { z } from "zod";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(
  () => import("@/components/form/inputRichText"),
  {
    ssr: false,
  }
);

const LIMIT = 100;
const PAGE = 1;

const defaultPayload = {
  page: PAGE,
  limit: LIMIT,
};

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
      (file) => file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [detailsMedia, setDetailsMedia] = useState([]);
  console.log(detailsMedia);

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // const onSubmit = async (e) => {
  //   setValidations([]);
  //   setLoading(true);
  //   toast.loading("Saving data...");
  //   e.preventDefault();

  //   try {
  //     const validation = formSchema.safeParse({
  //       title: title,
  //       description: description,
  //       mediaUri: mediaUrl,
  //     });

  //     if (!validation.success) {
  //       validation.error.errors.map((validation) => {
  //         const key = [
  //           {
  //             name: validation.path[0],
  //             message: validation.message,
  //           },
  //         ];
  //         setValidations((validations) => [...validations, ...key]);
  //       });
  //       setLoading(false);
  //       toast.dismiss();
  //       toast.error("Invalid Input");
  //       return;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   const formData = new FormData();
  //   formData.append("title", title);
  //   formData.append("description", description);
  //   formData.append("mediaUri", mediaUrl);
  //   formData.append("isPublished", true);

  //   // Append each file in detailsMedia to FormData
  //   detailsMedia.forEach((file, index) => {
  //     formData.append(`detailNewsMedia`, file);
  //   });

  //   console.log(formData);
  //   request.post("/cms/news", formData).then(function (response) {
  //     if (response?.data?.code === 200 || response?.data?.code === 201) {
  //       toast.dismiss();
  //       toast.success(response?.data?.data?.message);
  //       router.push("/news");
  //     } else if (
  //       response?.data?.code === 400 &&
  //       response?.data?.status == "VALIDATION_ERROR"
  //     ) {
  //       setValidations(response?.data?.error?.validation);
  //       setMediaUrl("");
  //       toast.dismiss();
  //       toast.error(response?.data?.error?.message);
  //     } else if (response?.data?.code === 500) {
  //       console.error("INTERNAL_SERVER_ERROR");
  //       toast.dismiss();
  //       toast.error(response?.data?.error?.message);
  //     }
  //     setLoading(false);
  //   });
  // };

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        title: title,
        description: description,
        mediaUri: mediaUrl,
      });

      if (!validation.success) {
        validation.error.errors.forEach((validation) => {
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
        toast.error("Invalid Input");
        return;
      }
    } catch (error) {
      console.error(error);
    }

    // Creating FormData for file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("mediaUri", mediaUrl);
    formData.append("isPublished", "true");

    // Append each file with the same key "detailNewsMedia"
    detailsMedia.forEach((file) => {
      formData.append("detailNewsMedia", file);
    });
    // const images = new FormData();
    // detailsMedia.forEach((file) => {
    //   images.append("files", file);
    // });
    // console.log(images);
    // Making the request
    request
      .post("/cms/news", formData)
      .then(function (response) {
        if (response?.data?.code === 200 || response?.data?.code === 201) {
          toast.dismiss();
          toast.success(response?.data?.data?.message);
          router.push("/news");
        } else if (
          response?.data?.code === 400 &&
          response?.data?.status === "VALIDATION_ERROR"
        ) {
          setValidations(response?.data?.error?.validation);
          setMediaUrl("");
          toast.dismiss();
          toast.error(response?.data?.error?.message);
        } else if (response?.data?.code === 500) {
          console.error("INTERNAL_SERVER_ERROR");
          toast.dismiss();
          toast.error(response?.data?.error?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Request failed", error);
        toast.dismiss();
        toast.error("An error occurred while saving data");
        setLoading(false);
      });
  };

  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="text-center">Loading...</div>
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
                    // value={mediaUrl}
                    multiple={false}
                    validations={validations}
                    required
                    label={"Thumbnail Media"}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setMediaUrl(img);
                      }
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
                    onChange={(htmlContent) => {
                      setDescription(htmlContent); // Simpan htmlContent di variabel description
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputField
                    id={"detailsMedia"}
                    name={"detailsMedia"}
                    type={"image"}
                    // value={mediaUrl}
                    multiple={true}
                    multipleDatas={detailsMedia}
                    validations={validations}
                    required
                    label={"Details Media"}
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files);

                      // Jika total file yang ada + yang baru dipilih melebihi 5, batasi file baru yang ditambahkan
                      if (selectedFiles.length + detailsMedia.length > 5) {
                        toast.error("You can only select up to 5 files.");
                        const remainingSlots = 5 - detailsMedia.length;
                        setDetailsMedia((prevFiles) => [
                          ...prevFiles,
                          ...selectedFiles.slice(0, remainingSlots),
                        ]);
                      } else {
                        setDetailsMedia((prevFiles) => [
                          ...prevFiles,
                          ...selectedFiles,
                        ]);
                      }
                    }}
                    onClickDelete={(index) => {
                      setDetailsMedia((prevFiles) =>
                        prevFiles.filter((_, i) => i !== index)
                      );
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
        )}
      </HeadTitle>
    </div>
  );
}
