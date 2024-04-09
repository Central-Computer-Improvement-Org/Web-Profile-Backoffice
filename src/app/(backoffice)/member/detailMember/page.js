'use client';
import request from '@/app/utils/request';
import DefaultButton from '@/components/button/defaultButton';
import InputField from '@/components/form/inputField';
import InputSelect from '@/components/form/inputSelect';
import DefaultLink from '@/components/link/defaultLink';
import moment from 'moment';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { MdOutlinePhoneAndroid } from 'react-icons/md';
import { MdEmail } from 'react-icons/md';
import Link from 'next/link';

export default function DetailMemberPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nim = searchParams.get('nim');

  // State untuk menyimpan data member
  const [roleId, setRoleId] = useState('');
  const [division, setDivision] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [status, setStatus] = useState();
  const [award, setAward] = useState();
  const [project, setProject] = useState();
  const [yearUniversityEnrolled, setYearUniversityEnrolled] = useState('');
  const [yearCommunityEnrolled, setYearCommunityEnrolled] = useState('');

  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  useEffect(() => {
    if (!nim) {
      router.push('/member');
      return;
    }
    request
      .get('/profileMemberByNim')
      .then(function (response) {
        const data = response.data.data;
        setRoleId(data.role);
        setDivision(data.division);
        setName(data.name);
        setEmail(data.email);
        setMajor(data.major);
        setLinkedinUrl(data.linkedinUrl);
        setPhoneNumber(data.phoneNumber);
        setProfilePicture(data.profileUrl);
        setStatus(data.isActive);
        setYearUniversityEnrolled(data.yearUniversityEnrolled);
        setYearCommunityEnrolled(data.yearCommunityEnrolled);
        setAward(data.contributorAward);
        setProject(data.contributorProject);
        setLoading(false); // Setelah data dimuat, atur loading menjadi false
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false); // Jika terjadi kesalahan, tetap atur loading menjadi false
      });
  }, [nim, router]);
  return (
    <div>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                  <div className="w-28 h-28 rounded-lg">
                    <img
                      src={profilePicture}
                      width={0}
                      height={0}
                      className="mb-4 rounded-lg w-full h-full object-cover sm:mb-0 xl:mb-4 2xl:mb-0"
                      alt="profile"
                    />
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className={`w-3 h-3 rounded-full bg-green-500`} />
                      <h3 className="mb-1 text-xl font-bold text-gray-900 ">
                        {name}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-500 ">
                      {division.name}
                    </div>
                    <div className="mb-4 text-sm text-gray-500 ">{major}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <div className="flow-root">
                  <h3 className="text-xl font-semibold ">Contacts</h3>
                  <ul className="divide-y divide-gray-200 ">
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <MdOutlinePhoneAndroid className="text-3xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate ">
                            Phone number
                          </p>
                          <p className="text-sm font-normal text-gray-500 truncate ">
                            +62 {phoneNumber}
                          </p>
                        </div>
                        <div className="inline-flex items-center">
                          <Link
                            href="#"
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                          >
                            Copy
                          </Link>
                        </div>
                      </div>
                    </li>
                    <li className="pt-4 pb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <FaLinkedin className="text-3xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate ">
                            Linkedin
                          </p>
                          <Link
                            href={linkedinUrl}
                            className="text-sm font-normal text-secondary-500 truncate underline "
                          >
                            {linkedinUrl.substring(0, 30)}
                            ...
                          </Link>
                        </div>
                        <div className="inline-flex items-center">
                          <Link
                            href="#"
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                          >
                            Copy
                          </Link>
                        </div>
                      </div>
                    </li>
                    <li className="pt-4 pb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <MdEmail className="text-3xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate ">
                            Email
                          </p>
                          <Link
                            href="#"
                            className="text-sm font-normal text-gray-500 truncate "
                          >
                            {email.substring(0, 30)}
                          </Link>
                        </div>
                        <div className="inline-flex items-center">
                          <Link
                            href="#"
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                          >
                            Copy
                          </Link>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <h3 className="mb-4 text-xl font-semibold ">
                  General information
                </h3>
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
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputSelect
                        id={'roleId'}
                        name={'role'}
                        type={'text'}
                        value={roleId}
                        required
                        label={'Role'}
                        disabled
                      >
                        <option>Ketua</option>
                        <option>Sekertaris</option>
                        <option>Bendahara</option>
                        <option>Anggota</option>
                      </InputSelect>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputSelect
                        id={'division'}
                        name={'division'}
                        type={'text'}
                        value={division}
                        required
                        label={'Division'}
                        disabled
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
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={'major'}
                        name={'major'}
                        placeholder={'e.g. S1 Informatika'}
                        type={'text'}
                        value={major}
                        required
                        label={'Major'}
                        disabled
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
                        // label={'Phone Number'}
                        label={'Phone number'}
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={'entryUniversity'}
                        name={'entryUniversity'}
                        type={'text'}
                        value={moment(yearUniversityEnrolled).format(
                          ' D MMM YYYY'
                        )}
                        required
                        // label={'Entry University'}
                        label={'Entry university'}
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={'entryCommunity'}
                        name={'entryCommunity'}
                        type={'text'}
                        value={moment(yearCommunityEnrolled).format(
                          ' D MMM YYYY'
                        )}
                        required
                        // label={'Entry Community'}
                        label={'Entry community'}
                        disabled
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="col-span-6 sm:col-full">
                        <DefaultLink
                          href={`/member/detailMember/editMember?nim=${nim}`}
                          size={'base'}
                          status={'primary'}
                          title={'Update'}
                        />
                      </div>
                      <div className="col-span-6 sm:col-full">
                        <DefaultLink
                          href={`/member`}
                          size={'base'}
                          status={'secondary'}
                          title={'Back'}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 px-4  xl:grid-cols-4 xl:gap-4 ">
            <div className="col-span-full xl:col-span-2">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <h3 className="mb-4 text-xl font-semibold ">Awards</h3>
                <div className="flex flex-wrap mt-4">
                  {award &&
                    award.map((data, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {data.award.issuer}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-span-full xl:col-span-2">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <h3 className="mb-4 text-xl font-semibold ">Projects</h3>
                <div className="flex flex-wrap mt-4">
                  {project &&
                    project.map((data, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 rounded-full px-3 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {data.project.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
