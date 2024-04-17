'use client';
import DefaultButton from '@/components/button/defaultButton';
import InputField from '@/components/form/inputField';
import TextareaField from '@/components/form/textareaField';
import HeadTitle from '@/components/headTitle';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import InputMultipleSelect from '@/components/form/inputMultipleSelect';
import request from '@/app/utils/request';

export default function EditAwardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [issuer, setIssuer] = useState('');
  const [description, setDescription] = useState('');
  const [contributor, setContributor] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) {
      router.push('/award');
      return;
    }
    request
      .get(`/contributorAwardById`)
      .then(function (response) {
        const data = response.data.data;
        setIssuer(data.issuer);
        setDescription(data.description);
        setContributor(data.contributors);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
    request
      .get('/member')
      .then(function (response) {
        setMembers(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id, router]);
  const dataMembers = members.map((item) => ({
    value: item.nim,
    label: item.name,
  }));

  return (
    <div>
      <HeadTitle title={'Edit Award'}>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form action="#">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
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
                    name={'contributorAwards'}
                    onChange={(item) => {
                      setContributor(item);
                    }}
                    value={dataMembers.find((member) =>
                      contributor.some(
                        (contrib) => contrib.nim === member.value
                      )
                    )}
                    option={dataMembers}
                  />
                </div>
                <div className="sm:col-span-6">
                  <DefaultButton
                    size={'small'}
                    status={'primary'}
                    title={'Save all'}
                    type={'submit'}
                    onClick={() => {}}
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
