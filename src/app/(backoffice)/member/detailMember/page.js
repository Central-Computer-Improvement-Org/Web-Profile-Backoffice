/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import moment from "moment";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { StateContext } from "@/app/(backoffice)/state";
import request from "@/app/utils/request";
import InputField from "@/components/form/inputField";
import LogoNotfound from '/public/assets/icon/notfound.svg';


export default function DetailMemberPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nim = searchParams.get("nim");

  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [linkedinUri, setLinkedinUri] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileUri, setProfileUri] = useState("");
  const [status, setStatus] = useState();
  const [yearUniversityEnrolled, setYearUniversityEnrolled] = useState("");
  const [yearCommunityEnrolled, setYearCommunityEnrolled] = useState("");
  const { setMemberName, setMemberNim } = useContext(StateContext);
  // GUNAKAN INI JIKA INGIN MENAMPILKAN AWARD DAN PROJECT
  // const [award, setAward] = useState();
  // const [project, setProject] = useState();

  const [loading, setLoading] = useState(true);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Text copied to clipboard :", text);
        // Optionally, you can show a toast or notification to indicate successful copy
      })
      .catch((error) => {
        toast.error("Error copying text to clipboard :", error);
        // Optionally, you can show a toast or notification to indicate copy failure
      });
  };

  const fetchMember = async (nim) => {
    request
      .get(`/cms/users?nim=${nim}`)
      .then(function (response) {
        const data = response.data.data;
        setRole(data.role);
        setDivision(data.division);
        setName(data.name);
        setEmail(data.email);
        setMajor(data.major);
        setLinkedinUri(data.linkedinUri);
        setPhoneNumber(data.phoneNumber);
        setProfileUri(data.profileUri);
        setStatus(data.isActive);
        setYearUniversityEnrolled(data.yearUniversityEnrolled);
        setYearCommunityEnrolled(data?.yearCommunityEnrolled);
        setMemberName(data.name);
        setMemberNim(data.nim);
        // GUNAKAN INI JIKA INGIN MENAMPILKAN AWARD DAN PROJECT
        // setAward(data.awards);
        // setProject(data.projects);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      }
      );
  }

  useEffect(() => {
    fetchMember(nim);
    if (!nim) {
      router.push("/member");
      return;
    }
  }, [nim, router]);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
            <div className="col-span-full xl:col-auto">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                  <div className="rounded-lg w-28 h-28">
                    <img
                      src={
                        profileUri
                          ? `${process.env.NEXT_PUBLIC_HOST}` + profileUri
                          : LogoNotfound.src
                      }
                      width={0}
                      height={0}
                      className="object-cover w-full h-full mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                      alt="Picture member CCI"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-green-500`} />
                      <h3 className="mt-1 mb-1 text-xl font-bold text-gray-900 ">
                        {name}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-500 "></div>
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
                          {/* <Link
                            href="#"
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                          >
                            Copy
                          </Link> */}
                          <button
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                            onClick={() =>
                              copyToClipboard(`+62 ${phoneNumber}`)
                            }
                          >
                            Copy
                          </button>
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
                            href={linkedinUri}
                            className="text-sm font-normal underline truncate text-secondary-500 "
                          >
                            {linkedinUri.substring(0, 30)}
                            ...
                          </Link>
                        </div>
                        <div className="inline-flex items-center">
                          {/* <Link
                            href="#"
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                          >
                            Copy
                          </Link> */}
                          <button
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                            onClick={() => copyToClipboard(`${linkedinUri}`)}
                          >
                            Copy
                          </button>
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
                          {/* <Link
                            href="#"
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                          >
                            Copy
                          </Link> */}
                          <button
                            className="px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 "
                            onClick={() => copyToClipboard(`${email}`)}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-2 ">
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <h3 className="mb-4 text-xl font-semibold ">
                  General information
                </h3>
                <form action="#">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"nim"}
                        name={"nim"}
                        type={"text"}
                        label={"NIM"}
                        disabled={true}
                        readOnly={true}
                        value={nim}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"role"}
                        name={"role"}
                        type={"text"}
                        label={"Role"}
                        disabled={true}
                        readOnly={true}
                        value={(role) ? role.name : "None"}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"name"}
                        name={"name"}
                        type={"text"}
                        value={(name) ? name : "None"}
                        label={"Name"}
                        disabled={true}
                        readOnly={true}
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"division"}
                        name={"division"}
                        type={"text"}
                        label={"Division"}
                        disabled={true}
                        readOnly={true}
                        value={(division) ? division.name : "None"}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"major"}
                        name={"major"}
                        placeholder={"e.g. S1 Informatika"}
                        type={"text"}
                        value={(major) ? major : "None"}
                        label={"Major"}
                        disabled={true}
                        readOnly={true}
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"phoneNumber"}
                        name={"phoneNumber"}
                        type={"text"}
                        label={"Phone number"}
                        value={(phoneNumber) ? phoneNumber : "None"}
                        disabled={true}
                        readOnly={true}
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"entryUniversity"}
                        name={"entryUniversity"}
                        type={"text"}
                        label={"Entry university"}
                        value={moment(yearUniversityEnrolled).format(
                          "D MMM YYYY"
                        )}
                        disabled={true}
                        readOnly={true}
                        required
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputField
                        id={"entryCommunity"}
                        name={"entryCommunity"}
                        type={"text"}
                        label={"Entry community"}
                        value={ yearCommunityEnrolled}
                        disabled={true}
                        readOnly={true}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 px-4 xl:grid-cols-4 xl:gap-4 ">
            <div className="col-span-full xl:col-span-2">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <h3 className="mb-4 text-xl font-semibold ">Awards</h3>
                <div className="flex flex-wrap mt-4">
                  {/* {award &&
                    award.map((data, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-3 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
                      >
                        {data.issuer}
                      </span>
                    ))} */}
                </div>
              </div>
            </div>
            <div className="col-span-full xl:col-span-2">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
                <h3 className="mb-4 text-xl font-semibold ">Projects</h3>
                <div className="flex flex-wrap mt-4">
                  {/* {project &&
                    project.map((data, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-3 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
                      >
                        {data.name}
                      </span>
                    ))} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};