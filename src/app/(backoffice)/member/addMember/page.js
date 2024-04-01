'use client';
import DefaultButton from '@/components/button/defaultButton';
import InputField from '@/components/form/inputField';
import InputSelect from '@/components/form/inputSelect';
import HeadTitle from '@/components/headTitle';
import React, { useState } from 'react';

export default function AddMemberPage() {
  const [nim, setNim] = useState('');
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
  return (
    <div>
      <HeadTitle title={'Add Member'}>
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                  label={'Entry community'}
                  onChange={(e) => {
                    setYearCommunityEnrolled(e.target.value);
                  }}
                />
              </div>
              <div className="col-span-6 sm:col-full">
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
      </HeadTitle>
    </div>
  );
}
