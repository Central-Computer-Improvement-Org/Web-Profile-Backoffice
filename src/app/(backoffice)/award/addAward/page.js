'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { z } from "zod";

import request from '@/app/utils/request';
import InputMultipleSelect from '@/components/form/inputMultipleSelect';
import DefaultButton from '@/components/button/defaultButton';
import TextareaField from '@/components/form/textareaField';
import InputField from '@/components/form/inputField';
import HeadTitle from '@/components/headTitle';

// Sorting Constants
const ORDERING = 'name';
const SORT = 'asc';

// Pagination Constants
const LIMIT = 9999999;
const page = 1;

const formSchema = z.object({
  issuer: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(30, { message: "Name must be at most 30 characters long." }),
  title: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(30, { message: "Name must be at most 30 characters long." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(255, { message: "Description must be at most 255 characters long." }),
  contributor: z
    .array(z
      .number()
    )
    .min(1, { message: "Contributor must be at least 1." }),
});


export default function AddAwardPage() {
  const router = useRouter();

  const [issuer, setIssuer] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contributor, setContributor] = useState([]);
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
      .get('/cms/users', payload)
      .then(function (response) {
        setMembersData(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMembers();

    setLoading(false)
  }, [fetchMembers]);

  const onSubmit = async (e) => {
    setValidations([]);
    setLoading(true);
    toast.loading('Saving data...');
    e.preventDefault();

    try {
      const validation = formSchema.safeParse({
        issuer: issuer,
        title: title,
        description: description,
        contributor: contributor,
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
        return;
      }
    } catch (error) {
      console.error(error);
    }

    request
      .post('/cms/awards', {
        issuer: issuer,
        title: title,
        description: description,
        contributors: JSON.stringify(contributor),
      })
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push("/award");
        } else if (response.response.data.code === 400 && response.response.data.status == "VALIDATION_ERROR") {
          setValidations(response.response.data.error.validation);
          toast.dismiss();
          toast.error(response.response.data.error.message);

        } else if (response.response.data.code === 500) {
          console.error("INTERNAL_SERVER_ERROR")
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false)
      })
  }
  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="w-full text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <InputField
                    id={'issuer'}
                    name={'issuer'}
                    placeholder={'e.g Gemastik'}
                    type={'text'}
                    value={issuer}
                    required
                    label={'Issuer'}
                    onChange={(e) => {
                      setIssuer(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={'title'}
                    name={'title'}
                    placeholder={'e.g Juara 1 Gemastik'}
                    type={'text'}
                    value={title}
                    required
                    label={'Title'}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <TextareaField
                    id={'description'}
                    name={'description'}
                    placeholder={'e.g Description ...'}
                    value={description}
                    required
                    label={'Description'}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputMultipleSelect
                    id={'contributor'}
                    label={'Contributor'}
                    name={'contributor'}
                    validations={validations}
                    onChange={(selectedOptions) => {
                      if (selectedOptions) {
                        setContributor(selectedOptions.map(option => Number(option.value)));
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