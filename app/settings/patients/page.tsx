"use client";

import { useState, useEffect } from "react";
import CommonCard from "@/app/component/CommonCard";
import { SearchCheck, Search } from "lucide-react";
import Button from "@/app/component/Button";
import CommonLink from "@/app/component/CommonLink";
import Input from "@/app/component/Input";
import { ColumnDef } from "@tanstack/react-table";
import CommonDataGrid from "@/app/component/DataGrid";
import CommonSearch from "@/app/component/CommonSearch";

// Define patient type
interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  sex?: string;
  dob?: string;
  cellPhone?: string;
  email?: string;
  city?: string;
  state?: string;
  status?: string;
}

const columns: ColumnDef<Patient>[] = [
  { accessorKey: "patientId", header: "ID" },
  { 
    accessorKey: "name", 
    header: "Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`
  },
  { accessorKey: "sex", header: "Gender" },
  { 
    accessorKey: "age", 
    header: "Age",
    cell: ({ row }) => calculateAge(row.original.dob)
  },
  { accessorKey: "cellPhone", header: "Phone" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button varient="primary" onClick={() => alert(row.original)}>
          Edit
        </Button>
        <Button varient="danger" onClick={() => alert(row.original.patientId)}>
          Delete
        </Button>
      </div>
    ),
  },
];

function calculateAge(dob?: string): number | string {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PatientGridPage() {
  const [data, setData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/patients`;
      if (debouncedSearch) {
        url = `${API_BASE_URL}/patients?search=${encodeURIComponent(debouncedSearch)}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setData(result.patients);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        fetchPatients();
        alert('Patient deleted successfully');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (patient: Patient) => {
    window.location.href = `/settings/patients/edit/${patient.patientId}`;
  };

  useEffect(() => {
    fetchPatients();
  }, [debouncedSearch]);

  return (
    
    <CommonCard
      icon={<SearchCheck />}
      button={<>
       <CommonSearch    placeholder={"Search by name, email, or phone..."}
          value={searchTerm}
          onChange={(e:any) => setSearchTerm(e.target.value)}
          className="max-w-md"/>
        <CommonLink
          varient="primary"
          href="/settings/patients/create"
          title="Create Patient"
        />
      
      </>
      
      }
     
      title="Search Patient"
    >
      {/* Search Bar */}
      <div className="mb-4">
        
         
      </div>

      <CommonDataGrid 
        columns={columns} 
        data={data} 
        initialPageSize={10} 
        maxHeight="500px" 
      />
      
      {data.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          No patients found
        </div>
      )}
    </CommonCard>
  );
}