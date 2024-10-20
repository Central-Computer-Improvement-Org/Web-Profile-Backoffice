/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { formatDescription } from "@/app/utils/stringUtils";
import request from "@/app/utils/request";
import DefaultButton from "../button/defaultButton";
import LogoNotfound from '/public/assets/icon/notfound.svg';


const ListDivision = ({ 
  name, 
  logoUri, 
  description, 
  id, 
  fetchData 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async (e) => {
    setLoading(true);
    toast.loading("Deleting data...");
    e.preventDefault();

    request
      .delete(`/cms/users/divisions?id=${id}`)
      .then(function (response) {
        if (response.data?.code === 200 || response.data?.code === 201) {
          toast.dismiss();
          toast.success(response.data.data.message);
          fetchData();
        } else if (response.response.data.code === 400 && response.response.data.status == "VALIDATION_ERROR") {
          toast.dismiss();
          toast.error("Division cannot be deleted");
        } else if (response.response.data.code === 404 && response.response.data.status == "NOT_FOUND") {
          toast.dismiss();
          toast.error("Division not found");
        } else if (response.response.data.code === 500) {
          toast.dismiss();
          toast.error(response.response.data.error.message);
        }
        setLoading(false);
      });
  }

  return (
    <tr
      className="text-gray-700 bg-white border-b cursor-pointer hover:bg-gray-50"
      onClick={() => {
        router.push(`/division/detailDivision?id=${id}`);
      }}
    >
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id="checkbox-table-search-2"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
          />
          <label htmlFor="checkbox-table-search-2" className="sr-only">
            checkbox
          </label>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-medium">{name}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <div className="w-10 h-10 rounded-full">
        <img
          src={logoUri ? `${process.env.NEXT_PUBLIC_HOST}` + logoUri : LogoNotfound.src}
          width={100}
          height={100}
          className="object-cover w-full h-full rounded-full"
          alt="Logo Division CCI"
        />
        </div>
      </th>
      <td className="px-6 py-4 text-xs font-medium">
        {formatDescription(description)}
      </td>
      <td className="flex gap-3 px-6 py-4 text-xs font-medium">
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/division/editDivision?id=${id}`);
          }}
          href={`/division/detailDivision?id=${id}`}
          size={"small"}
          status={"primary"}
          title={"Edit"}
        />
        <DefaultButton
          onClick={
            (e) => {
              e.stopPropagation();
              onDelete(e);
            }
          }
          type={"button"}
          size={"small"}
          status={"secondary"}
          title={"Delete"}
        />
      </td>
    </tr>
  );
};

export default ListDivision;