/* eslint-disable @next/next/no-img-element */
import React from "react";
import DefaultLink from "../link/defaultLink";
import { formatDescription } from "@/app/utils/stringUtils";

const ListNews = ({ title, description, id }) => {
  return (
    <tr className="bg-white border-b   hover:bg-gray-50 text-gray-700 ">
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
      <td className="text-xs font-medium px-6 py-4">{title}</td>
      <td className="text-xs font-medium px-6 py-4">
        {formatDescription(description)}
      </td>
      <td className="text-xs font-medium px-6 py-4 flex gap-3">
        <DefaultLink
          href={`/news/editNews?id=${id}`}
          size={"small"}
          status={"primary"}
          title={"Edit"}
        />
        <DefaultLink
          href={`/news/delete/${id}`}
          size={"small"}
          status={"secondary"}
          title={"Delete"}
        />
      </td>
    </tr>
  );
};

export default ListNews;
