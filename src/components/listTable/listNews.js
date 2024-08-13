/* eslint-disable @next/next/no-img-element */
import React from "react";
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import DefaultLink from "../link/defaultLink";
import { formatDescription } from "@/app/utils/stringUtils";
import DefaultButton from "../button/defaultButton";
import { useRouter } from "next/navigation";

const ListNews = ({mediaUri, title, description, id }) => {
  const router = useRouter();

  const handleEdit = (id) => {
    router.push(`/news/editNews?id=${id}`);
  };

  const handleDelete = (id) => {
    router.push(`/news/delete/${id}`);
  };

  return (
    <tr
      className="bg-white border-b   hover:bg-gray-50 text-gray-700 cursor-pointer"
      // onClick={() => {
      //   router.push(`/news/detailNews?id=${id}`);
      // }}
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
      <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <div className="w-10 h-10 rounded-full">
          <img
              src={process.env.NEXT_PUBLIC_HOST + mediaUri}
              width={0}
              height={0}
              className="w-full h-full object-cover rounded-full"
              alt="media"
          />
        </div>
      </td>
      <td className="text-xs font-medium px-6 py-4">{title}</td>
      <td className="text-xs font-medium px-6 py-4">
        {parse(DOMPurify.sanitize(formatDescription(description)))}
      </td>
      <td className="text-xs font-medium px-6 py-4 flex gap-3 z-50">
        <DefaultButton
            onClick={(e) => {
              e.stopPropagation(); // Menghentikan penyebaran event ke elemen parent (tr)
              handleEdit(id); // Panggil fungsi untuk mengarahkan ke halaman edit
          }}
          size="small"
          status="primary"
          title="Edit"
        />
        <DefaultLink
          href={`/news/delete/${id}`}
          size="small"
          status="secondary"
          title="Delete"
        />
      </td>
    </tr>
  );
};

export default ListNews;
