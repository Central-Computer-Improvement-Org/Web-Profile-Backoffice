/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import DefaultLink from "../link/defaultLink";
import { formatDescription } from "@/app/utils/stringUtils";
import DefaultButton from "../button/defaultButton";
import { useRouter } from "next/navigation";

const ListDivision = ({ name, logoUrl, description, id }) => {
  const router = useRouter();
  return (
    <tr
      className="bg-white border-b   hover:bg-gray-50 text-gray-700 cursor-pointer"
      onClick={() => {
        router.push(`/division/detailDivision?id=${id}`);
      }}
    >
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id="checkbox-table-search-2"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500    focus:ring-2  "
          />
          <label htmlFor="checkbox-table-search-2" className="sr-only">
            checkbox
          </label>
        </div>
      </td>

      <td className="text-xs font-medium px-6 py-4">{name}</td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <div className="w-10 h-10 rounded-full">
          <img
            src={logoUrl}
            width={0}
            height={0}
            className="w-full h-full object-cover rounded-full"
            alt="profile"
          />
        </div>
      </th>
      <td className="text-xs font-medium px-6 py-4">
        {formatDescription(description)}
      </td>
      <td className="text-xs font-medium px-6 py-4 flex gap-3">
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
        <DefaultLink
          href={`/division/delete/${id}`}
          size={"small"}
          status={"secondary"}
          title={"Delete"}
        />
      </td>
    </tr>
  );
};

export default ListDivision;
