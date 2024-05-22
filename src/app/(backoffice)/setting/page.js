'use client';
import TextareaField from '@/components/form/textareaField';
import HeadTitle from '@/components/headTitle';
// import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
// const RichTextEditor = dynamic(
//   () => import('@/components/form/inputRichText'),
//   {
//     ssr: false,
//   }
// );

export default function SettingPage() {
  const [description, setDescription] = useState();
  const [logoProfile, setLogoProfile] = useState();
  const [parsedHTML, setParsedHTML] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const newsId = useSearchParams().get('id');
  // const [title, setTitle] = useState();
  // const [image, setImage] = useState();
  // const [date, setDate] = useState();
  // const [newsTopData, setNewsTopData] = useState(null);
  // const [newsAlso, setNewsAlso] = useState([]);
  // useEffect(() => {
  //   if (description) {
  //     const doc = new DOMParser().parseFromString(description, 'text/html');
  //     const htmlElement = doc.documentElement;
  //     const classNames = Array.from(htmlElement.classList).join(' ');
  //     htmlElement.setAttribute('class', classNames);
  //     setParsedHTML(htmlElement);
  //   } else {
  //     setParsedHTML(null);
  //   }
  // }, [description]);
  return (
    <HeadTitle title={'Setting'}>
      <div className="grid grid-cols-1 pt-6 xl:grid-cols-3 xl:gap-4 ">
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
            <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <Image
                width={0}
                height={0}
                className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 object-cover"
                src="https://i.pinimg.com/474x/a3/8b/d1/a38bd1248d121d1302c4126fb859accb.jpg"
                alt="Jese picture"
              />
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 ">
                  Profile picture
                </h3>
                <div className="mb-4 text-sm text-gray-500 ">
                  JPG, GIF or PNG. Max size of 800K
                </div>
                <div className="flex items-center space-x-4">
                  <label
                    for="logoProfile"
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
                    id={'logoProfile'}
                    name={'logoProfile'}
                    accept={'image/*'}
                    type={'file'}
                    value={logoProfile}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const img = e.target.files[0];
                        setLogoProfile(img);
                      }
                    }}
                    multiple={true}
                    required={true}
                    readOnly={true}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
            <h3 className="mb-4 text-xl font-semibold ">Description CCI</h3>
            <div className="mb-4">
              <h1 className="text-lg text-gray-800 text-start md:text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </h1>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
            <h3 className="mb-4 text-xl font-semibold ">General information</h3>
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 ">
                  <label
                    for="first-name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                    placeholder="Bonnie"
                    required
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    for="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                    placeholder="Green"
                    required
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    for="country"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Title Website
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                    placeholder="United States"
                    required
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    for="city"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Keyword
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                    placeholder="e.g. San Francisco"
                    required
                  />
                </div>
                <div className="col-span-6 ">
                  <label
                    for="city"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Description
                  </label>
                  <TextareaField
                    id={'description'}
                    name={'description'}
                    placeholder={'e.g Description ...'}
                    value={description}
                    required
                    // label={'Description'}
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
            </form>
          </div>
        </div>
      </div>
    </HeadTitle>
  );
}
