'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from "zod";
import moment from 'moment';
import toast from "react-hot-toast";

import request from '@/app/utils/request';
import DefaultButton from '@/components/button/defaultButton';
import InputSelect from '@/components/form/inputSelect';
import InputField from '@/components/form/inputField';
import HeadTitle from '@/components/headTitle';

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
    .min(3, { message: "Name must be at least 3 characters long"})
    .max(30, { message: "Name must be at most 30 characters long"}),
  name : z
    .string()
    .min(3, { message: "Name must be at least 3 characters long"})
    .max(30, { message: "Name must be at most 30 characters long"}),
  email : z
    .string()
    .email({ message: "Invalid email address"}),
  password : z
    .string()
    .min(8, { message: "Password must be at least 8 characters long"})
    .refine(value => /\d/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one symbol",
    }),
  major : z
    .string()
    .min(3, { message: "Major must be at least 3 characters long"})
    .max(30, { message: "Major must be at most 30 characters long"}),
  linkedinUri : z
    .string()
    .url({ message: "Invalid URL"}),
  phoneNumber : z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long"})
    .max(15, { message: "Phone number must be at most 15 characters long"}), 
  profileUri: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `The maximum file size that can be uploaded is 2MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});


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
        setValidations(validation.error.errors.map(error => ({
          name: error.path[0],
          message: error.message
        })));
        toast.dismiss();
        toast.error('Invalid Input');
        setLoading(false);
        return;
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      setLoading(false);
      return;
    };

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
        yearCommunityEnrolled: yearCommunityEnrolled,
        profileUri: profileUri,
        password: password,
        isActive: isActive,
      })
      .then(function (response) {
        const { code, status, data, error } = response.data || {};

        if (code === 200 || code === 201) {
          toast.dismiss();
          toast.success(data?.message);
          router.push('/member');
        } else {
          const formattedStatus = status
            .split('_')
            .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          if (code === 400 && status === 'VALIDATION_ERROR') {
            setValidations(error?.validation);
            setProfileUri('');
          }
          toast.dismiss();
          toast.error(`${formattedStatus}: ${error?.message || 'An error occurred'}`);
        }
        setLoading(false);
      }).catch((error) => {
        toast.dismiss();
        const errorMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
        toast.error(errorMessage);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchDivisions();
    fetchRoles();
    setLoading(false);
  }, []);

  return (
    <div>
      <HeadTitle>
        <div className="border border-gray-200 rounded-lg shadow-sm bg-4white mt- 2xl:col-span-2 sm:p-6">
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'nim'}
                  name={'nim'}
                  type={'text'}
                  placeholder={'123456789102'}
                  label={'NIM'}
                  value={nim}
                  validations={validations}
                  required
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
                  label={'Role'}
                  value={roleId}
                  required
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
                  label={'Division'}
                  value={divisionId}
                  required
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
                  type={'text'}
                  placeholder={'e.g. Agis Huda'}
                  label={'Name'}
                  value={name}
                  validations={validations}
                  required
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'email'}
                  name={'email'}
                  type={'email'}
                  placeholder={'example@gmail.com'}
                  label={'Email'}
                  value={email}
                  validations={validations}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'password'}
                  name={'password'}
                  type={'password'}
                  placeholder={''}
                  label={'Password'}
                  value={password}
                  validations={validations}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'major'}
                  name={'major'}
                  type={'text'}
                  placeholder={'e.g. S1 Informatika'}
                  label={'Major'}
                  value={major}
                  validations={validations}
                  required
                  onChange={(e) => {
                    setMajor(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'linkedinUri'}
                  name={'linkedinUri'}
                  type={'text'}
                  placeholder={'e.g. https://www.linkedin.com/in/example/'}
                  label={'LinkedIn URL'}
                  value={linkedinUri}
                  validations={validations}
                  required
                  onChange={(e) => {
                    setLinkedinUri(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  id={'phoneNumber'}
                  name={'phoneNumber'}
                  type={'text'}
                  placeholder={'e.g. 083211234567'}
                  label={'Phone number'}
                  value={phoneNumber}
                  validations={validations}
                  required
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
                  validations={validations}
                  required           
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
                  label={'Status'}
                  value={isActive}
                  required
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
                  label={'Entry university'}
                  value={yearUniversityEnrolled}
                  required
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
      </HeadTitle>
    </div>
  );
};