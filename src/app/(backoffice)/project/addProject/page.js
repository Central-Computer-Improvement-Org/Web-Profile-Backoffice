"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import InputMultipleSelect from "@/components/form/inputMultipleSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";

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
    .max(20, { message: "Name must be at most 20 characters long." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(100, { message: "Description must be at most 100 characters long." }),
  productionUri: z
    .string()
    .url({ message: "Production Uri must be a valid Uri." }),
  repositoryUri: z
    .string()
    .url({ message: "Repository Uri must be a valid Uri." }),
  budget: z.number().min(0, { message: "Budget must be at least 0." }),
  contributor: z
    .array(z.number())
    .min(1, { message: "Contributor must be at least 1." }),
  divisions: z
    .array(z.string())
    .min(1, { message: "Division must be at least 1." }),
  imageUri: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  iconUri: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export default function AddProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productionUri, setProductionUri] = useState();
  const [repositoryUri, setRepositoryUri] = useState();
  const [budget, setBudget] = useState();
  const [contributor, setContributor] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [imageUri, setImageUri] = useState("");
  const [iconUri, setIconUri] = useState("");

  const [divisionsData, setDivisionsData] = useState([]);
  const [membersData, setMembersData] = useState([]);

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    const payload = {
      page: page,
      limit: LIMIT,
      ordering: ORDERING,
      sort: SORT,
    };
    request
      .get("/cms/users", payload)
      .then(function (response) {
        setMembersData(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

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
        setDivisionsData(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchDivisions();
    setLoading(false);
  }, [fetchMembers, fetchDivisions]);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        name: name,
        description: description,
        productionUri: productionUri,
        repositoryUri: repositoryUri,
        budget: Number(budget),
        contributor: contributor,
        divisions: divisions,
        imageUri: imageUri,
        iconUri: iconUri,
      });

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
      console.error(error);
    }

    request
      .post("/cms/projects", {
        name: name,
        description: description,
        productionUri: productionUri,
        repositoryUri: repositoryUri,
        budget: budget,
        contributors: JSON.stringify(contributor),
        divisions: JSON.stringify(divisions),
        imageUri: imageUri,
        iconUri: iconUri,
      })
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push("/project");
        } else if (
          response.data.data.code === 400 &&
          response.data.data.status == "VALIDATION_ERROR"
        ) {
          setValidations(response.data.data.error.validation);
          setImageUri("");
          setIconUri("");
          toast.dismiss();
          toast.error(response.data.data.error.message);
        } else if (response.data.data.code === 500) {
          console.error("INTERNAL_SERVER_ERROR");
          toast.dismiss();
          toast.error(response.data.data.error.message);
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <HeadTitle>
        {loading ? (
          // center the text
          <div className="text-center flex">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                <div className="sm:col-span-6">
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
                <div className="sm:col-span-6">
                  <InputField
                    id={"productionUri"}
                    name={"productionUri"}
                    placeholder={"e.g https://example.com/"}
                    type={"text"}
                    value={productionUri}
                    validations={validations}
                    required
                    label={"Production Uri"}
                    onChange={(e) => {
                      setProductionUri(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={"repositoryUri"}
                    name={"repositoryUri"}
                    placeholder={"e.g https://example.com/"}
                    type={"text"}
                    value={repositoryUri}
                    validations={validations}
                    required
                    label={"Repository Uri"}
                    onChange={(e) => {
                      setRepositoryUri(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
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
                <div className="sm:col-span-6">
                  <TextareaField
                    id={"description"}
                    name={"description"}
                    placeholder={"e.g Description ..."}
                    value={description}
                    validations={validations}
                    required
                    label={"Description"}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
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
                <div className="col-span-6 sm:col-span-3">
                  <InputMultipleSelect
                    id={"contributor"}
                    label={"Contributor"}
                    name={"contributor"}
                    validations={validations}
                    onChange={(selectedOptions) => {
                      if (selectedOptions) {
                        setContributor(
                          selectedOptions.map((option) => Number(option.value))
                        );
                      } else {
                        setContributor([]);
                      }
                    }}
                    option={membersData.map((data) => ({
                      value: data.nim,
                      label: `${data.nim} - ${data.name}`,
                    }))}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={"imageUri"}
                    name={"imageUri"}
                    type={"image"}
                    multiple={false}
                    label={"Image"}
                    required
                    validations={validations}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setImageUri(img);
                      }
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={"iconUri"}
                    name={"iconUri"}
                    type={"image"}
                    multiple={false}
                    label={"Icon"}
                    required
                    validations={validations}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setIconUri(img);
                      }
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
