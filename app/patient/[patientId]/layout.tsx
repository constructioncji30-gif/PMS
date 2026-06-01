"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  Activity,
  AlertCircle,
  Pill,
  Stethoscope,
  FlaskConical,
  Camera,
  FileText,
  Calendar,
  LayoutDashboard,
  ChevronLeft
} from "lucide-react";
import Button from "@/app/component/Button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const tabs = [
  { id: "demographic", label: "Demographic", icon: <User size={16} />, path: "demographic" },
  { id: "clinical-view", label: "Clinical Summary", icon: <LayoutDashboard size={16} />, path: "clinical-view" },
  { id: "encounters", label: "Encounters", icon: <Calendar size={16} />, path: "encounters" },
  { id: "vitals", label: "Vitals", icon: <Activity size={16} />, path: "vitals" },
  { id: "allergies", label: "Allergies", icon: <AlertCircle size={16} />, path: "allergies" },
  { id: "medications", label: "Medications", icon: <Pill size={16} />, path: "medications" },
  { id: "diagnoses", label: "Diagnoses", icon: <Stethoscope size={16} />, path: "diagnoses" },
  { id: "labs", label: "Labs", icon: <FlaskConical size={16} />, path: "labs" },
  { id: "imaging", label: "Imaging", icon: <Camera size={16} />, path: "imaging" },
  { id: "notes", label: "Notes", icon: <FileText size={16} />, path: "notes" }
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const patientId = params.patientId as string;
  
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(true);

  const activeTab = pathname.split("/").pop() || "clinical-view";

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
    
    if (patientId) fetchPatient();
  }, [patientId]);

  

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-2 text-sm"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-2xl font-bold">{patientName}</h1>
            <p className="text-gray-500 text-sm">Patient ID: {patientId}</p>
          </div>
          <Button varient="secondary"     onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>

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
              {tab.icon}
              {tab.label}
              {activeTab === tab.path && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        {children}
      </div>
    </div>
  );
}