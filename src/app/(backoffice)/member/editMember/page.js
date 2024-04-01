'use client';
import DefaultButton from '@/components/button/defaultButton';
import InputField from '@/components/form/inputField';
import InputSelect from '@/components/form/inputSelect';
import HeadTitle from '@/components/headTitle';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function EditMemberPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nim = searchParams.get('nim');
  console.log(nim);

  // State untuk menyimpan data member
  const [roleId, setRoleId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mayor, setMayor] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profile, setProfile] = useState('');
  const [status, setStatus] = useState();
  const [yearUniversityEnrolled, setYearUniversityEnrolled] = useState('');
  const [yearCommunityEnrolled, setYearCommunityEnrolled] = useState('');

  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  useEffect(() => {
    // Cek apakah query 'nim' ada atau tidak
    if (!nim) {
      // Jika tidak ada, arahkan pengguna ke halaman 404
      router.push('/member');
      return; // Hentikan eksekusi useEffect
    }

    // Lakukan request data member berdasarkan NIM dari query parameter
    axios
      .get(`http://localhost:3000/api/memberByNim`)
      .then(function (response) {
        const data = response.data.data;
        // Set data member ke state
        setRoleId(data.roleId);
        setDivisionId(data.divisionId);
        setName(data.name);
        setEmail(data.email);
        setMayor(data.mayor);
        setLinkedinUrl(data.linkedinUrl);
        setPhoneNumber(data.phoneNumber);
        setProfile(data.profile);
        setStatus(data.status);
        setYearUniversityEnrolled(data.yearUniversityEnrolled);
        setYearCommunityEnrolled(data.yearCommunityEnrolled);
        setLoading(false); // Setelah data dimuat, atur loading menjadi false
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false); // Jika terjadi kesalahan, tetap atur loading menjadi false
      });
  }, [nim]);
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
                    placeholder={'Ketua'}
                    type={'text'}
                    value={roleId}
                    label={'Role'}
                    onChange={(e) => {
                      setRoleId(e.target.value);
                    }}
                  >
                    <option>Ketua</option>
                    <option>sekertaris</option>
                    <option>Bendahara</option>
                    <option>Anggota</option>
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputSelect
                    id={'divisionId'}
                    name={'division'}
                    placeholder={'Web Development'}
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
                    id={'mayor'}
                    name={'mayor'}
                    placeholder={'e.g. S1 Informatika'}
                    type={'text'}
                    value={mayor}
                    label={'Mayor'}
                    onChange={(e) => {
                      setMayor(e.target.value);
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
                    label={'Linkend URL'}
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
                    label={'Phone number'}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'profile'}
                    name={'profile'}
                    type={'file'}
                    value={profile}
                    label={'Profile'}
                    onChange={(e) => {
                      setProfile(e.target.value);
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
                    <option value={false}>Offline</option>
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    id={'entryUniversity'}
                    name={'entryUniversity'}
                    type={'date'}
                    value={yearUniversityEnrolled}
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
                  <DefaultButton
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
