/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import moment from "moment";
import DefaultButton from "../button/defaultButton";
import DefaultLink from "../link/defaultLink";

const ListMember = ({
  photoUrl,
  name,
  email,
  divisi,
  major,
  entryUniversity,
  entryCommunity,
  status,
  nim,
}) => {
  const router = useRouter();

  const handleEdit = (nim) => {
    router.push(`/member/editMember?nim=${nim}`);
  };

  const handleDelete = (nim) => {
    router.push(`/member/delete/${nim}`);
  };

  return (
    <tr
      className="bg-white border-b   hover:bg-gray-50 text-gray-700 cursor-pointer"
      onClick={() => {
        router.push(`/member/detailMember?nim=${nim}`);
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
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
      >
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 rounded-full">
            <img
              src={photoUrl}
              width={0}
              height={0}
              className="w-full h-full object-cover rounded-full"
              alt="profile"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-semibold text-gray-700">{name}</h1>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>
      </th>
      <td className="text-xs font-medium px-6 py-4">{divisi}</td>
      <td className="text-xs font-medium px-6 py-4">{major}</td>
      <td className="text-xs font-medium px-6 py-4">
        {moment(entryUniversity).format(" D MMM YYYY")}
      </td>
      <td className="text-xs font-medium px-6 py-4">
        {moment(entryCommunity).format(" DD MMM YYYY")}
      </td>
      <td className="text-xs font-normal px-6 py-4">
        <div className="flex gap-2 items-center">
          <span
            className={`w-2 h-2 rounded-full ${
              status ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <p>{status ? "Active" : "Inactive"}</p>
        </div>
      </td>
      <td className="text-xs font-medium px-6 py-4 flex gap-3 z-50">
        <DefaultButton
          onClick={(e) => {
            e.stopPropagation(); // Menghentikan penyebaran event ke elemen parent (tr)
            handleEdit(nim); // Panggil fungsi untuk mengarahkan ke halaman edit
          }}
          size="small"
          status="primary"
          title="Edit"
        />
        <DefaultLink
          href={`/member/delete/${nim}`}
          size="small"
          status="secondary"
          title="Delete"
        />
      </td>
    </tr>
  );
};

export default ListMember;
