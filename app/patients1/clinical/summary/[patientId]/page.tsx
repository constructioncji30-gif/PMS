"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  Pill,
  Stethoscope,
  FlaskConical,
  Camera,
  FileText,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Printer
} from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";

interface Patient {
  patientId: number;
  name: string;
  age: number;
  gender: string;
  dob: string;
  phone: string;
  email: string;
}

interface Allergy {
  allergyId: number;
  allergen: string;
  allergyType: string;
  reaction: string;
  severity: string;
  status: string;
}

interface Medication {
  medicationId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  status: string;
}

interface Diagnosis {
  diagnosisId: number;
  diagnosisName: string;
  icdCode: string;
  diagnosisType: string;
  status: string;
}

interface Vital {
  vitalId: number;
  temperature: number;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number;
  measuredAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ClinicalSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Modal states
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchClinicalSummary();
  }, [patientId]);

  const fetchClinicalSummary = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/summary/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPatient(data.summary.patient);
        setAllergies(data.summary.allergies || []);
        setMedications(data.summary.medications || []);
        setDiagnoses(data.summary.activeDiagnoses || []);
        setVitals(data.summary.recentVitals || []);
      }
    } catch (error) {
      console.error("Error fetching clinical summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchClinicalSummary();
        alert(`${type} deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={16} /> },
    { id: "allergies", label: "Allergies", icon: <AlertCircle size={16} /> },
    { id: "medications", label: "Medications", icon: <Pill size={16} /> },
    { id: "diagnoses", label: "Diagnoses", icon: <Stethoscope size={16} /> },
    { id: "vitals", label: "Vitals", icon: <Activity size={16} /> }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading clinical summary...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Patient Header */}
      <CommonCard title="Patient Clinical Summary" icon={<Activity />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-semibold">{patient?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Age / Gender</label>
            <p className="font-semibold">{patient?.age} yrs / {patient?.gender}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">DOB</label>
            <p className="font-semibold">{patient?.dob}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Contact</label>
            <p className="font-semibold">{patient?.phone}</p>
          </div>
        </div>
      </CommonCard>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CommonCard title="Active Allergies" icon={<AlertCircle size={18} />}>
            {allergies.filter(a => a.status === 'Active').map(allergy => (
              <div key={allergy.allergyId} className="border-b py-2 flex justify-between">
                <div>
                  <span className="font-medium">{allergy.allergen}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                    allergy.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {allergy.severity}
                  </span>
                  <p className="text-sm text-gray-500">{allergy.reaction}</p>
                </div>
                <button onClick={() => handleDelete('allergies', allergy.allergyId)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
            {allergies.filter(a => a.status === 'Active').length === 0 && (
              <p className="text-gray-500 text-center py-4">No active allergies</p>
            )}
          </CommonCard>

          <CommonCard title="Active Medications" icon={<Pill size={18} />}>
            {medications.filter(m => m.status === 'Active').map(med => (
              <div key={med.medicationId} className="border-b py-2 flex justify-between">
                <div>
                  <span className="font-medium">{med.medicationName}</span>
                  <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                </div>
                <button onClick={() => handleDelete('medications', med.medicationId)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
            {medications.filter(m => m.status === 'Active').length === 0 && (
              <p className="text-gray-500 text-center py-4">No active medications</p>
            )}
          </CommonCard>

          <CommonCard title="Active Diagnoses" icon={<Stethoscope size={18} />}>
            {diagnoses.map(diag => (
              <div key={diag.diagnosisId} className="border-b py-2 flex justify-between">
                <div>
                  <span className="font-medium">{diag.diagnosisName}</span>
                  <p className="text-sm text-gray-500">ICD-10: {diag.icdCode}</p>
                </div>
                <button onClick={() => handleDelete('diagnoses', diag.diagnosisId)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
            {diagnoses.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active diagnoses</p>
            )}
          </CommonCard>

          <CommonCard title="Recent Vitals" icon={<Activity size={18} />}>
            {vitals.map(vital => (
              <div key={vital.vitalId} className="border-b py-2">
                <div className="flex justify-between">
                  <span>Temperature: {vital.temperature}°C</span>
                  <span>HR: {vital.heartRate} bpm</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>BP: {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</span>
                  <span>SpO2: {vital.oxygenSaturation}%</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(vital.measuredAt).toLocaleString()}
                </div>
              </div>
            ))}
            {vitals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No vital records</p>
            )}
          </CommonCard>
        </div>
      )}

      {/* Allergies Tab */}
      {activeTab === "allergies" && (
        <CommonCard
          title="Allergies"
          icon={<AlertCircle />}
          button={
            <Button varient="primary" onClick={() => setIsAllergyModalOpen(true)}>
              <Plus size={16} className="mr-1" /> Add Allergy
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Allergen</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Reaction</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allergies.map(allergy => (
                  <tr key={allergy.allergyId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{allergy.allergen}</td>
                    <td className="px-4 py-3">{allergy.allergyType}</td>
                    <td className="px-4 py-3">{allergy.reaction}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                        allergy.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {allergy.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">{allergy.status}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete('allergies', allergy.allergyId)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CommonCard>
      )}

      {/* Medications Tab */}
      {activeTab === "medications" && (
        <CommonCard
          title="Medications"
          icon={<Pill />}
          button={
            <Button varient="primary" onClick={() => setIsMedicationModalOpen(true)}>
              <Plus size={16} className="mr-1" /> Prescribe Medication
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Medication</th>
                  <th className="px-4 py-3 text-left">Dosage</th>
                  <th className="px-4 py-3 text-left">Frequency</th>
                  <th className="px-4 py-3 text-left">Route</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medications.map(med => (
                  <tr key={med.medicationId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{med.medicationName}</td>
                    <td className="px-4 py-3">{med.dosage}</td>
                    <td className="px-4 py-3">{med.frequency}</td>
                    <td className="px-4 py-3">{med.route}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        med.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {med.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete('medications', med.medicationId)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CommonCard>
      )}

      {/* Diagnoses Tab */}
      {activeTab === "diagnoses" && (
        <CommonCard
          title="Diagnoses"
          icon={<Stethoscope />}
          button={
            <Button varient="primary" onClick={() => setIsDiagnosisModalOpen(true)}>
              <Plus size={16} className="mr-1" /> Add Diagnosis
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Diagnosis</th>
                  <th className="px-4 py-3 text-left">ICD Code</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {diagnoses.map(diag => (
                  <tr key={diag.diagnosisId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{diag.diagnosisName}</td>
                    <td className="px-4 py-3">{diag.icdCode}</td>
                    <td className="px-4 py-3">{diag.diagnosisType}</td>
                    <td className="px-4 py-3">{diag.status}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete('diagnoses', diag.diagnosisId)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CommonCard>
      )}
    </div>
  );
}