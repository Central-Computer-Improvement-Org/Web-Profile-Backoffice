"use client";
import DefaultButton from "@/components/button/defaultButton";
import DefaultLink from "@/components/link/defaultLink";
import InputField from "@/components/form/inputField";
import toast from "react-hot-toast";
import request from "@/app/utils/request";
import {z} from "zod";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import HeadTitle from "@/components/headTitle";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// TODO: MOVE SCHEMAS TO INDEPENDENT PATTERN
const formSchema = z.object({
    title: z
        .string()
        .min(3, {message: "Title must be at least 3 characters long."})
        .max(30, {message: "Title must be at most 30 characters long."}),
    mediaUri: z
        .union([z.any().nullable(), z.instanceof(File)])
        .refine((file) => file === null || file.size <= MAX_FILE_SIZE, {
            message: "The maximum file size that can be uploaded is 2MB",
        })
        .refine(
            (file) => file === null || ACCEPTED_IMAGE_TYPES.includes(file.type),
            { message: "Only .jpg, .jpeg, .png and .webp formats are supported." }
        ),
    description: z
        .string()
        .min(3, {message: "Description must be at least 3 characters long."})
})

export default function EditNewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  // State untuk menyimpan data event
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUri, setMediaUri] = useState(null);
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat
  const [oldData, setOldData] = useState([]);
    const onSubmit = async (e) => {
        e.preventDefault();
        setValidations([]);
        toast.loading("Saving data...");

        try {
            const validation = formSchema.safeParse({
                title: title,
                mediaUri: mediaUri,
                description: description
            })

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

                validation.error.issues.forEach((err, id) => {
                    toast.error(err.message, {
                        id: id,
                        duration: 3000
                    });
                })
                return;
            }

            request
                .patch(`/cms/news?id=${id}`, {
                    title: title,
                    mediaUri: mediaUri,
                    description: description,
                })
                .then(function (response) {
                    if (response.data?.code === 200 || response.data?.code === 201) {
                        toast.dismiss();
                        toast.success(response.data.data.message);
                        router.push("/news");
                    } else if (response.response.data.code === 400 && response.response.data.status == "VALIDATION_ERROR") {
                        setValidations(response.response.data.error.validation);
                        setMediaUri("");
                        toast.dismiss();
                        toast.error(response.response.data.error.message);

                    } else if (response.response.data.code === 500) {
                        console.error("INTERNAL_SERVER_ERROR")
                        toast.dismiss();
                        toast.error(response.response.data.error.message);
                    }
                    setLoading(false)
                })
        } catch (e) {
            console.error('FATAL : ' + e.message);
        }
    }

  useEffect(() => {
    if (!id) {
      router.push("/news");
      return;
    }
    request
      .get(`/news?id=${id}`)
      .then(function (response) {
        const data = response.data.data;
        setTitle(data.title);
        setDescription(data.description);
        setOldData(data);
        setLoading(false);
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
                    required
                    label={"Title"}
                    validations={validations}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                    <InputField
                        id={"mediaUri"}
                        name={"mediaUri"}
                        type={"image"}
                        previewImage={oldData.mediaUri}
                        multiple={false}
                        label={"Media thumbnail"}
                        validations={validations}
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const img = e.target.files[0];
                                setMediaUri(img);
                            }
                        }}
                    />
                </div>
                <div className="col-span-6 sm:col-span-6">
                    <InputField
                        id={"description"}
                        name={"description"}
                        placeholder={"e.g Description ..."}
                        value={description}
                        type={'richTextEditor'}
                        required
                        validations={validations}
                        label={"Description"}
                        onChange={(e) => {
                            setDescription(e);
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
