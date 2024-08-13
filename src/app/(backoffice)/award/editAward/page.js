'use client';
import React, { useEffect, useState, useCallback } from 'react';
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from 'next/navigation';
import request from '@/app/utils/request';
import { toast } from 'react-hot-toast';
import { z } from "zod";


const DefaultButton = dynamic(
    () => {
      return import("@/components/button/defaultButton");
    },
    { ssr: false }
);

const InputField = dynamic(
    () => {
      return import("@/components/form/inputField");
    },
    { ssr: false }
);
const TextareaField = dynamic(
    () => {
      return import("@/components/form/textareaField");
    },
    { ssr: false }
);
const HeadTitle = dynamic(
    () => {
      return import("@/components/headTitle");
    },
    { ssr: false }
);
const InputMultipleSelect = dynamic(
    () => {
      return import("@/components/form/inputMultipleSelect");
    },
    { ssr: false }
);


// Sorting Constants
const ORDERING = 'name';
const SORT = 'asc';

// Pagination Constants
const LIMIT = 9999999;
const page = 1;

const formSchema = z.object({
  issuer: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long."})
    .max(30, { message: "Name must be at most 30 characters long."}),
  title: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long."})
    .max(30, { message: "Name must be at most 30 characters long."}),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long."})
    .max(255, { message: "Description must be at most 255 characters long."}),
  contributors: z
    .array(z
      .number()
    )
    .min(1, { message: "Contributor must be at least 1."}),
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
    request
      .get('/cms/users', payload)
      .then(function (response) {
        setMembersData(response.data.data.map((data) => ({
          value: data.nim,
          label: `${data.nim} - ${data.name}`,
        })));
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
        console.log(error);
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
    setValidations([]);
    setLoading(true);
    toast.loading("Saving data...");
    e.preventDefault();

    const requestBody = {
      issuer: issuer,
      title: title,
      description: description,
      contributors: contributor.map(data => Number(data.value)),
    };

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
        toast.error("Invalid Input.");
        return; 
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error("Something went wrong!");
      console.error(error);
    }

    requestBody.contributors = JSON.stringify(requestBody.contributors)

    request
      .patch(`/cms/awards?id=${id}`, 
        requestBody
      )
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          router.push('/award');
        } else if (response.data.data.code === 400 && response.data.data.status == "VALIDATION_ERROR") {
          setValidations(response.data.data.error.validation);
          toast.dismiss();
          toast.error(response.data.data.error.message);
        } else if (response.data.data.code === 500 ) {
          console.error("INTERNAL_SERVER_ERROR")
          toast.dismiss();
          toast.error(response.data.data.error.message);
        }
        setLoading(false);
      })
  }

  return (
    <div>
      <HeadTitle>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                <div className="sm:col-span-6">
                  <InputField
                    id={'issuer'}
                    name={'issuer'}
                    placeholder={'e.g Gemastik'}
                    type={'text'}
                    value={issuer}
                    validations={validations}
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
                    placeholder={'e.g Gemastik'}
                    type={'text'}
                    value={title}
                    validations={validations}
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
                    validations={validations}
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
                    name={'contributors'}
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
}
