"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import HeadTitle from "@/components/headTitle";
import React, {useEffect, useState} from "react";

import dynamic from "next/dynamic";
import {z} from "zod";
import toast from "react-hot-toast";
import request from "@/app/utils/request";
import {useRouter} from "next/navigation";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// TODO: MOVE SCHEMAS TO INDEPENDENT PATTERN
const formSchema = z.object({
    title: z
        .string()
        .min(3, {message: "Title must be at least 3 characters long."})
        .max(30, {message: "Title must be at most 30 characters long."}),
    mediaUri: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `The maximum file size that can be uploaded is 2MB`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    description: z
        .string()
        .min(3, {message: "Description must be at least 3 characters long."})
})


export default function AddNewsPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [mediaUri, setMediaUri] = useState("");
    const [validations, setValidations] = useState([]);
    const [loading, setLoading] = useState(true);

    const onSubmit = async (e) => {
        setValidations([]);
        setLoading(true);
        toast.loading("Saving data...");
        e.preventDefault();

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
                console.info(description)

                validation.error.issues.forEach((err, id) => {
                    toast.error(err.message, {
                        id: id,
                        duration: 3000
                    });
                })
                return;
            }

            //   TODO: SET REQUEST HERE
            request
                .post(`/cms/news`, {
                    title: title,
                    mediaUri: mediaUri,
                    description: description,
                })
                .then(function (response) {
                    if (response.data?.code === 200 || response.data?.code === 201) {
                        toast.dismiss();
                        toast.success(response.data.data.message);
                        router.push("/news");
                    } else if (response.data.data.code === 400 && response.data.data.status == "VALIDATION_ERROR") {
                        setValidations(response.data.data.error.validation);
                        setMediaUri("");
                        toast.dismiss();
                        toast.error(response.data.data.error.message);

                    } else if (response.data.data.code === 500) {
                        console.error("INTERNAL_SERVER_ERROR")
                        toast.dismiss();
                        toast.error(response.data.data.error.message);
                    }
                    setLoading(false)
                })
        } catch (e) {
            console.error('FATAL : ' + e.message);
        }
    }

    useEffect(() => {
        setLoading(false);
    }, []);


    return (
        <div>
            <HeadTitle>
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
                                    validations={validations}
                                    label={"Title"}
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
                                    multiple={false}
                                    label={"Logo"}
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
                            <div className="sm:col-span-6">
                                <DefaultButton
                                    size={"small"}
                                    status={"primary"}
                                    title={"Save all"}
                                    type={"submit"}
                                    disabled={loading}
                                    onClick={() => {
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </HeadTitle>
        </div>
    );
}
