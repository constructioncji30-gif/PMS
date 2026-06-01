"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import { User, Edit, Save, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  dob: string;
  sex: string;
  email: string;
  cellPhone: string;
  homePhone: string;
  workPhone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  status: string;
  maritalStatus: string;
  preferredLanguage: string;
  comments: string;
}

export default function DemographicPage() {
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPatient(data.patient);
        setFormData(data.patient);
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/patients/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setPatient(data.patient);
        setIsEditing(false);
        alert("Patient updated successfully");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <span className="text-blue-600 font-semibold">Patient ID:</span>
        <span className="text-blue-800 ml-2 font-mono">{patientId}</span>
      </div>

      <CommonCard
        title="Demographic Information"
        icon={<User size={18} />}
        button={
          !isEditing ? (
            <Button varient="primary" onClick={() => setIsEditing(true)}>
              <Edit size={16} className="mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button varient="secondary" onClick={() => setIsEditing(false)}>
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button varient="primary" onClick={handleSave}>
                <Save size={16} className="mr-1" /> Save
              </Button>
            </div>
          )
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-500">Patient ID</label>
            <p className="font-medium">{patient?.patientId}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">First Name</label>
            {isEditing ? (
              <Input name="firstName" value={formData.firstName || ""} onChange={handleChange} />
            ) : (
              <p className="font-medium">{patient?.firstName}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Middle Name</label>
            {isEditing ? (
              <Input name="middleName" value={formData.middleName || ""} onChange={handleChange} />
            ) : (
              <p className="font-medium">{patient?.middleName || "-"}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Last Name</label>
            {isEditing ? (
              <Input name="lastName" value={formData.lastName || ""} onChange={handleChange} />
            ) : (
              <p className="font-medium">{patient?.lastName}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Date of Birth</label>
            {isEditing ? (
              <Input type="date" name="dob" value={formData.dob?.split('T')[0] || ""} onChange={handleChange} />
            ) : (
              <p className="font-medium">{patient?.dob}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Gender</label>
            {isEditing ? (
              <select name="sex" value={formData.sex || ""} onChange={handleChange} className="w-full border rounded-md p-2">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="font-medium">{patient?.sex}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            {isEditing ? (
              <Input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
            ) : (
              <p className="font-medium">{patient?.email}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Cell Phone</label>
            {isEditing ? (
              <Input name="cellPhone" value={formData.cellPhone || ""} onChange={handleChange} />
            ) : (
              <p className="font-medium">{patient?.cellPhone}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Status</label>
            {isEditing ? (
              <select name="status" value={formData.status || ""} onChange={handleChange} className="w-full border rounded-md p-2">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            ) : (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient?.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>
                {patient?.status}
              </span>
            )}
          </div>
          <div className="col-span-full">
            <label className="text-sm text-gray-500">Address</label>
            {isEditing ? (
              <Input name="address1" value={formData.address1 || ""} onChange={handleChange} />
            ) : (
              <p className="font-medium">{patient?.address1}</p>
            )}
          </div>
        </div>
      </CommonCard>
    </div>
  );
}