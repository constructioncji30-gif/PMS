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
  XCircle,
  Plus,
  Edit,
  Trash2,
  HeartPulse
} from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== TYPES ====================

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
  painLevel: number | null;
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
  notes: string;
}

interface Medication {
  medicationId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedBy: string;
  startDate: string;
  endDate: string;
  status: string;
  instructions: string;
}

interface Diagnosis {
  diagnosisId: number;
  diagnosisName: string;
  icdCode: string;
  diagnosisType: string;
  diagnosedDate: string;
  diagnosedBy: string;
  status: string;
  notes: string;
}

interface Lab {
  labId: number;
  labName: string;
  labCategory: string;
  orderedDate: string;
  resultDate: string;
  resultValue: string;
  referenceRange: string;
  unit: string;
  isAbnormal: boolean;
  interpretation: string;
  status: string;
}

interface Imaging {
  imagingId: number;
  imagingType: string;
  bodyPart: string;
  orderedDate: string;
  resultDate: string;
  findings: string;
  impression: string;
  status: string;
}

interface ClinicalNote {
  noteId: number;
  noteType: string;
  title: string;
  content: string;
  authoredDate: string;
  authoredBy: string;
  status: string;
  isSigned: boolean;
}

interface Encounter {
  encounterId: number;
  encounterNumber: string;
  encounterType: string;
  encounterDate: string;
  chiefComplaint: string;
  status: string;
}

// ==================== DROPDOWN OPTIONS ====================

const allergyTypeOptions = [
  { label: "Drug", value: "Drug" },
  { label: "Food", value: "Food" },
  { label: "Environmental", value: "Environmental" },
  { label: "Latex", value: "Latex" },
  { label: "Other", value: "Other" }
];

const severityOptions = [
  { label: "Mild", value: "Mild" },
  { label: "Moderate", value: "Moderate" },
  { label: "Severe", value: "Severe" },
  { label: "Life-threatening", value: "Life-threatening" }
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Resolved", value: "Resolved" }
];

const medicationRouteOptions = [
  { label: "Oral", value: "Oral" },
  { label: "Intravenous", value: "Intravenous" },
  { label: "Intramuscular", value: "Intramuscular" },
  { label: "Subcutaneous", value: "Subcutaneous" },
  { label: "Topical", value: "Topical" },
  { label: "Inhalation", value: "Inhalation" }
];

const medicationFrequencyOptions = [
  { label: "Once daily", value: "Once daily" },
  { label: "Twice daily", value: "Twice daily" },
  { label: "Three times daily", value: "Three times daily" },
  { label: "Four times daily", value: "Four times daily" },
  { label: "Every 6 hours", value: "Every 6 hours" },
  { label: "Every 8 hours", value: "Every 8 hours" },
  { label: "As needed", value: "As needed" }
];

const diagnosisTypeOptions = [
  { label: "Primary", value: "Primary" },
  { label: "Secondary", value: "Secondary" },
  { label: "Chronic", value: "Chronic" },
  { label: "Acute", value: "Acute" }
];

const labCategoryOptions = [
  { label: "Blood", value: "Blood" },
  { label: "Urine", value: "Urine" },
  { label: "Pathology", value: "Pathology" },
  { label: "Microbiology", value: "Microbiology" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Hematology", value: "Hematology" }
];

const imagingTypeOptions = [
  { label: "X-Ray", value: "X-Ray" },
  { label: "MRI", value: "MRI" },
  { label: "CT Scan", value: "CT Scan" },
  { label: "Ultrasound", value: "Ultrasound" },
  { label: "Mammogram", value: "Mammogram" },
  { label: "PET Scan", value: "PET Scan" }
];

const noteTypeOptions = [
  { label: "Progress Note", value: "Progress Note" },
  { label: "SOAP Note", value: "SOAP Note" },
  { label: "Discharge Summary", value: "Discharge Summary" },
  { label: "Consultation Note", value: "Consultation Note" },
  { label: "Follow-up Note", value: "Follow-up Note" }
];

const encounterTypeOptions = [
  { label: "Office Visit", value: "Office Visit" },
  { label: "Emergency", value: "Emergency" },
  { label: "Telehealth", value: "Telehealth" },
  { label: "Hospital Admission", value: "Hospital Admission" },
  { label: "Follow-up", value: "Follow-up" }
];

const encounterStatusOptions = [
  { label: "Scheduled", value: "Scheduled" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" }
];

const labStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" }
];

// ==================== HELPER FUNCTIONS ====================

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    Scheduled: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Resolved: "bg-green-100 text-green-800"
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

// ==================== MAIN COMPONENT ====================

export default function PatientClinicalView() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  // State
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [imaging, setImaging] = useState<Imaging[]>([]);
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      // Patient
      const patientRes = await fetch(`${API_BASE}/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const patientData = await patientRes.json();
      if (patientData.success) setPatient(patientData.patient);

      // Vitals
      const vitalsRes = await fetch(`${API_BASE}/vitals/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const vitalsData = await vitalsRes.json();
      if (vitalsData.success) setVitals(vitalsData.vitals || []);

      // Allergies
      const allergiesRes = await fetch(`${API_BASE}/clinical/allergies/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allergiesData = await allergiesRes.json();
      if (allergiesData.success) setAllergies(allergiesData.allergies || []);

      // Medications
      const medsRes = await fetch(`${API_BASE}/clinical/medications/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const medsData = await medsRes.json();
      if (medsData.success) setMedications(medsData.medications || []);

      // Diagnoses
      const diagRes = await fetch(`${API_BASE}/clinical/diagnoses/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const diagData = await diagRes.json();
      if (diagData.success) setDiagnoses(diagData.activeDiagnoses || []);

      // Labs
      const labsRes = await fetch(`${API_BASE}/clinical/labs/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const labsData = await labsRes.json();
      if (labsData.success) setLabs(labsData.labs || []);

      // Imaging
      const imagingRes = await fetch(`${API_BASE}/clinical/imaging/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const imagingData = await imagingRes.json();
      if (imagingData.success) setImaging(imagingData.imaging || []);

      // Notes
      const notesRes = await fetch(`${API_BASE}/clinical/notes/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const notesData = await notesRes.json();
      if (notesData.success) setNotes(notesData.notes || []);

      // Encounters
      const encRes = await fetch(`${API_BASE}/encounters/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const encData = await encRes.json();
      if (encData.success) setEncounters(encData.encounters || []);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchAllData();
  }, [patientId]);

  // ==================== CRUD HANDLERS ====================

  const handleAdd = (type: string) => {
    setModalType(type);
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (type: string, item: any) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const token = localStorage.getItem("accessToken");
      let url = "";
      switch (type) {
        case "vitals": url = `${API_BASE}/vitals/${id}`; break;
        case "allergies": url = `${API_BASE}/clinical/allergies/${id}`; break;
        case "medications": url = `${API_BASE}/clinical/medications/${id}`; break;
        case "diagnoses": url = `${API_BASE}/clinical/diagnoses/${id}`; break;
        case "labs": url = `${API_BASE}/clinical/labs/${id}`; break;
        case "imaging": url = `${API_BASE}/clinical/imaging/${id}`; break;
        case "notes": url = `${API_BASE}/clinical/notes/${id}`; break;
        case "encounters": url = `${API_BASE}/encounters/${id}`; break;
        default: return;
      }
      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
        alert(`${type} deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const itemId = editingItem ? editingItem[`${modalType.slice(0, -1)}Id`] || editingItem[`${modalType}Id`] : null;
      let url = "";
      let method = editingItem ? "PUT" : "POST";
      
      switch (modalType) {
        case "vitals":
          url = editingItem ? `${API_BASE}/vitals/${itemId}` : `${API_BASE}/vitals`;
          break;
        case "allergies":
          url = editingItem ? `${API_BASE}/clinical/allergies/${itemId}` : `${API_BASE}/clinical/allergies/${patientId}`;
          break;
        case "medications":
          url = editingItem ? `${API_BASE}/clinical/medications/${itemId}` : `${API_BASE}/clinical/medications/${patientId}`;
          break;
        case "diagnoses":
          url = editingItem ? `${API_BASE}/clinical/diagnoses/${itemId}` : `${API_BASE}/clinical/diagnoses/${patientId}`;
          break;
        case "labs":
          url = editingItem ? `${API_BASE}/clinical/labs/${itemId}` : `${API_BASE}/clinical/labs/${patientId}`;
          break;
        case "imaging":
          url = editingItem ? `${API_BASE}/clinical/imaging/${itemId}` : `${API_BASE}/clinical/imaging/${patientId}`;
          break;
        case "notes":
          url = editingItem ? `${API_BASE}/clinical/notes/${itemId}` : `${API_BASE}/clinical/notes/${patientId}`;
          break;
        case "encounters":
          url = editingItem ? `${API_BASE}/encounters/${itemId}` : `${API_BASE}/encounters`;
          break;
        default: return;
      }

      const payload = modalType === "encounters" ? { patientId, ...formData } : { ...formData, patientId };
      if (modalType === "vitals") delete payload.vitalId;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
        setIsModalOpen(false);
        alert(`${modalType} ${editingItem ? "updated" : "added"} successfully`);
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === "" ? null : parseFloat(value) });
  };

  const handleDropdownChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  // ==================== RENDER MODAL CONTENT ====================

  const renderModalContent = () => {
    switch (modalType) {
      case "vitals":
        return (
          <CommonFormCard cols={2}>
            <Input label="Temperature (°C)" name="temperature" type="number" step="0.1" value={formData.temperature || ""} onChange={handleNumberChange} />
            <Input label="Heart Rate (bpm)" name="heartRate" type="number" value={formData.heartRate || ""} onChange={handleNumberChange} />
            <Input label="Respiratory Rate" name="respiratoryRate" type="number" value={formData.respiratoryRate || ""} onChange={handleNumberChange} />
            <Input label="Blood Pressure Systolic" name="bloodPressureSystolic" type="number" value={formData.bloodPressureSystolic || ""} onChange={handleNumberChange} />
            <Input label="Blood Pressure Diastolic" name="bloodPressureDiastolic" type="number" value={formData.bloodPressureDiastolic || ""} onChange={handleNumberChange} />
            <Input label="Oxygen Saturation (%)" name="oxygenSaturation" type="number" value={formData.oxygenSaturation || ""} onChange={handleNumberChange} />
            <Input label="Pain Level (0-10)" name="painLevel" type="number" min="0" max="10" value={formData.painLevel || ""} onChange={handleNumberChange} />
            <Input label="Measured By" name="measuredBy" value={formData.measuredBy || ""} onChange={handleInputChange} />
          </CommonFormCard>
        );
      case "allergies":
        return (
          <CommonFormCard cols={2}>
            <Input label="Allergen" name="allergen" value={formData.allergen || ""} onChange={handleInputChange} required />
            <Dropdown label="Allergy Type" options={allergyTypeOptions} value={formData.allergyType} onChange={(val) => handleDropdownChange("allergyType", val)} />
            <Input label="Reaction" name="reaction" value={formData.reaction || ""} onChange={handleInputChange} />
            <Dropdown label="Severity" options={severityOptions} value={formData.severity} onChange={(val) => handleDropdownChange("severity", val)} />
            <Dropdown label="Status" options={statusOptions} value={formData.status} onChange={(val) => handleDropdownChange("status", val)} />
            <div className="col-span-2">
              <TextArea label="Notes" name="notes" value={formData.notes || ""} onChange={handleInputChange} rows={2} />
            </div>
          </CommonFormCard>
        );
      case "medications":
        return (
          <CommonFormCard cols={2}>
            <Input label="Medication Name" name="medicationName" value={formData.medicationName || ""} onChange={handleInputChange} required />
            <Input label="Dosage" name="dosage" value={formData.dosage || ""} onChange={handleInputChange} />
            <Dropdown label="Frequency" options={medicationFrequencyOptions} value={formData.frequency} onChange={(val) => handleDropdownChange("frequency", val)} />
            <Dropdown label="Route" options={medicationRouteOptions} value={formData.route} onChange={(val) => handleDropdownChange("route", val)} />
            <Input label="Prescribed By" name="prescribedBy" value={formData.prescribedBy || ""} onChange={handleInputChange} />
            <Input label="Start Date" name="startDate" type="date" value={formData.startDate?.split('T')[0] || ""} onChange={handleInputChange} />
            <Input label="End Date" name="endDate" type="date" value={formData.endDate?.split('T')[0] || ""} onChange={handleInputChange} />
            <Dropdown label="Status" options={statusOptions} value={formData.status} onChange={(val) => handleDropdownChange("status", val)} />
            <div className="col-span-2">
              <TextArea label="Instructions" name="instructions" value={formData.instructions || ""} onChange={handleInputChange} rows={2} />
            </div>
          </CommonFormCard>
        );
      case "diagnoses":
        return (
          <CommonFormCard cols={2}>
            <Input label="Diagnosis Name" name="diagnosisName" value={formData.diagnosisName || ""} onChange={handleInputChange} required />
            <Input label="ICD-10 Code" name="icdCode" value={formData.icdCode || ""} onChange={handleInputChange} />
            <Dropdown label="Diagnosis Type" options={diagnosisTypeOptions} value={formData.diagnosisType} onChange={(val) => handleDropdownChange("diagnosisType", val)} />
            <Input label="Diagnosed Date" name="diagnosedDate" type="date" value={formData.diagnosedDate?.split('T')[0] || ""} onChange={handleInputChange} />
            <Input label="Diagnosed By" name="diagnosedBy" value={formData.diagnosedBy || ""} onChange={handleInputChange} />
            <Dropdown label="Status" options={statusOptions} value={formData.status} onChange={(val) => handleDropdownChange("status", val)} />
            <div className="col-span-2">
              <TextArea label="Notes" name="notes" value={formData.notes || ""} onChange={handleInputChange} rows={2} />
            </div>
          </CommonFormCard>
        );
      case "labs":
        return (
          <CommonFormCard cols={2}>
            <Input label="Lab Test Name" name="labName" value={formData.labName || ""} onChange={handleInputChange} required />
            <Dropdown label="Lab Category" options={labCategoryOptions} value={formData.labCategory} onChange={(val) => handleDropdownChange("labCategory", val)} />
            <Input label="Ordered Date" name="orderedDate" type="date" value={formData.orderedDate?.split('T')[0] || ""} onChange={handleInputChange} />
            <Input label="Ordered By" name="orderedBy" value={formData.orderedBy || ""} onChange={handleInputChange} />
            <Input label="Result Value" name="resultValue" value={formData.resultValue || ""} onChange={handleInputChange} />
            <Input label="Reference Range" name="referenceRange" value={formData.referenceRange || ""} onChange={handleInputChange} />
            <Input label="Unit" name="unit" value={formData.unit || ""} onChange={handleInputChange} />
            <Dropdown label="Status" options={labStatusOptions} value={formData.status} onChange={(val) => handleDropdownChange("status", val)} />
            <div className="col-span-2">
              <TextArea label="Interpretation" name="interpretation" value={formData.interpretation || ""} onChange={handleInputChange} rows={2} />
            </div>
          </CommonFormCard>
        );
      case "imaging":
        return (
          <CommonFormCard cols={2}>
            <Dropdown label="Imaging Type" options={imagingTypeOptions} value={formData.imagingType} onChange={(val) => handleDropdownChange("imagingType", val)} />
            <Input label="Body Part" name="bodyPart" value={formData.bodyPart || ""} onChange={handleInputChange} />
            <Input label="Ordered Date" name="orderedDate" type="date" value={formData.orderedDate?.split('T')[0] || ""} onChange={handleInputChange} />
            <Input label="Ordered By" name="orderedBy" value={formData.orderedBy || ""} onChange={handleInputChange} />
            <Input label="Result Date" name="resultDate" type="date" value={formData.resultDate?.split('T')[0] || ""} onChange={handleInputChange} />
            <div className="col-span-2">
              <TextArea label="Findings" name="findings" value={formData.findings || ""} onChange={handleInputChange} rows={3} />
            </div>
            <div className="col-span-2">
              <TextArea label="Impression" name="impression" value={formData.impression || ""} onChange={handleInputChange} rows={2} />
            </div>
            <Dropdown label="Status" options={labStatusOptions} value={formData.status} onChange={(val) => handleDropdownChange("status", val)} />
          </CommonFormCard>
        );
      case "notes":
        return (
          <CommonFormCard cols={2}>
            <Dropdown label="Note Type" options={noteTypeOptions} value={formData.noteType} onChange={(val) => handleDropdownChange("noteType", val)} />
            <Input label="Title" name="title" value={formData.title || ""} onChange={handleInputChange} />
            <div className="col-span-2">
              <TextArea label="Content" name="content" value={formData.content || ""} onChange={handleInputChange} rows={6} />
            </div>
            <Dropdown label="Status" options={statusOptions} value={formData.status} onChange={(val) => handleDropdownChange("status", val)} />
          </CommonFormCard>
        );
      case "encounters":
        return (
          <CommonFormCard cols={2}>
            <Dropdown label="Encounter Type" options={encounterTypeOptions} value={formData.encounterType} onChange={(val) => handleDropdownChange("encounterType", val)} />
            <Input label="Encounter Date" name="encounterDate" type="date" value={formData.encounterDate?.split('T')[0] || ""} onChange={handleInputChange} />
            <div className="col-span-2">
              <Input label="Chief Complaint" name="chiefComplaint" value={formData.chiefComplaint || ""} onChange={handleInputChange} />
            </div>
            <Dropdown label="Status" options={encounterStatusOptions} value={formData.status} onChange={(val) => handleDropdownChange("status", val)} />
            <div className="col-span-2">
              <TextArea label="Notes" name="notes" value={formData.notes || ""} onChange={handleInputChange} rows={3} />
            </div>
          </CommonFormCard>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading clinical data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4  ">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-2">
              <ChevronLeft size={16} /> Back to Patient List
            </button>
            <h1 className="text-2xl font-bold">Complete Clinical Record</h1>
            <p className="text-gray-500">Full health record for {patient?.firstName} {patient?.lastName}</p>
          </div>
          <div className="flex gap-2">
            <Button varient="secondary"    onClick={() => window.print()}><Printer size={14} className="mr-1" /> Print</Button>
            <Button varient="secondary"   ><Download size={14} className="mr-1" /> Export PDF</Button>
          </div>
        </div>
      </div>

      {/* Patient Information - Read Only */}
      <CommonCard title="Patient Information" icon={<User size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium">{patient?.firstName} {patient?.lastName}</p></div>
          <div><p className="text-xs text-gray-500">Date of Birth</p><p className="font-medium">{patient?.dob ? new Date(patient.dob).toLocaleDateString() : "-"}</p></div>
          <div><p className="text-xs text-gray-500">Gender</p><p className="font-medium">{patient?.sex || "-"}</p></div>
          <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{patient?.cellPhone || "-"}</p></div>
          <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{patient?.email || "-"}</p></div>
          <div><p className="text-xs text-gray-500">Address</p><p className="font-medium">{patient?.address1 || "-"}, {patient?.city || ""}</p></div>
        </div>
      </CommonCard>

      {/* Vital Signs */}
      <CommonCard 
        title="Vital Signs" 
        icon={<HeartPulse size={18} />}
        button={<Button varient="primary"    onClick={() => handleAdd("vitals")}><Plus size={14} className="mr-1" /> Add Vitals</Button>}
      >
        {vitals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No vital signs recorded</p>
        ) : (
          <div className="space-y-3">
            {vitals.map((v) => (
              <div key={v.vitalId} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 flex-1">
                    <div><p className="text-xs text-gray-500">Temperature</p><p className="font-medium">{v.temperature ? `${v.temperature}°C` : "-"}</p></div>
                    <div><p className="text-xs text-gray-500">Heart Rate</p><p className="font-medium">{v.heartRate || "-"} bpm</p></div>
                    <div><p className="text-xs text-gray-500">BP</p><p className="font-medium">{v.bloodPressureSystolic ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}` : "-"}</p></div>
                    <div><p className="text-xs text-gray-500">SpO2</p><p className="font-medium">{v.oxygenSaturation ? `${v.oxygenSaturation}%` : "-"}</p></div>
                    <div><p className="text-xs text-gray-500">Pain</p><p className="font-medium">{v.painLevel ? `${v.painLevel}/10` : "-"}</p></div>
                    <div className="col-span-2"><p className="text-xs text-gray-500">Date</p><p className="font-medium text-sm">{new Date(v.measuredAt).toLocaleString()}</p></div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => handleEdit("vitals", v)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("vitals", v.vitalId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CommonCard>

      {/* Two Column Layout for remaining modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Allergies */}
        <CommonCard 
          title="Allergies" 
          icon={<AlertCircle size={18} />}
          button={<Button varient="primary"    onClick={() => handleAdd("allergies")}><Plus size={14} className="mr-1" /> Add Allergy</Button>}
        >
          {allergies.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No allergies recorded</p>
          ) : (
            <div className="space-y-2">
              {allergies.map((a) => (
                <div key={a.allergyId} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium">{a.allergen}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getSeverityBadge(a.severity)}`}>{a.severity}</span>
                    <p className="text-sm text-gray-500">{a.reaction}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit("allergies", a)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("allergies", a.allergyId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Active Medications */}
        <CommonCard 
          title="Active Medications" 
          icon={<Pill size={18} />}
          button={<Button varient="primary"    onClick={() => handleAdd("medications")}><Plus size={14} className="mr-1" /> Add Medication</Button>}
        >
          {medications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No medications prescribed</p>
          ) : (
            <div className="space-y-2">
              {medications.map((m) => (
                <div key={m.medicationId} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium">{m.medicationName}</span>
                    <span className="ml-2 text-sm text-gray-500">{m.dosage} - {m.frequency}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadge(m.status)}`}>{m.status}</span>
                    {m.instructions && <p className="text-xs text-gray-400 mt-1">{m.instructions}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit("medications", m)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("medications", m.medicationId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Active Diagnoses */}
        <CommonCard 
          title="Active Diagnoses" 
          icon={<Stethoscope size={18} />}
          button={<Button varient="primary"    onClick={() => handleAdd("diagnoses")}><Plus size={14} className="mr-1" /> Add Diagnosis</Button>}
        >
          {diagnoses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No diagnoses recorded</p>
          ) : (
            <div className="space-y-2">
              {diagnoses.map((d) => (
                <div key={d.diagnosisId} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium">{d.diagnosisName}</span>
                    <span className="ml-2 text-xs text-gray-500">ICD-10: {d.icdCode}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadge(d.status)}`}>{d.status}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit("diagnoses", d)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("diagnoses", d.diagnosisId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Labs */}
        <CommonCard 
          title="Labs" 
          icon={<FlaskConical size={18} />}
          button={<Button varient="primary"    onClick={() => handleAdd("labs")}><Plus size={14} className="mr-1" /> Order Lab</Button>}
        >
          {labs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No lab results</p>
          ) : (
            <div className="space-y-2">
              {labs.map((l) => (
                <div key={l.labId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{l.labName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(l.status)}`}>{l.status}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-sm ${l.isAbnormal ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      Result: {l.resultValue || "Pending"} {l.unit} {l.referenceRange ? `(Ref: ${l.referenceRange})` : ""}
                    </p>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit("labs", l)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                      <button onClick={() => handleDelete("labs", l.labId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Imaging */}
        <CommonCard 
          title="Imaging" 
          icon={<Camera size={18} />}
          button={<Button varient="primary"    onClick={() => handleAdd("imaging")}><Plus size={14} className="mr-1" /> Order Imaging</Button>}
        >
          {imaging.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No imaging studies</p>
          ) : (
            <div className="space-y-2">
              {imaging.map((i) => (
                <div key={i.imagingId} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{i.imagingType} - {i.bodyPart}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(i.status)}`}>{i.status}</span>
                  </div>
                  {i.findings && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{i.findings}</p>}
                  <div className="flex justify-end gap-1 mt-1">
                    <button onClick={() => handleEdit("imaging", i)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("imaging", i.imagingId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Clinical Notes */}
        <CommonCard 
          title="Clinical Notes" 
          icon={<FileText size={18} />}
          button={<Button varient="primary"    onClick={() => handleAdd("notes")}><Plus size={14} className="mr-1" /> Add Note</Button>}
        >
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No clinical notes</p>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.noteId} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{n.title || n.noteType}</span>
                      <p className="text-xs text-gray-500">By {n.authoredBy} on {new Date(n.authoredDate).toLocaleDateString()}</p>
                    </div>
                    {n.isSigned && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{n.content?.substring(0, 150)}</p>
                  <div className="flex justify-end gap-1 mt-2">
                    <button onClick={() => handleEdit("notes", n)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("notes", n.noteId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>

        {/* Encounters */}
        <CommonCard 
          title="Encounters" 
          icon={<Calendar size={18} />}
          button={<Button varient="primary"    onClick={() => handleAdd("encounters")}><Plus size={14} className="mr-1" /> New Encounter</Button>}
        >
          {encounters.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No encounters</p>
          ) : (
            <div className="space-y-2">
              {encounters.map((e) => (
                <div key={e.encounterId} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium">{e.encounterType}</span>
                    <span className="ml-2 text-sm text-gray-500">#{e.encounterNumber}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadge(e.status)}`}>{e.status}</span>
                    <p className="text-sm text-gray-600 mt-1">{e.chiefComplaint || "No chief complaint"}</p>
                    <p className="text-xs text-gray-400">{new Date(e.encounterDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit("encounters", e)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("encounters", e.encounterId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CommonCard>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? "Edit" : "Add"} ${modalType.slice(0, -1)}`}
        size="lg"
      >
        {renderModalContent()}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button varient="primary" onClick={handleSubmit}>{editingItem ? "Update" : "Add"}</Button>
        </div>
      </Modal>
    </div>
  );
}