"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";


import request from "@/app/utils/request";
import InputMultipleSelect from "@/components/form/inputMultipleSelect";
import DefaultButton from "@/components/button/defaultButton";
import TextareaField from "@/components/form/textareaField";
import InputField from "@/components/form/inputField";
import HeadTitle from "@/components/headTitle";

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
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(100, { message: "Description must be at most 100 characters long" }),
  productionUri: z
    .string()
    .url({ message: "Production Uri must be a valid Url" }),
  repositoryUri: z
    .string()
    .url({ message: "Repository Uri must be a valid Url" }),
  budget: z.number().min(0, { message: "Budget must be at least 0" }),
  contributors: z
    .array(z.number())
    .min(1, { message: "Contributor must be at least 1" }),
  divisions: z
    .array(z.string())
    .min(1, { message: "Division must be at least 1" }),
  imageUri: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  iconUri: z
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        setValidations(validation.error.errors.map(error => ({
          name: error.path[0],
          message: error.message
        })));
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

    requestBody.contributors = JSON.stringify(requestBody.contributors);
    requestBody.divisions = JSON.stringify(requestBody.divisions);

    request
      .patch(`/cms/projects?id=${id}`, requestBody)
      .then(function (response) {
        const { code, status, data, error } = response.data;
        if (code === 200 || code === 201) {
          toast.dismiss();
          toast.success(data?.message);
          router.push('/project');
        } else {
          const formattedStatus = status
            .split('_')
            .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          if (code === 400 && status === 'VALIDATION_ERROR') {
            setValidations(error?.validation);
            setIconUri("");
            setImageUri("");
          }
          toast.dismiss();
          toast.error(`${formattedStatus}: ${error?.message || 'An error occurred'}`);
        }
        setLoading(false);
      }).catch((error) => {
        toast.dismiss();
        toast.error(error?.message);
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <InputField
                    id={"Name"}
                    name={"name"}
                    type={"text"}
                    placeholder={"e.g Gemastik"}
                    label={"Name"}
                    value={name}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={"ProductionUri"}
                    name={"productionUri"}
                    type={"text"}
                    placeholder={"e.g https://example.com/"}
                    label={"Production Uri"}
                    value={productionUri}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setProductionUri(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={"RepositoryUri"}
                    name={"repositoryUri"}
                    type={"text"}
                    placeholder={"e.g https://example.com/"}
                    label={"Repository Uri"}
                    value={repositoryUri}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setRepositoryUri(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={"Budget"}
                    name={"budget"}
                    type={"number"}
                    placeholder={"e.g 1000000"}
                    label={"Budget"}
                    value={budget}
                    validations={validations}
                    required
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
                    label={"Description"}
                    value={description}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputMultipleSelect
                    id={"divisions"}
                    name={"divisions"}
                    label={"Division"}
                    value={divisions}
                    validations={validations}
                    onChange={(selectedOptions) => {
                      setDivisions(selectedOptions);
                    }}
                    option={divisionsData}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputMultipleSelect
                    id={"contributor"}
                    name={"contributors"}
                    label={"Contributor"}
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
                    label={"Image"}
                    multiple={false}
                    previewImage={oldData.imageUri}
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
                    label={"Icon"}
                    multiple={false}
                    previewImage={oldData.iconUri}
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
};