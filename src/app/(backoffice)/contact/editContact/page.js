'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import toast from 'react-hot-toast';

import request from '@/app/utils/request';
import DefaultButton from '@/components/button/defaultButton';
import InputSelect from '@/components/form/inputSelect';
import InputField from '@/components/form/inputField';
import HeadTitle from '@/components/headTitle';

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const formSchema = z.object({
  value: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' })
    .max(30, { message: 'Name must be at most 30 characters long.' }),
  platform: z
    .string()
    .min(3, { message: 'Platform must be at least 3 characters long.' })
    .max(30, { message: 'Platform must be at most 30 characters long.' }),
  iconUri: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `The maximum file size that can be uploaded is 2MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  accountUri: z
    .string()
    .min(3, { message: 'Account URI must be at least 3 characters long.' })
    .max(255, { message: 'Account URI must be at most 255 characters long.' }),
});


export default function EditContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [oldData, setOldData] = useState({});
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [accountUri, setAccountUri] = useState('');
  const [iconUri, setIconUri] = useState(null);
  const [platform, setPlatform] = useState('');
  
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading('Saving data...');
    e.preventDefault();

    const requestBody = {
      value: name,
      platform: platform,
      accountUri: accountUri,
      isActive: status,
    };

    if (iconUri !== null && iconUri !== '') {
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
        toast.error('Invalid Input');
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error('Something went wrong!');
      console.error(error);
    }
    
    request
      .patch(`/cms/contact?id=${id}`, requestBody)
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push('/contact');
        } else if (
          response.response.data.code === 400 &&
          response.response.data.status == 'VALIDATION_ERROR'
        ) {
          setValidations(response.response.data.error.validation);
          setIconUri('');
          toast.dismiss();
          toast.error(response.response.data.error.message);
        } else if (response.response.data.code === 500) {
          console.error('INTERNAL_SERVER_ERROR');
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false);
      });
  };
  
  useEffect(() => {
    if (!id) {
      router.push('/contact');
      return;
    }
    request
      .get(`/cms/contact?id=${id}`)
      .then((response) => {
        const data = response.data.data;
        setPlatform(data.platform);
        setName(data.value);
        setStatus(data.isActive);
        setAccountUri(data.accountUri);
        setOldData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id, router]);

  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={'iconUri'}
                    name={'iconUri'}
                    type={'file'}
                    previewImage={oldData.iconUri}
                    imageOnly={true}
                    label={'Icon Platform'}
                    validations={validations}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setIconUri(img);
                      }
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <InputField
                    id={'platform'}
                    name={'platform'}
                    placeholder={'e.g Gmail'}
                    type={'text'}
                    value={platform}
                    required
                    label={'Platform'}
                    validations={validations}
                    onChange={(e) => {
                      setPlatform(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={'name'}
                    name={'name'}
                    placeholder={'e.g cci.unitel'}
                    type={'text'}
                    value={name}
                    required
                    label={'Name Account'}
                    validations={validations}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={'accountUri'}
                    name={'accountUri'}
                    placeholder={'e.g https://example.com/'}
                    type={'text'}
                    value={accountUri}
                    required
                    label={'Account URI'}
                    validations={validations}
                    onChange={(e) => {
                      setAccountUri(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputSelect
                    id={'status'}
                    name={'status'}
                    placeholder={'e.g Active'}
                    type={'text'}
                    value={status}
                    required
                    label={'Status'}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </InputSelect>
                </div>
                <div className="sm:col-span-6">
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