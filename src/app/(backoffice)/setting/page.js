'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { z } from 'zod';
import Image from 'next/image';
import toast from 'react-hot-toast';

import TextareaField from '@/components/form/textareaField';
import request from '@/app/utils/request';
import HeadTitle from '@/components/headTitle';
import InputField from '@/components/form/inputField';
import logoNotFound from '/public/assets/icon/notfound.svg';

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(30, { message: 'Name must be at most 30 characters long' }),
  address: z
    .string()
    .min(3, { message: 'Address must be at least 3 characters long' })
    .max(255, { message: 'Address must be at most 255 characters long' }),
  titleWebsite: z
    .string()
    .min(3, { message: 'Title website must be at least 3 characters long' })
    .max(30, { message: 'Title website must be at most 30 characters long' }),
  keyword: z
    .string()
    .min(3, { message: 'Keyword must be at least 3 characters long' })
    .max(255, { message: 'Keyword must be at most 255 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(255, { message: 'Description must be at most 255 characters long' }),
  logoUri: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file?.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file?.type)),
      {
        message: `Invalid file. Maximum size is 2MB and allowed formats are .jpg, .jpeg, .png, .webp`,
        path: ['logoUri'], // specify the path
      }
    ),
  // logoUri: z
  //   .any()
  //   .refine(
  //     (file) => !file || file?.size <= MAX_FILE_SIZE,
  //     `The maximum file size that can be uploaded is 2MB`
  //   )
  //   .refine(
  //     (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
  //     'Only .jpg, .jpeg, .png and .webp formats are supported'
  //   )
  //   .optional(),  
});


export default function SettingPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUri, setLogoUri] = useState();
  const [address, setAddress] = useState('');
  const [titleWebsite, setTitleWebsite] = useState('');
  const [keyword, setKeyword] = useState('');
  const [defaultLogoUri, setDefaultLogoUri] = useState();
  const [oldData, setOldData] = useState([]);

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidations([]);
    setLoading(true);
    toast.loading('Saving data...');
  
    const validation = formSchema.safeParse({
      name: name,
      address: address,
      titleWebsite: titleWebsite,
      keyword: keyword,
      description: description,
      logoUri: logoUri && typeof logoUri !== 'string' ? logoUri : null, // Validate only if it's a new file
    });
    
    if (!validation.success) {
      validation.error.errors.forEach((validation) => {
        setValidations((prevValidations) => [
          ...prevValidations,
          { name: validation.path[0], message: validation.message },
        ]);
      });
      toast.dismiss();
      toast.error('Invalid Input');
      setLoading(false);
      return;
    }
  
    const requestBody = {
      name: name,
      description: description,
      titleWebsite: titleWebsite,
      keyword: keyword,
      address: address,
    };
  
    if (logoUri && typeof logoUri !== 'string') {
      requestBody.logoUri = logoUri;
    };

    request
      .patch(`/cms/setting`, requestBody)
      .then(function (response) {
        const { code, status, data, error } = response.data;
        if (code === 200 || code === 201) {
          toast.dismiss();
          toast.success(data?.message);
          router.push('/setting');
        } else {
          const formattedStatus = status
            .split('_')
            .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          if (code === 400 && status === 'VALIDATION_ERROR') {
            setValidations(error?.validation);
            setLogoUri('');
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

  useEffect(() => {
    request
      .get(`/cms/setting`)
      .then(function (response) {
        const data = response.data.data;
        setName(data.name);
        setDescription(data.description);
        setTitleWebsite(data.titleWebsite);
        setAddress(data.address);
        setKeyword(data.keyword);
        setLogoUri(data.logoUri);
        setDefaultLogoUri(data.logoUri);
        setLoading(false);
        setOldData(data);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <HeadTitle>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-4 ">
          <div className="col-span-full xl:col-auto">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
              <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                <Image
                  width={0}
                  height={0}
                  src={
                    logoUri
                      ? typeof logoUri === 'string'
                        ? `${process.env.NEXT_PUBLIC_HOST}${logoUri}`
                        : URL.createObjectURL(logoUri)
                      : logoNotFound.src
                  }
                  className="object-contain mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                  alt="Logo CCI"
                />
                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900 ">
                    Logo CCI
                  </h3>
                  <div className="mb-4 text-sm text-gray-500 ">
                    JPG, JPEG, PNG or WEBP. Max size of 2000KB
                  </div>
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="logoUri"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 "
                    >
                      <svg
                        className="w-4 h-4 mr-2 -ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                      </svg>
                      Edit picture
                    </label>
                    <input
                      id={'logoUri'}
                      name={'logoUri'}
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const img = e.target.files[0];
                          setLogoUri(img);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className={`py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 ${logoUri ?? ' hidden'
                        } `}
                      onClick={() => setLogoUri()}
                    >
                      Delete
                    </button>
                  </div>
                  {validations &&
                    validations.map(
                      (validation, index) =>
                        validation.name === 'logoUri' && (
                          <p key={index} className="mt-2 text-sm text-red-500">
                            {validation.message}
                          </p>
                        )
                    )}
                </div>
              </div>
            </div>
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <h3 className="mb-4 text-xl font-semibold ">Description CCI</h3>
              <div className="mb-4">
                {description ? (
                  <h1>{description}</h1>
                ) : (
                  <h1 className="text-lg text-gray-300 text-start md:text-justify">
                    No description available
                  </h1>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <h3 className="mb-4 text-xl font-semibold ">
                General information
              </h3>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 ">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <InputField
                    id={'name'}
                    name={'name'}
                    type={'text'}
                    placeholder={'Web Development'}
                    value={name ?? ''}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Address
                  </label>
                  <InputField
                    id={'address'}
                    name={'address'}
                    type={'text'}
                    placeholder={'e.g JL. example No. 69'}
                    value={address ?? ''}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    htmlFor="titleWebsite"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Title Website
                  </label>
                  <InputField
                    id={'titleWebsite'}
                    name={'titleWebsite'}
                    type={'text'}
                    placeholder={'e.g Web Profile CCI'}
                    value={titleWebsite ?? ''}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setTitleWebsite(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    htmlFor="keyword"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Keyword
                  </label>
                  <TextareaField
                    id={'keyword'}
                    name={'keyword'}
                    placeholder={'e.g keyword ...'}
                    // label={'Description'}
                    value={keyword ?? ''}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Description
                  </label>
                  <TextareaField
                    id={'description'}
                    name={'description'}
                    placeholder={'e.g Description ...'}
                    // label={'Description'}
                    value={description ?? ''}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-full">
                  <button
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    type="submit"
                  >
                    Save all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </HeadTitle>
  );
};