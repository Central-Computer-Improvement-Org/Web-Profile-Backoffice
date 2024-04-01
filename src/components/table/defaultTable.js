import React from 'react';

export default function DefaultTable({ rowMenu, children }) {
  // Perbaiki deklarasi fungsi dan tambahkan kurung kurawal di sekitar props
  return (
    <div className="relative overflow-x-auto shadow-md ">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            {rowMenu.map(
              (
                item,
                index // Ubah 'datas' menjadi 'item' untuk setiap iterasi
              ) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {item.menu}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
