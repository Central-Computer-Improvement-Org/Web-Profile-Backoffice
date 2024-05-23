'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

//import Components
import DefaultButton from '@/components/button/defaultButton';
import MenuSidebar from '@/components/menuSidebar';

//import Icon
import { BiSolidDashboard } from 'react-icons/bi';
import { BsCalendar2EventFill, BsFillPeopleFill } from 'react-icons/bs';
import { IoNewspaper, IoSettings } from 'react-icons/io5';
import { AiFillProject } from 'react-icons/ai';
import { FaAward } from 'react-icons/fa6';
import { FaProjectDiagram } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { PiAddressBookTabsLight } from 'react-icons/pi';
import { LiaAddressBook } from 'react-icons/lia';

//import Images
import Logo from '../../../public/assets/image/logo.png';
import NextBreadcrumb from '@/components/breadcrumbs';
import Link from 'next/link';
import Cookies from 'js-cookie';
import request from '../utils/request';

const MainLayout = ({ children }) => {
  const router = useRouter();
  const [defaultLogoUri, setDefaultLogoUri] = useState();
  const [titleWebsite, setTitleWebsite] = useState('');
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('nim');
    Cookies.remove('token');
    router.push('/login');
  };

  useEffect(() => {
    request
      .get(`/cms/setting`)
      .then(function (response) {
        const data = response.data.data;
        setTitleWebsite(data.titleWebsite);
        setDefaultLogoUri(data.logoUri);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <Link href="#" className="flex gap-2">
                <Image
                  width={0}
                  height={0}
                  src={
                    defaultLogoUri
                      ? 'https://103-31-38-146.sslip.io' + defaultLogoUri
                      : Logo
                  }
                  className="w-full h-12 object-cover"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-gray-500 text-3xl font-semibold whitespace-nowrap ">
                  {titleWebsite ?? CCI}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 "
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white flex flex-col justify-between ">
          <ul className="space-y-2 font-medium">
            <li>
              <MenuSidebar
                href="/dashboard"
                icon={<BiSolidDashboard className="text-xl" />}
                title={'Dashboard'}
              />
            </li>
            <li>
              <MenuSidebar
                href="/event"
                icon={<BsCalendar2EventFill className="text-xl" />}
                title={'Event'}
              />
            </li>
            <li>
              <MenuSidebar
                href="/news"
                icon={<IoNewspaper className="text-xl" />}
                title={'News'}
              />
            </li>
            <li>
              <MenuSidebar
                href="/division"
                icon={<FaProjectDiagram className="text-xl" />}
                title={'Division'}
              />
            </li>
            <li>
              <MenuSidebar
                href="/member"
                icon={<BsFillPeopleFill className="text-xl" />}
                title={'Member'}
              />
            </li>
            <li>
              <MenuSidebar
                href="/project"
                icon={<AiFillProject className="text-xl" />}
                title={'Project'}
              />
            </li>
            <li>
              <MenuSidebar
                href="/award"
                icon={<FaAward className="text-xl" />}
                title={'Award'}
              />
            </li>
          </ul>
          <ul className="space-y-2 font-medium">
            <li>
              <MenuSidebar
                href="/contact"
                icon={<LiaAddressBook className="text-xl" />}
                title={'Contact'}
              />
            </li>
            <li>
              <MenuSidebar
                href="/setting"
                icon={<IoSettings className="text-xl" />}
                title={'Setting'}
              />
            </li>
            <li>
              <DefaultButton
                title={'Logout'}
                type={'submit'}
                onClick={handleLogout}
                status={'primary'}
                size={'base'}
                full={true}
              />
            </li>
          </ul>
        </div>
      </aside>

      <div className=" sm:ml-64">
        <div className="mt-16">
          <div className="px-4 py-4 bg-white block sm:flex items-center justify-between ">
            <div className="w-full mb-1">
              <NextBreadcrumb
                separator={
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                }
                activeClasses="text-gray-400"
                capitalizeLinks
              />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
