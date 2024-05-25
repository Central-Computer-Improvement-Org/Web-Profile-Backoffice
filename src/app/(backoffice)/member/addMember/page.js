'use client';
import request from '@/app/utils/request';
import DefaultButton from '@/components/button/defaultButton';
import InputField from '@/components/form/inputField';
import InputSelect from '@/components/form/inputSelect';
import HeadTitle from '@/components/headTitle';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";

import { z } from "zod";

// Pagination Constants
const LIMIT = 100;
const PAGE = 1;

const defaultPayload = {
  page : PAGE,
  limit : LIMIT,
}

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  nim : z
    .string()
    .min(3, { message: "Name must be at least 3 characters long."})
    .max(30, { message: "Name must be at most 30 characters long."}),
  name : z
    .string()
    .min(3, { message: "Name must be at least 3 characters long."})
    .max(30, { message: "Name must be at most 30 characters long."}),
  email : z
    .string()
    .email({ message: "Invalid email address."}),
  password : z
    .string()
    .min(8, { message: "Password must be at least 8 characters long."})
    .refine(value => /\d/.test(value), {
      message: "Password must contain at least one number.",
    })
    .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one symbol.",
    }),
  major : z
    .string()
    .min(3, { message: "Major must be at least 3 characters long."})
    .max(30, { message: "Major must be at most 30 characters long."}),
  linkedinUri : z
    .string(),
    // .url({ message: "Invalid URL."}),
  phoneNumber : z
    .string()
    .min(3, { message: "Phone number must be at least 3 characters long."})
    .max(30, { message: "Phone number must be at most 30 characters long."}), 
  profileUri: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `The maximum file size that can be uploaded is 2MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
})

export default function AddMemberPage() {
  const router = useRouter();

  const [nim, setNim] = useState('');
  const [roleId, setRoleId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('');
  const [linkedinUri, setLinkedinUri] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileUri, setProfileUri] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [yearUniversityEnrolled, setYearUniversityEnrolled] = useState('');
  const [yearCommunityEnrolled, setYearCommunityEnrolled] = useState('');

  const [divisionDatas, setDivisionDatas] = useState([]);
  const [roleDatas, setRoleDatas] = useState();

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const fetchDivisions = async () => {
    const payload = {
      ...defaultPayload,
      ordering : "name",
      sort : "desc",
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
  };

  const fetchRoles = async () => {
    request
      .get(`/cms/users/roles`)
      .then(function (response) {
        setRoleDatas(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
    });
  }

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        nim: nim,
        name: name,
        email: email,
        major: major,
        linkedinUri: linkedinUri,
        phoneNumber: phoneNumber,
        profileUri: profileUri,
        password: password,
      });

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
        toast.error("Invalid Input.");
        console.log(validations);
        return;
      }
    } catch (error) {
      console.error(error);
    }

    request
      .post('/auth/register', {
        nim: nim,
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
        yearCommunityEnrolled: moment(yearCommunityEnrolled).format(
          'DD-MM-YYYY'
        ),
        profileUri: profileUri,
        password: password,
        isActive: isActive,
      })
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

        } else if (response.response.data.code === 500 ) {
          console.error("INTERNAL_SERVER_ERROR")
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false)
      })
  };

  useEffect(() => {
    fetchDivisions();
    fetchRoles();
    setLoading(false);
  }, []);

  return (
    <div>
      <HeadTitle>
        <div className=" mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'nim'}
                  name={'nim'}
                  placeholder={'123456789102'}
                  type={'text'}
                  value={nim}
                  required
                  label={'NIM'}
                  validations={validations}
                  onChange={(e) => {
                    setNim(e.target.value);
                  }}
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
                  required
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
                  label={'Profile Picture'}
                  required           
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
                  // label={'Entry University'}
                  label={'Entry university'}
                  onChange={(e) => {
                    setYearUniversityEnrolled(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'entryCommunity'}
                  name={'entryCommunity'}
                  type={'date'}
                  value={yearCommunityEnrolled}
                  required
                  // label={'Entry Community'}
                  label={'Entry community'}
                  onChange={(e) => {
                    setYearCommunityEnrolled(e.target.value);
                  }}
                />
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
      </HeadTitle>
    </div>
  );
}
