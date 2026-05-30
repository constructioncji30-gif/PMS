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
  ChevronLeft,
  Printer,
  Download,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Heart,
  Thermometer,
  Droplet,
  Wind,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle
} from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  dob: string;
  sex: string;
  email: string;
  cellPhone: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
}

interface VitalSign {
  vitalId: number;
  temperature: number | null;
  heartRate: number | null;
  respiratoryRate: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  oxygenSaturation: number | null;
  measuredAt: string;
  measuredBy: string;
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

interface Lab {
  labId: number;
  labName: string;
  resultValue: string;
  referenceRange: string;
  isAbnormal: boolean;
  status: string;
}

interface Imaging {
  imagingId: number;
  imagingType: string;
  bodyPart: string;
  findings: string;
  status: string;
}

interface ClinicalNote {
  noteId: number;
  noteType: string;
  title: string;
  authoredDate: string;
  authoredBy: string;
}

interface Encounter {
  encounterId: number;
  encounterNumber: string;
  encounterType: string;
  encounterDate: string;
  chiefComplaint: string;
  status: string;
}

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    Scheduled: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getSeverityBadge = (severity: string) => {
  const colors: Record<string, string> = {
    Mild: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    Severe: "bg-orange-100 text-orange-800",
    "Life-threatening": "bg-red-100 text-red-800"
  };
  return colors[severity] || "bg-gray-100";
};

const getTrendIcon = (value: number, normalRange: { min: number; max: number }) => {
  if (!value) return null;
  if (value < normalRange.min) return <TrendingDown size={14} className="text-blue-500" />;
  if (value > normalRange.max) return <TrendingUp size={14} className="text-red-500" />;
  return <Minus size={14} className="text-green-500" />;
};

export default function PatientClinicalView() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [latestVitals, setLatestVitals] = useState<VitalSign | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [recentLabs, setRecentLabs] = useState<Lab[]>([]);
  const [recentImaging, setRecentImaging] = useState<Imaging[]>([]);
  const [recentNotes, setRecentNotes] = useState<ClinicalNote[]>([]);
  const [recentEncounters, setRecentEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllClinicalData();
  }, [patientId]);

  const fetchAllClinicalData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      // Fetch patient data
      const patientRes = await fetch(`${API_BASE}/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const patientData = await patientRes.json();
      if (patientData.success) {
        setPatient(patientData.patient);
      }

      // Fetch latest vitals
      const vitalsRes = await fetch(`${API_BASE}/vitals/patient/${patientId}/latest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const vitalsData = await vitalsRes.json();
      if (vitalsData.success && vitalsData.vital) {
        setLatestVitals(vitalsData.vital);
      }

      // Fetch allergies
      const allergiesRes = await fetch(`${API_BASE}/clinical/allergies/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allergiesData = await allergiesRes.json();
      if (allergiesData.success) {
        setAllergies(allergiesData.allergies || []);
      }

      // Fetch medications
      const medsRes = await fetch(`${API_BASE}/clinical/medications/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const medsData = await medsRes.json();
      if (medsData.success) {
        setMedications(medsData.medications || []);
      }

      // Fetch diagnoses
      const diagRes = await fetch(`${API_BASE}/clinical/diagnoses/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const diagData = await diagRes.json();
      if (diagData.success) {
        setDiagnoses(diagData.activeDiagnoses || []);
      }

      // Fetch recent labs
      const labsRes = await fetch(`${API_BASE}/clinical/labs/${patientId}?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const labsData = await labsRes.json();
      if (labsData.success) {
        setRecentLabs(labsData.labs || []);
      }

      // Fetch recent imaging
      const imagingRes = await fetch(`${API_BASE}/clinical/imaging/${patientId}?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const imagingData = await imagingRes.json();
      if (imagingData.success) {
        setRecentImaging(imagingData.imaging || []);
      }

      // Fetch recent notes
      const notesRes = await fetch(`${API_BASE}/clinical/notes/${patientId}?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const notesData = await notesRes.json();
      if (notesData.success) {
        setRecentNotes(notesData.notes || []);
      }

      // Fetch recent encounters
      const encRes = await fetch(`${API_BASE}/encounters/patient/${patientId}?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const encData = await encRes.json();
      if (encData.success) {
        setRecentEncounters(encData.encounters || []);
      }

    } catch (error) {
      console.error("Error fetching clinical data:", error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-2">
              <ChevronLeft size={16} /> Back to Patient List
            </button>
            <h1 className="text-2xl font-bold">Clinical Summary</h1>
            <p className="text-gray-500">Complete health record for {patient?.firstName} {patient?.lastName}</p>
          </div>
          <div className="flex gap-2">
            <Button varient="secondary" size="sm"><Printer size={14} className="mr-1" /> Print</Button>
            <Button varient="secondary" size="sm"><Download size={14} className="mr-1" /> Export PDF</Button>
          </div>
        </div>
      </div>

      {/* Patient Demographic Card */}
      <CommonCard title="Patient Information" icon={<User size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="font-medium">{patient?.dob ? new Date(patient.dob).toLocaleDateString() : "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Gender</p>
              <p className="font-medium">{patient?.sex || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium">{patient?.cellPhone || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{patient?.email || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="font-medium">{patient?.address1 || "-"}, {patient?.city || ""}</p>
            </div>
          </div>
        </div>
      </CommonCard>

      {/* Latest Vitals Card */}
      <CommonCard title="Latest Vital Signs" icon={<Heart size={18} />}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Thermometer size={20} className="mx-auto text-blue-500 mb-1" />
            <p className="text-xs text-gray-500">Temperature</p>
            <p className="text-lg font-semibold">{latestVitals?.temperature ? `${latestVitals.temperature}°C` : "-"}</p>
            {latestVitals?.temperature && getTrendIcon(latestVitals.temperature, { min: 36.1, max: 37.2 })}
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <Heart size={20} className="mx-auto text-red-500 mb-1" />
            <p className="text-xs text-gray-500">Heart Rate</p>
            <p className="text-lg font-semibold">{latestVitals?.heartRate || "-"} bpm</p>
            {latestVitals?.heartRate && getTrendIcon(latestVitals.heartRate, { min: 60, max: 100 })}
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Activity size={20} className="mx-auto text-green-500 mb-1" />
            <p className="text-xs text-gray-500">Blood Pressure</p>
            <p className="text-lg font-semibold">
              {latestVitals?.bloodPressureSystolic ? `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}` : "-"}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Wind size={20} className="mx-auto text-purple-500 mb-1" />
            <p className="text-xs text-gray-500">Respiratory Rate</p>
            <p className="text-lg font-semibold">{latestVitals?.respiratoryRate || "-"} /min</p>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <Droplet size={20} className="mx-auto text-indigo-500 mb-1" />
            <p className="text-xs text-gray-500">Oxygen Saturation</p>
            <p className="text-lg font-semibold">{latestVitals?.oxygenSaturation ? `${latestVitals.oxygenSaturation}%` : "-"}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Calendar size={20} className="mx-auto text-gray-500 mb-1" />
            <p className="text-xs text-gray-500">Measured At</p>
            <p className="text-sm font-medium">{latestVitals?.measuredAt ? new Date(latestVitals.measuredAt).toLocaleDateString() : "-"}</p>
          </div>
        </div>
      </CommonCard>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Allergies Card */}
        <CommonCard title="Allergies" icon={<AlertCircle size={18} />}>
          {allergies.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No allergies recorded</p>
          ) : (
            <div className="space-y-3">
              {allergies.map((allergy) => (
                <div key={allergy.allergyId} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{allergy.allergen}</p>
                      <p className="text-sm text-gray-500">{allergy.reaction}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadge(allergy.severity)}`}>
                        {allergy.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(allergy.status)}`}>
                        {allergy.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Type: {allergy.allergyType}</p>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Medications Card */}
        <CommonCard title="Active Medications" icon={<Pill size={18} />}>
          {medications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No medications prescribed</p>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.medicationId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{med.medicationName}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(med.status)}`}>
                      {med.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{med.dosage} - {med.frequency} - {med.route}</p>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Diagnoses Card */}
        <CommonCard title="Active Diagnoses" icon={<Stethoscope size={18} />}>
          {diagnoses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No diagnoses recorded</p>
          ) : (
            <div className="space-y-3">
              {diagnoses.map((diag) => (
                <div key={diag.diagnosisId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{diag.diagnosisName}</p>
                      <p className="text-xs text-gray-500">ICD-10: {diag.icdCode}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(diag.status)}`}>
                      {diag.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Type: {diag.diagnosisType}</p>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Recent Labs Card */}
        <CommonCard title="Recent Labs" icon={<FlaskConical size={18} />}>
          {recentLabs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No lab results</p>
          ) : (
            <div className="space-y-3">
              {recentLabs.map((lab) => (
                <div key={lab.labId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{lab.labName}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(lab.status)}`}>
                      {lab.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-sm ${lab.isAbnormal ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      Result: {lab.resultValue || "Pending"} {lab.referenceRange ? `(Ref: ${lab.referenceRange})` : ""}
                    </p>
                    {lab.isAbnormal && <span className="text-xs text-red-500">Abnormal</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Recent Imaging Card */}
        <CommonCard title="Recent Imaging" icon={<Camera size={18} />}>
          {recentImaging.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No imaging studies</p>
          ) : (
            <div className="space-y-3">
              {recentImaging.map((img) => (
                <div key={img.imagingId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{img.imagingType}</p>
                      <p className="text-xs text-gray-500">Body Part: {img.bodyPart}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(img.status)}`}>
                      {img.status}
                    </span>
                  </div>
                  {img.findings && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{img.findings}</p>}
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Recent Notes Card */}
        <CommonCard title="Recent Clinical Notes" icon={<FileText size={18} />}>
          {recentNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No clinical notes</p>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <div key={note.noteId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{note.title || note.noteType}</p>
                    {note.isSigned && <CheckCircle size={14} className="text-green-500" />}
                  </div>
                  <p className="text-xs text-gray-500">By {note.authoredBy} on {new Date(note.authoredDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Recent Encounters Card */}
        <CommonCard title="Recent Encounters" icon={<Calendar size={18} />}>
          {recentEncounters.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No encounters</p>
          ) : (
            <div className="space-y-3">
              {recentEncounters.map((enc) => (
                <div key={enc.encounterId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{enc.encounterType}</p>
                      <p className="text-xs text-gray-500">#{enc.encounterNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(enc.status)}`}>
                        {enc.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{enc.chiefComplaint || "No chief complaint"}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(enc.encounterDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CommonCard>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}