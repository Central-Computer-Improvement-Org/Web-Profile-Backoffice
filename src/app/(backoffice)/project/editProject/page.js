"use client";
import DefaultButton from "@/components/button/defaultButton";
import InputField from "@/components/form/inputField";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import InputMultipleSelect from "@/components/form/inputMultipleSelect";
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
    .max(20, { message: "Name must be at most 20 characters long." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(100, { message: "Description must be at most 100 characters long." }),
  productionUri: z
    .string()
    .url({ message: "Production Uri must be a valid Url." }),
  repositoryUri: z
    .string()
    .url({ message: "Repository Uri must be a valid Url." }),
  budget: z.number().min(0, { message: "Budget must be at least 0." }),
  contributors: z
    .array(z.number())
    .min(1, { message: "Contributor must be at least 1." }),
  divisions: z
    .array(z.string())
    .min(1, { message: "Division must be at least 1." }),
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
  iconUri: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export default function EditProjectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productionUri, setProductionUri] = useState("");
  const [repositoryUri, setRepositoryUri] = useState("");
  const [budget, setBudget] = useState("");
  const [contributor, setContributor] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [imageUri, setImageUri] = useState("");
  const [iconUri, setIconUri] = useState("");

  const [oldData, setOldData] = useState([]);
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
        setMembersData(
          response.data.data.map((data) => ({
            value: data.nim,
            label: `${data.nim} - ${data.name}`,
          }))
        );
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
      .get("/cms/projects", payload)
      .then(function (response) {
        const data = response.data.data;

        setName(data.name);
        setDescription(data.description);
        setProductionUri(data.productionUri);
        setRepositoryUri(data.repositoryUri);
        setBudget(data.budget);
        setContributor(
          data.contributors.map((data) => ({
            value: data.nim,
            label: `${data.nim} - ${data.name}`,
          }))
        );
        setDivisions(
          data.divisions.map((data) => ({
            value: data.id,
            label: data.name,
          }))
        );
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
    fetchMembers();
    fetchDivisions();
  }, [id, router, fetchData, fetchMembers, fetchDivisions]);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    const requestBody = {
      name: name,
      description: description,
      productionUri: productionUri,
      repositoryUri: repositoryUri,
      budget: Number(budget),
      contributors: contributor.map((data) => Number(data.value)),
      divisions: divisions.map((data) => data.value),
    };

    if (imageUri !== null && imageUri !== "") {
      requestBody.imageUri = imageUri;
    }

    if (iconUri !== null && iconUri !== "") {
      requestBody.iconUri = iconUri;
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

    requestBody.contributors = JSON.stringify(requestBody.contributors);
    requestBody.divisions = JSON.stringify(requestBody.divisions);

    request
      .patch(`/cms/projects?id=${id}`, requestBody)
      .then(function (response) {
        console.log(response);
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push("/project");
        } else if (
          response.response.data.code === 400 &&
          response.response.data.status == "VALIDATION_ERROR"
        ) {
          setValidations(response.response.data.error.validation);
          setIconUri("");
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
      <HeadTitle title={"Edit Project"}>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                <div className="sm:col-span-6">
                  <InputField
                    id={"Name"}
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
                    id={"ProductionUri"}
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
                    id={"RepositoryUri"}
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
                    id={"Budget"}
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
                    value={divisions}
                    onChange={(selectedOptions) => {
                      setDivisions(selectedOptions);
                    }}
                    option={divisionsData}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputMultipleSelect
                    id={"contributor"}
                    label={"Contributor"}
                    name={"contributors"}
                    value={contributor}
                    validations={validations}
                    onChange={(selectedOptions) => {
                      setContributor(selectedOptions);
                    }}
                    option={membersData}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={"imageUri"}
                    name={"imageUri"}
                    type={"image"}
                    multiple={false}
                    previewImage={oldData.imageUri}
                    label={"Image"}
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
                    previewImage={oldData.iconUri}
                    label={"Icon"}
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
