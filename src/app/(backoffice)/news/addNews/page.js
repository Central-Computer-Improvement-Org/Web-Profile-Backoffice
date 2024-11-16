"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
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

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z.string(),
  mediaUri: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "File size should not exceed 2MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
    }),
  detailnewsmedia: z
    .array(z.any()) // Validasi array file
    .refine((files) => files.length <= 5, {
      message: "You can only upload a maximum of 5 files for detailnewsmedia",
    })
    .refine((files) => files.every((file) => file?.size <= MAX_FILE_SIZE), {
      message: "Each file in detailnewsmedia should not exceed 2MB",
    })
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type)),
      {
        message:
          "Each file in detailnewsmedia must be a .jpg, .jpeg, .png, or .webp",
      }
    ),
});

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [multipleDatas, setMultipleDatas] = useState([]); // State untuk file lokal

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleValidationErrors = (errors) => {
    setValidations(
      errors.map((err) => ({ name: err.path[0], message: err.message }))
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");

    // Validasi menggunakan Zod schema
    const validation = formSchema.safeParse({
      title,
      description,
      mediaUri: mediaUrl,
      detailnewsmedia: multipleDatas,
    });

    if (!validation.success) {
      // Tangani error validasi dari Zod
      handleValidationErrors(validation.error.errors);
      toast.dismiss();
      toast.error("Invalid Input");
      setLoading(false);
      return;
    }

    // Jika validasi berhasil
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("mediaUri", mediaUrl);
    formData.append("isPublished", true);

    multipleDatas.forEach((file) => {
      formData.append("detailNewsMedia", file);
    });

    try {
      const response = await request.post("/cms/news", formData);
      console.log(response);

      if ([200, 201].includes(response?.data?.code)) {
        toast.dismiss();
        toast.success(response?.data?.data?.message);
        setLoading(false);
        router.push("/news");
      } else if (
        response?.data?.code === 400 &&
        response?.data?.status === "VALIDATION_ERROR"
      ) {
        setValidations(response?.data?.error?.validation);
        setMediaUrl(null);
        toast.dismiss();
        toast.error(response?.data?.error?.message);
      } else if (response?.data?.code === 500) {
        console.error("INTERNAL_SERVER_ERROR");
        toast.dismiss();
        toast.error(response?.data?.error?.message);
      }
    } catch (error) {
      console.error("Request failed", error);
      toast.dismiss();
      toast.error("An error occurred while saving data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);

    setMultipleDatas((prevFiles) => {
      if (prevFiles.length + files.length > 5) {
        setValidations((prev) => {
          const existingValidation = prev.find(
            (v) =>
              v.name === "Detail-media" &&
              v.message === "You can only upload a maximum of 5 files."
          );

          if (!existingValidation) {
            return [
              ...prev,
              {
                name: "Detail-media",
                message: "You can only upload a maximum of 5 files.",
              },
            ];
          }

          return prev; // Tidak menambahkan duplikasi
        });
        return prevFiles; // Tidak menambahkan file baru
      }
      return [...prevFiles, ...files];
    });

    // Clear input value to allow re-selecting the same files
    event.target.value = null;
  };

  const handleDeleteLocalImage = (index) => {
    setMultipleDatas((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <InputField
                    id="title"
                    name="title"
                    placeholder="Menuju Era Baru"
                    type="text"
                    value={title}
                    validations={validations}
                    required
                    label="Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id="media"
                    name="media"
                    type="file"
                    multiple={false}
                    validations={validations}
                    required
                    label="Thumbnail Media"
                    onChange={(e) => setMediaUrl(e.target.files[0] || null)}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <RichTextEditor
                    id="description"
                    name="description"
                    placeholder="e.g Description ..."
                    value={description}
                    required
                    label="Description"
                    onChange={setDescription}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputField
                    id="Detail-media"
                    name="Detail-media"
                    type="image"
                    multiple
                    value=""
                    multipleDatas={multipleDatas}
                    onChange={handleChange}
                    placeholder="Select files"
                    label="Upload Files"
                    handleDeleteLocalImage={handleDeleteLocalImage} // Dihubungkan ke fungsi hapus lokal
                    validations={validations}
                  />
                </div>
                <div className="sm:col-span-6">
                  <DefaultButton
                    size="small"
                    status="primary"
                    title="Save all"
                    type="submit"
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
