"use client";

import { useState } from "react";
import CommonCard from "../../component/CommonCard";
import { SearchCheck } from "lucide-react";
import CommonLink from "@/app/component/CommonLink";
import Button from "@/app/component/Button";
 import { ColumnDef } from "@tanstack/react-table";
import CommonDataGrid from "@/app/component/DataGrid";

// Define your type
interface Practice {
  id: number;
  name: string;
  practiceId: string;
  type: string;
  phone: string;
  city: string;
  status: string;
}

// Define columns directly
const columns: ColumnDef<Practice>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Practice Name" },
  { accessorKey: "practiceId", header: "Practice ID" },
  { accessorKey: "type", header: "Practice Type" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button varient="primary" onClick={() => alert(`Edit ${row.original.name}`)}>
          Edit
        </Button>
        <Button varient="danger" onClick={() => alert(`Delete ${row.original.name}`)}>
          Delete
        </Button>
      </div>
    ),
  },
];

// Dummy data
const dummyData: Practice[] = [
  { id: 1, name: "Central Clinic", practiceId: "C101", type: "Clinic", phone: "123-456-7890", city: "Riyadh", status: "Active" },
  { id: 2, name: "City Hospital", practiceId: "H202", type: "Hospital", phone: "234-567-8901", city: "Jeddah", status: "Inactive" },
  { id: 3, name: "LabCare", practiceId: "L303", type: "Laboratory", phone: "345-678-9012", city: "Dammam", status: "Active" },
  { id: 4, name: "PharmaPlus", practiceId: "P404", type: "Pharmacy", phone: "456-789-0123", city: "Riyadh", status: "Active" },
];

export default function PracticeGridPage() {
  const [data, setData] = useState<Practice[]>(dummyData);

  return (
    <CommonCard
      icon={<SearchCheck />}
      button={
        <CommonLink
          varient="primary"
          href="/settings/practice/create"
          title="Create Practice"
        />
      }
      title="Search Practice"
    >
      <div className="">
        <CommonDataGrid columns={columns} data={data} initialPageSize={5} maxHeight="400px" />
      </div>
    </CommonCard>
  );
}
