'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { set, z } from "zod";

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
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(30, { message: "Name must be at most 30 characters long" }),
  title: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(30, { message: "Name must be at most 30 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(255, { message: "Description must be at most 255 characters long" }),
  contributors: z
    .array(z
      .number()
    )
    .min(1, { message: "Contributor must be at least 1" }),
})


export default function EditAwardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

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
    request.get('/cms/users', payload)
    .then(function (response) {
      setMembersData(response.data.data.map((data) => ({
        value: data.nim,
        label: `${data.nim} - ${data.name}`,
      })));
      setLoading(false);
    })
    .catch(function (error) {
      console.error("Error :", error);
      setLoading(false);
    });
  }, []);

  const fetchData = useCallback(async () => {
    const payload = {
      id: id,
    };
    request
      .get('/cms/awards', payload)
      .then(function (response) {
        const data = response.data.data;
        setIssuer(data.issuer);
        setTitle(data.title);
        setDescription(data.description);
        setContributor(data.contributors.map((data) => ({
          value: data.nim,
          label: `${data.nim} - ${data.name}`
        })));
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error validation :", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) {
      router.push('/award');
      return;
    }
    fetchData();
    fetchMembers();

  }, [id, router, fetchData, fetchMembers]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidations([]);
    setLoading(true);
    toast.loading("Updating data...");

    const requestBody = {
      issuer: issuer,
      title: title,
      description: description,
      contributors: contributor.map(data => Number(data.value)),
    };

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
    
    request.patch(`/cms/awards?id=${id}`, requestBody)
    .then(function (response) {
      const { code, status, data, error } = response.data;
  
      if (code === 200 || code === 201) {
          toast.dismiss();
          toast.success(data?.message);
          router.push("/award");
      } else {
          const formattedStatus = status
            .split('_')
            .map(res => res[0].toUpperCase() + res.slice(1).toLowerCase())
            .join(' ');
          setValidations(error?.validation);
          toast.dismiss();
          toast.error(`${formattedStatus}: ${error?.message || 'An error occurred'}`);
      };
      setLoading(false);
    }).catch(function (error) {
      toast.dismiss();
      toast.error(error?.message);
      setLoading(false);
    });
  }

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
                    id={'issuer'}
                    name={'issuer'}
                    type={'text'}
                    placeholder={'e.g Gemastik'}
                    label={'Issuer'}
                    value={issuer}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setIssuer(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputField
                    id={'title'}
                    name={'title'}
                    type={'text'}
                    placeholder={'e.g Gemastik'}
                    label={'Title'}
                    value={title}
                    validations={validations}
                    required
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
                    label={'Description'}
                    value={description}
                    validations={validations}
                    required
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputMultipleSelect
                    id={'contributor'}
                    name={'contributors'}
                    label={'Contributor'}
                    value={contributor}
                    validations={validations}
                    onChange={(selectedOptions) => {
                      setContributor(selectedOptions);
                    }}
                    option={membersData}
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