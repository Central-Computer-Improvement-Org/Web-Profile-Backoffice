"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "react-hot-toast";
import moment from 'moment';

import request from "@/app/utils/request";
import DefaultButton from "@/components/button/defaultButton";
import InputSelect from "@/components/form/inputSelect";
import InputField from "@/components/form/inputField";
import HeadTitle from "@/components/headTitle";

// Pagination Constants
const LIMIT = 100;
const PAGE = 1;

const defaultPayload = {
  page: PAGE,
  limit: LIMIT,
};

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(30, { message: "Name must be at most 30 characters long." }),
  email: z
    .string()
    .email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine(value => /\d/.test(value), {
      message: "Password must contain at least one number.",
    })
    .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one symbol.",
    })
    .optional(),
  major: z
    .string()
    .min(3, { message: "Major must be at least 3 characters long." })
    .max(30, { message: "Major must be at most 30 characters long." }),
  linkedinUri: z
    .string()
    .url({ message: "Invalid URL." }),
  phoneNumber: z
    .string()
    .min(3, { message: "Phone number must be at least 3 characters long." })
    .max(30, { message: "Phone number must be at most 30 characters long." }),
  profileUri: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `The maximum file size that can be uploaded is 2MB`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});


export default function EditMemberPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nim = searchParams.get("nim");

  // State untuk menyimpan data member
  const [roleId, setRoleId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [linkedinUri, setLinkedinUri] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [profileUri, setProfileUri] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [yearUniversityEnrolled, setYearUniversityEnrolled] = useState("");
  const [yearCommunityEnrolled, setYearCommunityEnrolled] = useState("");

  const [oldData, setOldData] = useState([]);
  const [divisionDatas, setDivisionDatas] = useState([]);
  const [roleDatas, setRoleDatas] = useState();

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    request
      .get(`/cms/users?nim=${nim}`)
      .then(function (response) {
        const data = response.data.data;
        setRoleId(data.roleId);
        setDivisionId(data.divisionId);
        setName(data.name);
        setEmail(data.email);
        setMajor(data.major);
        setLinkedinUri(data.linkedinUri);
        setPhoneNumber(data.phoneNumber);
        setIsActive(data.isActive);
        setYearUniversityEnrolled(data.yearUniversityEnrolled);
        setYearCommunityEnrolled(data.yearCommunityEnrolled);
        setOldData(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [nim]);

  const fetchDivisions = useCallback(async () => {
    const payload = {
      ...defaultPayload,
      ordering: "name",
      sort: "desc",
    }

    request
      .get(`/cms/users/divisions`, payload)
      .then(function (response) {
        setDivisionDatas(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const fetchRoles = useCallback(async () => {
    const payload = {
      ...defaultPayload,
    }

    request
      .get(`/cms/users/roles`, payload)
      .then(function (response) {
        setRoleDatas(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, [])

  useEffect(() => {
    if (!nim) {
      router.push("/member");
      return;
    }

    fetchData();
    fetchDivisions();
    fetchRoles();
    setLoading(false);
  }, [nim, router, fetchData, fetchDivisions, fetchRoles]);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    const requestBody = {
      roleId: roleId,
      divisionId: divisionId,
      name: name,
      email: email,
      major: major,
      linkedinUri: linkedinUri,
      phoneNumber: phoneNumber,
      yearUniversityEnrolled: moment(yearUniversityEnrolled).format(
        'DD-MM-YYYY'
      ),
      yearCommunityEnrolled: yearCommunityEnrolled,
      isActive: isActive,
    };

    if (profileUri !== null && profileUri !== "") {
      requestBody.profileUri = profileUri;
    }

    if (password !== null && password !== "") {
      requestBody.password = password;
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
          setValidations(validations => [...validations, ...key]);
        })
        setLoading(false);
        toast.dismiss();
        toast.error("Invalid Input");
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error("Something went wrong!");
      console.error(error);
    }

    request
      .patch(`/cms/users?nim=${nim}`,
        requestBody
      )
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push("/member");
        } else if (response.response.data.code === 400 && response.response.data.status == "VALIDATION_ERROR") {
          setValidations(response.response.data.error.validation);
          setProfileUri("");
          toast.dismiss();
          toast.error(response.response.data.error.message);
        } else if (response.response.data.code === 500) {
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false)
      })
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
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'nim'}
                    name={'nim'}
                    placeholder={'123456789102'}
                    type={'text'}
                    value={nim}
                    label={'NIM'}
                    disabled={true}
                    readOnly={true}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'roleId'}
                    name={'roleId'}
                    type={'text'}
                    value={roleId}
                    required
                    label={'Role'}
                    onChange={(e) => {
                      setRoleId(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select One
                    </option>
                    {roleDatas &&
                      roleDatas.map((data, index) => (
                        <option key={index} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'divisionId'}
                    name={'divisionId'}
                    type={'text'}
                    value={divisionId}
                    required
                    label={'Division'}
                    onChange={(e) => {
                      setDivisionId(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select One
                    </option>
                    {divisionDatas &&
                      divisionDatas.map((data, index) => (
                        <option key={index} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'name'}
                    name={'name'}
                    placeholder={'e.g. Agis Huda'}
                    type={'text'}
                    value={name}
                    required
                    label={'Name'}
                    validations={validations}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'email'}
                    name={'email'}
                    placeholder={'example@gmail.com'}
                    type={'email'}
                    value={email}
                    required
                    label={'Email'}
                    validations={validations}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'password'}
                    name={'password'}
                    placeholder={''}
                    type={'password'}
                    value={password}
                    label={'Password'}
                    validations={validations}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'major'}
                    name={'major'}
                    placeholder={'e.g. S1 Informatika'}
                    type={'text'}
                    value={major}
                    required
                    label={'Major'}
                    validations={validations}
                    onChange={(e) => {
                      setMajor(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'linkedinUri'}
                    name={'linkedinUri'}
                    placeholder={'e.g. https://www.linkedin.com/in/example/'}
                    type={'text'}
                    value={linkedinUri}
                    required
                    label={'LinkedIn URL'}
                    validations={validations}
                    onChange={(e) => {
                      setLinkedinUri(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'phoneNumber'}
                    name={'phoneNumber'}
                    placeholder={'e.g. 083211234567'}
                    type={'text'}
                    value={phoneNumber}
                    required
                    label={'Phone number'}
                    validations={validations}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'profileUri'}
                    name={'profileUri'}
                    type={'image'}
                    multiple={false}
                    previewImage={oldData.profileUri}
                    imageOnly={true}
                    label={'Profile Picture'}
                    validations={validations}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setProfileUri(img);
                      }
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'isActive'}
                    name={'isActive'}
                    value={isActive}
                    required
                    label={'Status'}
                    onChange={(e) => {
                      setIsActive(e.target.value);
                    }}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'entryUniversity'}
                    name={'entryUniversity'}
                    type={'date'}
                    value={yearUniversityEnrolled}
                    required
                    label={'Entry university'}
                    onChange={(e) => {
                      setYearUniversityEnrolled(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'entryCommunity'}
                    name={'entryCommunity'}
                    label={'Entry community'}
                    value={yearCommunityEnrolled}
                    required
                    onChange={(e) => {
                      setYearCommunityEnrolled(e.target.value);
                    }}
                  >
                    <option value={"5.0"}>5.0</option>
                    <option value={"6.0"}>6.0</option>
                    <option value={"7.0"}>7.0</option>
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-full">
                  <DefaultButton
                    size={'small'}
                    status={'primary'}
                    title={'Save all'}
                    type={'submit'}
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