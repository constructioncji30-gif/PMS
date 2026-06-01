"use client";

import { useState, useEffect } from "react";
import Button from "@/app/component/Button";
import CommonSearch from "@/app/component/CommonSearch";
import CommonDataGrid from "@/app/component/DataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { SearchCheck, Loader2 } from "lucide-react";

// Define patient type matching your backend
interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  sex: string;
  dob: string;
  cellPhone: string;
  email: string;
  city: string;
  state: string;
  status: string;
}

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function SearchPatient({ setData, setActive, setScreen }: any) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      
      let url = `${API_BASE}/patients?limit=100`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.patients || []);
      } else {
        setError(data.error || "Failed to fetch patients");
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial load
  useEffect(() => {
    fetchPatients();
  }, []);

  // Format patient for display
  const formatPatient = (patient: Patient) => ({
    id: patient.patientId,
    name: `${patient.firstName} ${patient.lastName}`,
    gender: patient.sex || "Not specified",
    age: calculateAge(patient.dob),
    phone: patient.cellPhone || "N/A",
    city: patient.city || "N/A",
    status: patient.status || "Active",
    email: patient.email,
    originalPatient: patient
  });

  // Define columns
  const columns: ColumnDef<any>[] = [
    { accessorKey: "id", header: "ID", size: 60 },
    { accessorKey: "name", header: "Name", size: 150 },
    { accessorKey: "gender", header: "Gender", size: 100 },
    { accessorKey: "age", header: "Age", size: 60 },
    { accessorKey: "phone", header: "Phone", size: 120 },
    { accessorKey: "city", header: "City", size: 120 },
    { 
      accessorKey: "status", 
      header: "Status", 
      size: 100,
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {row.original.status}
        </span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      size: 100,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            varient="primary"
               
            onClick={() => {
              // Check if patient already exists in selection
              const exists = (data: any[]) => data.some((item: any) => item.id === row.original.id);
              
              setData((prevData: any[]) => 
                exists(prevData) ? prevData : [...prevData, row.original]
              );
              setActive(row.original.id);
              setScreen(row.original.id);
            }}
          >
            Select
          </Button>
        </div>
      ),
    },
  ];

  // Format patients for grid display
  const formattedPatients = patients.map(formatPatient);

  // Loading state
  if (loading && patients.length === 0) {
    return (
      <div className="flex flex-col mt-1 rounded-md border border-border mx-2 shadow-md">
        <div className="flex flex-col sm:flex-row bg-primary items-center border-purple-600 border-b-2 text-sm mb-1 text-white font-semibold p-[0.7px] gap-2 sm:gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <SearchCheck />
            <div className="ml-1 whitespace-nowrap">Search Patient</div>
          </div>
          <CommonSearch 
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500">Loading patients...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col mt-1 rounded-md border border-border mx-2 shadow-md">
        <div className="flex flex-col sm:flex-row bg-primary items-center border-purple-600 border-b-2 text-sm mb-1 text-white font-semibold p-[0.7px] gap-2 sm:gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <SearchCheck />
            <div className="ml-1 whitespace-nowrap">Search Patient</div>
          </div>
          <CommonSearch 
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <Button varient="primary"     onClick={fetchPatients} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-1 rounded-md border border-border mx-2 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-primary items-center border-purple-600 border-b-2 text-sm mb-1 text-white font-semibold p-[0.7px] gap-2 sm:gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <SearchCheck />
          <div className="ml-1 whitespace-nowrap">Search Patient</div>
        </div>
        <CommonSearch 
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, or email..."
        />
      </div>

      {/* Stats */}
      <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600 flex justify-between">
        <span>Total Patients: {patients.length}</span>
        {searchTerm && <span>Search results for: "{searchTerm}"</span>}
      </div>

      {/* Data Grid */}
      <CommonDataGrid
        columns={columns}
        data={formattedPatients}
        initialPageSize={5}
        maxHeight="400px"
      />

      {/* No results */}
      {patients.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No patients found matching your search" : "No patients available"}
        </div>
      )}
    </div>
  );
}

export default SearchPatient;