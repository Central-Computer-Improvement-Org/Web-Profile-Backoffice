"use client";
import DefaultButton from "@/components/button/defaultButton";
import DefaultLink from "@/components/link/defaultLink";
import InputField from "@/components/form/inputField";
import HeadTitle from "@/components/headTitle";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import request from "@/app/utils/request";

import { z } from "zod";
import toast from "react-hot-toast";
import InputRich from "@/components/form/InputRich";

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
    .max(100, { message: "Title must be at most 100 characters long" })
    .optional(),
  description: z.string().optional(),
  mediaUri: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "File size should not exceed 2MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
    })
    .optional(),
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
    )
    .optional(),
});

export default function EditNewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [multipleDatas, setMultipleDatas] = useState([]); // State untuk file lokal
  const [valueMultiple, setValueMultiple] = useState([]);

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  const fetchDetailNews = useCallback(() => {
    if (!id) {
      router.push("/news");
      return;
    }

    setLoading(true);
    request
      .get(`/cms/news?id=${id}`)
      .then((response) => {
        const data = response.data.data;
        setTitle(data?.title || "");
        setDescription(data?.description || "");
        setMediaUrl(data?.mediaUri || "");
        setValueMultiple(data?.detailNewsMedia || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news data:", error);
        setLoading(false);
      });
  }, [id, router]);

  useEffect(() => {
    fetchDetailNews();
  }, [fetchDetailNews]);

  const handleValidationErrors = (errors) => {
    // This will display the validation errors in the console or you can update UI accordingly
    errors.forEach((error) => {
      console.error(error.message); // Log each error message
      setValidations((prevValidations) => [
        ...prevValidations,
        { name: error.path[0], message: error.message },
      ]);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");

    // Prepare data for validation
    const dataToValidate = {
      title,
      description,
    };

    // Conditionally add mediaUri if it's not empty
    if (thumbnail) {
      dataToValidate.mediaUri = thumbnail;
    }

    // Conditionally add detailnewsmedia if it's not empty
    if (multipleDatas.length > 0) {
      dataToValidate.detailnewsmedia = multipleDatas;
    }

    // Perform validation using the dynamic data object
    const validation = formSchema.safeParse(dataToValidate);

    if (!validation.success) {
      // Handle validation errors
      handleValidationErrors(validation.error.errors);
      toast.dismiss();
      toast.error("Invalid Input");
      setLoading(false);
      return;
    }

    // If validation is successful, proceed with form submission
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // Only append mediaUri if it exists
    if (thumbnail) {
      formData.append("mediaUri", thumbnail);
    }

    // Only append detailnewsmedia if there are files
    if (multipleDatas != []) {
      multipleDatas.forEach((file) => {
        formData.append("detailNewsMedia", file);
      });
    }

    try {
      const response = await request.patch(`/cms/news?id=${id}`, formData);
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

    // Total files including existing files in valueMultiple and multipleDatas
    const totalFiles = valueMultiple.length + multipleDatas.length;

    // Check if total files exceed the limit (5 files)
    if (totalFiles + files.length > 5) {
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

        return prev; // Do not add duplicates
      });
      return; // Do not proceed with file selection
    }

    // Allow adding files to multipleDatas if total files are less than 5
    setMultipleDatas((prevFiles) => {
      // Add new files only if we have space (less than 5 total)
      return [...prevFiles, ...files];
    });
  };

  const handleDeleteLocalImage = (index) => {
    setMultipleDatas((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onDelete = async (id) => {
    setLoading(true);
    toast.loading("Deleting data...");

    try {
      const response = await request.delete(
        `/cms/news/detail-news-media?id=${id}`
      );
      const { code, status, data, error } = response.data;

      if (code === 200 || code === 201) {
        toast.dismiss();
        toast.success(data?.message);
        fetchDetailNews(); // Fetch data untuk memperbarui daftar
      } else {
        const formattedStatus = status
          .split("_")
          .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        toast.dismiss();
        toast.error(
          `${formattedStatus}: ${error?.message || "An error occurred"}`
        );
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while deleting data");
    } finally {
      setLoading(false);
    }
  };

  console.log(multipleDatas);
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
                    multiple={true}
                    validations={validations}
                    previewImage={mediaUrl}
                    label={"Media"}
                    onChange={(e) => {
                      setThumbnail(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputRich
                    id="description"
                    name="description"
                    placeholder="e.g Description ..."
                    value={description}
                    required
                    label="Description"
                    onChange={(htmlContent) => {
                      setDescription(htmlContent); // Simpan htmlContent di variabel description
                    }}
                  />
                  {/* <RichTextEditor
                    id={"description"}
                    name={"description"}
                    placeholder={"e.g Description ..."}
                    value={description}
                    label={"Description"}
                    onChange={(htmlContent) => {
                      setDescription(htmlContent); // Simpan htmlContent di variabel description
                    }}
                  /> */}
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputField
                    id="Detail-media"
                    name="Detail-media"
                    type="file"
                    multiple
                    value=""
                    multipleDatas={multipleDatas}
                    valueMultiple={valueMultiple}
                    onChange={handleChange}
                    placeholder="Select files"
                    label="Upload Files"
                    handleDeleteImage={onDelete}
                    handleDeleteLocalImage={handleDeleteLocalImage}
                    validations={validations}
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
