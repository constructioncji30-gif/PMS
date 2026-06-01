"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import CommonDataGrid from "@/app/component/DataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { SearchCheck, Loader2, Search, Eye } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  sex: string;
  dob: string;
  cellPhone: string;
  email: string;
  city: string;
  status: string;
}

export default function SearchPatient() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      let url = `${API_BASE}/patients?limit=100`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      
      if (data.success) setPatients(data.patients || []);
      else setError(data.error || "Failed to fetch patients");
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPatients(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleViewClinical = (patientId: number) => {
    router.push(`/patient/${patientId}/clinical-view`);
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID", size: 60 },
    { accessorKey: "name", header: "Name", size: 150 },
    { accessorKey: "gender", header: "Gender", size: 100 },
    { accessorKey: "age", header: "Age", size: 60 },
    { accessorKey: "phone", header: "Phone", size: 120 },
    { accessorKey: "city", header: "City", size: 120 },
    { 
      accessorKey: "status", header: "Status", size: 100,
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>
          {row.original.status}
        </span>
      )
    },
    {
      id: "actions", header: "Actions", size: 120,
      cell: ({ row }) => (
        <Button varient="primary"     onClick={() => handleViewClinical(row.original.id)}>
          <Eye size={14} className="mr-1" /> View
        </Button>
      )
    }
  ];

  const formattedPatients = patients.map(patient => ({
    id: patient.patientId,
    name: `${patient.firstName} ${patient.lastName}`,
    gender: patient.sex || "N/A",
    age: calculateAge(patient.dob),
    phone: patient.cellPhone || "N/A",
    city: patient.city || "N/A",
    status: patient.status || "Active"
  }));

  if (loading && patients.length === 0) {
    return (
      <div className="rounded-md border shadow-md">
        <div className="flex flex-col sm:flex-row bg-primary items-center border-b p-2 gap-2">
          <div className="flex items-center text-white"><SearchCheck /><span className="ml-1">Search Patient</span></div>
          <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
        </div>
        <div className="flex justify-center items-center h-64"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-md">
      <div className="flex flex-col sm:flex-row bg-primary items-center border-b p-2 gap-2">
        <div className="flex items-center text-white"><SearchCheck /><span className="ml-1 whitespace-nowrap">Search Patient</span></div>
        <Input placeholder="Search by name, phone, or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
      </div>
      <div className="px-4 py-2 bg-gray-50 border-b text-sm flex justify-between">
        <span>Total: {patients.length} patients</span>
        {searchTerm && <span>Search: "{searchTerm}"</span>}
      </div>
      <CommonDataGrid columns={columns} data={formattedPatients} initialPageSize={10} maxHeight="500px" />
      {patients.length === 0 && !loading && <div className="text-center py-8 text-gray-500">No patients found</div>}
    </div>
  );
}