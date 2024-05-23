"use client";
import DefaultButton from "@/components/button/defaultButton";
import DefaultLink from "@/components/link/defaultLink";
import InputField from "@/components/form/inputField";
import InputSelect from "@/components/form/inputSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import request from "@/app/utils/request";

import { toast } from "react-hot-toast";

import { z } from "zod";

const MAX_FILE_SIZE = 2000000;
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
const LIMIT = 9999999;
const page = 1;

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(15, { message: "Name must be at most 15 characters long." }),
  imageUri: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  divisions: z
    .array(z.string())
    .min(1, { message: "Division must be at least 1." }),

  budget: z.number().min(0, { message: "Budget must be at least 0." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(255, { message: "Description must be at most 255 characters long." }),
});

export default function EditEventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  // State untuk menyimpan data event
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [divisions, setDivisions] = useState("");
  const [heldOn, setHeldOn] = useState("");
  const [budget, setBudget] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");

  const [oldData, setOldData] = useState([]);
  const [divisionsData, setDivisionsData] = useState([]);

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  const fetchDivisions = useCallback(async () => {
    const payload = {
      page: page,
      limit: LIMIT,
      ordering: ORDERING,
      sort: SORT,
    };
    request
      .get("/cms/users/divisions", payload)
      .then(function (response) {
        setDivisionsData(
          response.data.data.map((data) => ({
            value: data.id,
            label: data.name,
          }))
        );
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const fetchData = useCallback(async () => {
    const payload = {
      id: id,
    };
    request
      .get("/cms/events", payload)
      .then(function (response) {
        const data = response.data.data;

        setName(data.name);
        setDivisions(data.divisions);
        setHeldOn(data.heldOn);
        setBudget(data.budget);

        setDescription(data.description);

        setOldData(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) {
      router.push("/project");
      return;
    }
    fetchData();
    fetchDivisions();
  }, [id, router, fetchData, fetchDivisions]);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    const requestBody = {
      name: name,
      mediaUri: mediaUri,
      divisions: divisions.map((data) => data.value),
      heldOn: moment(heldOn).format("MM-YYYY"),
      budget: Number(budget),
      isActive: isActive,
      description: description,
    };

    if (imageUri !== null && imageUri !== "") {
      requestBody.imageUri = imageUri;
    }

    try {
      const validation = formSchema.safeParse(requestBody);
      if (!validation.success) {
        validation.error.errors.map((validation) => {
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
        toast.error("Invalid Input.");
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error("Something went wrong!");
      console.error(error);
    }

    requestBody.divisions = JSON.stringify(requestBody.divisions);

    request
      .patch(`/cms/events?id=${id}`, requestBody)
      .then(function (response) {
        console.log(response);
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push("/event");
        } else if (
          response.response.data.code === 400 &&
          response.response.data.status == "VALIDATION_ERROR"
        ) {
          setValidations(response.response.data.error.validation);
          setImageUri("");
          toast.dismiss();
          toast.error(response.response.data.error.message);
        } else if (response.response.data.code === 500) {
          console.error("INTERNAL_SERVER_ERROR");
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <HeadTitle title={"Edit Event"}>
        {loading ? (
          <div className="text-center">Loading...</div> // Tampilkan pesan loading jika data sedang dimuat
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-10 gap-6">
                <div className="col-span-10 sm:col-span-7">
                  <InputField
                    id={"name"}
                    name={"name"}
                    placeholder={"e.g Gemastik"}
                    type={"text"}
                    value={name}
                    validations={validations}
                    required
                    label={"Name"}
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
                    multiple={false}
                    label={"Media"}
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
                <div className="col-span-10 sm:col-span-3">
                  <InputMultipleSelect
                    id={"divisions"}
                    label={"Division"}
                    name={"divisions"}
                    validations={validations}
                    onChange={(selectedOptions) => {
                      if (selectedOptions) {
                        setDivisions(
                          selectedOptions.map((option) => option.value)
                        );
                      } else {
                        setDivisions([]);
                      }
                    }}
                    option={divisionsData.map((data) => ({
                      value: data.id,
                      label: data.name,
                    }))}
                  />
                </div>
                <div className="col-span-10 sm:col-span-2">
                  <InputField
                    id={"heldOn"}
                    name={"heldOn"}
                    type={"month"}
                    value={heldOn}
                    label={"Held On"}
                    onChange={(e) => {
                      setHeldOn(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-10 sm:col-span-3">
                  <InputField
                    id={"budget"}
                    name={"budget"}
                    placeholder={"e.g 1000000"}
                    type={"number"}
                    value={budget}
                    validations={validations}
                    required
                    label={"Budget"}
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
                    required
                    label={"Status"}
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
