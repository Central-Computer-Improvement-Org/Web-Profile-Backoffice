'use client';
import DefaultButton from '@/components/button/defaultButton';
import DefaultLink from '@/components/link/defaultLink';
import InputField from '@/components/form/inputField';
import InputSelect from '@/components/form/inputSelect';
import HeadTitle from '@/components/headTitle';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import request from '@/app/utils/request';

export default function EditMemberPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nim = searchParams.get('nim');

  // State untuk menyimpan data member
  const [roleId, setRoleId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [status, setStatus] = useState();
  const [yearUniversityEnrolled, setYearUniversityEnrolled] = useState('');
  const [yearCommunityEnrolled, setYearCommunityEnrolled] = useState('');

  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  useEffect(() => {
    if (!nim) {
      router.push('/member');
      return;
    }
    request
      .get('/memberByNim')
      .then(function (response) {
        const data = response.data.data;
        // Set data member ke state
        setRoleId(data.roleId);
        setDivisionId(data.divisionId);
        setName(data.name);
        setEmail(data.email);
        setMajor(data.major);
        setLinkedinUrl(data.linkedinUrl);
        setPhoneNumber(data.phoneNumber);
        setProfilePicture(data.profilePicture);
        setStatus(data.status);
        setYearUniversityEnrolled(data.yearUniversityEnrolled);
        setYearCommunityEnrolled(data.yearCommunityEnrolled);
        setLoading(false); // Setelah data dimuat, atur loading menjadi false
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false); // Jika terjadi kesalahan, tetap atur loading menjadi false
      });
  }, [nim, router]);
  return (
    <div>
      <HeadTitle title={'Edit Member'}>
        {loading ? (
          <div className="text-center">Loading...</div> // Tampilkan pesan loading jika data sedang dimuat
        ) : (
          <div className=" mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'nim'}
                    name={'nim'}
                    placeholder={'123456789102'}
                    type={'text'}
                    value={nim}
                    label={'NIM'}
                    onChange={(e) => {
                      setNim(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'roleId'}
                    name={'role'}
                    type={'text'}
                    value={roleId}
                    label={'Role'}
                    onChange={(e) => {
                      setRoleId(e.target.value);
                    }}
                  >
                    <option>Ketua</option>
                    <option>Sekertaris</option>
                    <option>Bendahara</option>
                    <option>Anggota</option>
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'divisionId'}
                    name={'division'}
                    type={'text'}
                    value={divisionId}
                    label={'Division'}
                    onChange={(e) => {
                      setDivisionId(e.target.value);
                    }}
                  >
                    <option>Web Development</option>
                    <option>UI/UX Design</option>
                    <option>Data Resarch</option>
                    <option>Networking</option>
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'name'}
                    name={'name'}
                    placeholder={'e.g. Agis Huda'}
                    type={'text'}
                    value={name}
                    label={'Name'}
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
                    label={'Email'}
                    onChange={(e) => {
                      setEmail(e.target.value);
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
                    label={'Major'}
                    onChange={(e) => {
                      setMajor(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'linkedinUrl'}
                    name={'linkedinUrl'}
                    placeholder={'e.g. https://www.linkedin.com/in/example/'}
                    type={'text'}
                    value={linkedinUrl}
                    label={'Linkedin URL'}
                    onChange={(e) => {
                      setLinkedinUrl(e.target.value);
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
                    // label={'Phone Number'}
                    label={'Phone number'}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'profilePicture'}
                    name={'profilePicture'}
                    type={'file'}
                    value={profilePicture}
                    // label={'Profile Picture'}
                    label={'Profile picture'}
                    onChange={(e) => {
                      setProfilePicture(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'status'}
                    name={'status'}
                    value={status}
                    label={'Status'}
                    onChange={(e) => {
                      setStatus(e.target.value);
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
                    // label={'Entry Community'}
                    label={'Entry community'}
                    onChange={(e) => {
                      setYearCommunityEnrolled(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-full flex gap-3">
                  <DefaultButton
                    size={'small'}
                    status={'primary'}
                    title={'Update'}
                    type={'submit'}
                    onClick={() => {}}
                  />
                  <DefaultLink
                    size={'small'}
                    status={'secondary'}
                    title={'Back'}
                    href={'/member'}
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
