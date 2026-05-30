"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

type CommonDataGridProps<T> = {
  columns: any[];
  data: any[];
  initialPageSize?: number;
  maxHeight?: string;
};

export default function CommonDataGrid<T>({
  columns,
  data,
  initialPageSize = 5,
 }: CommonDataGridProps<T>) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
     <div className="">
      <div className="overflow-x-auto overflow-y-auto bg-white max-h-[400px]">
        <table className="min-w-full bg-white border-border text-sm">
          <thead className="bg-white border-b-2 sticky headtable top-0 text-xs font-semibold text-white">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className="px-3 py-1 text-left bg-header"
                    style={
                      index === 0
                        ? { borderTopLeftRadius: "8px" }
                        : index === hg.headers.length - 1
                        ? { borderTopRightRadius: "8px" }
                        : {}
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="border border-border">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-slate-300" : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-1 text-sm border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap  text-xs font-semibold items-center gap-3 mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-full disabled:opacity-50"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <i className="text-md p-0">«</i> First
          </button>
          <button
            className="px-3 py-1 border rounded-full disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹ Prev
          </button>
          <button
            className="px-3 py-1 border text-center rounded-full disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next ›
          </button>
          <button
            className="px-3 py-1 border rounded-full disabled:opacity-50"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            Last »
          </button>
        </div>

        <span className="ml-auto">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          {table.getPageCount()}
        </span>

        <label className="flex items-center gap-2">
          Rows:
          <select
            className="border px-2 py-1 rounded"
            value={pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          Go to:
          <input
            type="number"
            min={1}
            max={table.getPageCount() || 1}
            className="w-20 border px-2 py-1 rounded"
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = Number(e.target.value) - 1;
              table.setPageIndex(Number.isNaN(page) ? 0 : page);
            }}
          />
        </label>
      </div>
    </div>
  );
}
