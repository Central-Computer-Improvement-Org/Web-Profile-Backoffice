'use client';
import TextareaField from '@/components/form/textareaField';
import HeadTitle from '@/components/headTitle';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import request from '@/app/utils/request';
import toast from 'react-hot-toast';

import { z } from 'zod';
import InputField from '@/components/form/inputField';
import { useRouter } from 'next/navigation';

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
    .min(3, { message: 'Name must be at least 3 characters long.' })
    .max(30, { message: 'Name must be at most 30 characters long.' }),
  address: z
    .string()
    .min(3, { message: 'Address must be at least 3 characters long.' })
    .max(255, { message: 'Address must be at most 255 characters long.' }),
  titleWebsite: z
    .string()
    .min(3, { message: 'Title website must be at least 3 characters long.' })
    .max(30, { message: 'Title website must be at most 30 characters long.' }),
  keyword: z
    .string()
    .min(3, { message: 'Keyword must be at least 3 characters long.' })
    .max(255, { message: 'Keyword must be at most 255 characters long.' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long.' })
    .max(255, { message: 'Description must be at most 255 characters long.' }),
  logoUri: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

export default function SettingPage() {
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [logoUri, setLogoUri] = useState();
  const [address, setAddress] = useState('');
  const [titleWebsite, setTitleWebsite] = useState('');
  const [keyword, setKeyword] = useState('');
  const [defaultLogoUri, setDefaultLogoUri] = useState();
  const [name, setName] = useState('');

  const [oldData, setOldData] = useState([]);

  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading('Saving data...');
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        name: name,
        address: address,
        titleWebsite: titleWebsite,
        keyword: keyword,
        description: description,
        logoUri: logoUri,
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
        toast.error('Invalid Input.');
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error('Something went wrong!');
      console.error(error);
    }

    const requestBody = {
      name: name,
      description: description,
      titleWebsite: titleWebsite,
      keyword: keyword,
      address: address,
    };

    if (logoUri !== null && logoUri !== '') {
      requestBody.logoUri = logoUri;
    }

    request.patch(`/cms/setting`, requestBody).then(function (response) {
      if (response.data?.code === 200 || response.data?.code === 201) {
        toast.dismiss();
        toast.success(response.data.data.message);
        location.reload();
      } else if (
        response.response.data.code === 400 &&
        response.response.data.status == 'VALIDATION_ERROR'
      ) {
        setValidations(response.response.data.error.validation);
        setLogoUri('');
        toast.dismiss();
        toast.error(response.response.data.error.message);
      } else if (response.response.data.code === 500) {
        toast.dismiss();
        toast.error(response.response.data.error.message);
      }
      setLoading(false);
    });
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
        setDefaultLogoUri(data.logoUri);
        setLoading(false);
        setOldData(data);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <HeadTitle>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1  xl:grid-cols-3 xl:gap-4 ">
          <div className="col-span-full xl:col-auto">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                <Image
                  width={0}
                  height={0}
                  src={
                    logoUri
                      ? URL.createObjectURL(logoUri)
                      : 'https://kevinid.pythonanywhere.com' + defaultLogoUri
                  }
                  className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 object-fill"
                  alt="Thumb"
                />

                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900 ">
                    Profile picture
                  </h3>
                  <div className="mb-4 text-sm text-gray-500 ">
                    JPG, JPEG, PNG or WEBP. Max size of 2000K
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
                          setLogoUri(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className={`py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 ${
                        logoUri ?? ' hidden'
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
                          <p key={index} className="text-sm text-red-500 mt-2">
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
                  <h1 className="text-lg text-gray-800 text-start md:text-justify">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industrys
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
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
                    placeholder={'Web Development'}
                    type={'text'}
                    value={name ?? ''}
                    required
                    validations={validations}
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
                    placeholder={'e.g JL. example No. 69'}
                    type={'text'}
                    value={address ?? ''}
                    required
                    validations={validations}
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
                    placeholder={'e.g Web Profile CCI'}
                    type={'text'}
                    value={titleWebsite ?? ''}
                    required
                    validations={validations}
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
                    value={keyword ?? ''}
                    required
                    // label={'Description'}
                    validations={validations}
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
                    value={description ?? ''}
                    required
                    // label={'Description'}
                    validations={validations}
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
}
