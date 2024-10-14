/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import moment from "moment";

import { formatDescription } from "@/app/utils/stringUtils";
import { currency } from "@/app/utils/numberFormat";
import request from "@/app/utils/request";
import DefaultButton from "../button/defaultButton";


const ListEvent = ({
  name,
  division,
  description,
  heldOn,
  budget,
  isActive,
  id,
  fetchData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async (e) => {
    setLoading(true);
    toast.loading("Deleting data...");
    e.preventDefault();

    request.delete(`/cms/events?id=${id}`).then(function (response) {
      if (response.data?.code === 200 || response.data?.code === 201) {
        toast.dismiss();
        toast.success(response.data.data.message);
        fetchData();
      } else if (
        response.response.data.code === 404 &&
        response.response.data.status == "NOT_FOUND"
      ) {
        toast.dismiss();
        toast.error("Event not found");
      } else if (response.response.data.code === 500) {
        toast.dismiss();
        toast.error(response.response.data.error.message);
      }
      setLoading(false);
    });
  };

  return (
    <tr
      className="text-gray-700 bg-white border-b cursor-pointer hover:bg-gray-50"
      onClick={() => {
        router.push(`/event/detailEvent?id=${id}`);
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
      <td className="px-6 py-4 text-xs font-medium">
        {division ? division.name : "None"}
      </td>
      <td className="px-6 py-4 text-xs font-medium">
        {formatDescription(description)}
      </td>
      <td className="px-6 py-4 text-xs font-medium">
        {moment(heldOn).format("MMM YYYY")}
      </td>
      <td className="px-6 py-4 text-xs font-medium">{currency(budget)}</td>
      <td className="px-6 py-4 text-xs font-normal">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <p>{isActive ? "Active" : "Inactive"}</p>
        </div>
      </td>
      <td className="flex gap-3 px-6 py-4 text-xs font-medium">
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/event/editEvent?id=${id}`);
          }}
          href={`/event/detailEvent?id=${id}`}
          size={"small"}
          status={"primary"}
          title={"Edit"}
        />
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          type={"button"}
          size={"small"}
          status={"secondary"}
          title={"Delete"}
        />
      </td>
    </tr>
  );
};

export default ListEvent;