"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const tabs = [
  { id: "demographic", label: "Demographic", icon: "👤", path: "demographic" },
  { id: "encounter", label: "Encounter", icon: "📅", path: "encounter" },
  { id: "vitals", label: "Vitals", icon: "❤️", path: "vitals" },
  { id: "allergies", label: "Allergies", icon: "⚠️", path: "allergies" },
  { id: "medications", label: "Medications", icon: "💊", path: "medications" },
  { id: "diagnosis", label: "Diagnosis", icon: "🩺", path: "diagnosis" },
  { id: "labs", label: "Labs", icon: "🔬", path: "labs" },
  { id: "imaging", label: "Imaging", icon: "📷", path: "imaging" },
  { id: "notes", label: "Notes", icon: "📝", path: "notes" },
  { id: "billing", label: "Billing", icon: "💰", path: "billing" },
  { id: "summary", label: "Summary", icon: "📊", path: "summary" },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const patientId = params.patientId as string;
  
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(true);

  // Get active tab from URL path
  const activeTab = pathname.split("/").pop() || "demographic";

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE}/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setPatientName(`${data.patient.firstName} ${data.patient.lastName}`);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading patient data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{patientName}</h1>
            <p className="text-gray-500 text-sm">Patient ID: {patientId}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex whitespace-nowrap">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/patient/${patientId}/${tab.path}`}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                ${activeTab === tab.path 
                  ? 'border-blue-500 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.path && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}