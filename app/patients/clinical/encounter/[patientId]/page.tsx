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
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  Printer,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle
} from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";
import CommonDataGrid from "@/app/component/DataGrid";

// ==================== TYPES ====================

interface Encounter {
  encounterId: number;
  encounterNumber: string;
  encounterType: string;
  encounterDate: string;
  chiefComplaint: string;
  visitReason: string;
  status: string;
  priority: string;
  provider: { firstName: string; lastName: string; providerType: string };
  location: { locationName: string; city: string };
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
  recordedDate: string;
}

interface Medication {
  medicationId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedDate: string;
  prescribedBy: string;
  status: string;
}

interface Diagnosis {
  diagnosisId: number;
  diagnosisName: string;
  icdCode: string;
  diagnosisType: string;
  diagnosedDate: string;
  status: string;
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
  status: string;
  isAbnormal: boolean;
  interpretation: string;
}

interface Imaging {
  imagingId: number;
  imagingType: string;
  bodyPart: string;
  orderedDate: string;
  performedDate: string;
  resultDate: string;
  findings: string;
  impression: string;
  status: string;
}

interface ClinicalNote {
  noteId: number;
  noteType: string;
  title: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  authoredDate: string;
  authoredBy: string;
  status: string;
  isSigned: boolean;
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

const statusOptions = [
  { label: "Scheduled", value: "Scheduled" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ==================== HELPER FUNCTIONS ====================

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    Scheduled: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
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

export default function EncounterClinicalDashboard() {
  const params = useParams();
  const router = useRouter();
  const encounterId = params.encounterId as string;

  // State
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [imaging, setImaging] = useState<Imaging[]>([]);
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("vitals");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Fetch all data
  const fetchEncounterData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/encounters/${encounterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEncounter(data.encounter);
        setVitals(data.encounter.vitals || []);
        setAllergies(data.encounter.allergies || []);
        setMedications(data.encounter.medications || []);
        setDiagnoses(data.encounter.diagnoses || []);
        setLabs(data.encounter.labs || []);
        setImaging(data.encounter.imaging || []);
        setNotes(data.encounter.notes || []);
      }
    } catch (error) {
      console.error("Error fetching encounter data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (encounterId) {
      fetchEncounterData();
    }
  }, [encounterId]);

  // Add/Edit/Delete handlers
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
      const response = await fetch(`${API_BASE}/clinical/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchEncounterData();
        alert(`${type} deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const itemId = editingItem ? editingItem[`${modalType}Id`] : null;
      const url = editingItem
        ? `${API_BASE}/clinical/${modalType}/${itemId}`
        : `${API_BASE}/clinical/${modalType}`;
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, encounterId: parseInt(encounterId) })
      });
      const data = await response.json();
      if (data.success) {
        fetchEncounterData();
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

  const handleDropdownChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  // Column definitions
  const vitalColumns = [
    { accessorKey: "measuredAt", header: "Date/Time", cell: (row: any) => new Date(row.measuredAt).toLocaleString() },
    { accessorKey: "temperature", header: "Temp (°C)", cell: (row: any) => row.temperature ? `${row.temperature}°C` : "-" },
    { accessorKey: "heartRate", header: "HR (bpm)", cell: (row: any) => row.heartRate || "-" },
    { accessorKey: "bloodPressure", header: "BP (mmHg)", cell: (row: any) => row.bloodPressureSystolic ? `${row.bloodPressureSystolic}/${row.bloodPressureDiastolic}` : "-" },
    { accessorKey: "oxygenSaturation", header: "SpO2 (%)", cell: (row: any) => row.oxygenSaturation ? `${row.oxygenSaturation}%` : "-" },
    { accessorKey: "measuredBy", header: "Taken By" }
  ];

  const allergyColumns = [
    { accessorKey: "allergen", header: "Allergen" },
    { accessorKey: "allergyType", header: "Type" },
    { accessorKey: "reaction", header: "Reaction" },
    { accessorKey: "severity", header: "Severity", cell: (row: any) => <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadge(row.severity)}`}>{row.severity}</span> },
    { accessorKey: "status", header: "Status", cell: (row: any) => <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(row.status)}`}>{row.status}</span> }
  ];

  const medicationColumns = [
    { accessorKey: "medicationName", header: "Medication" },
    { accessorKey: "dosage", header: "Dosage" },
    { accessorKey: "frequency", header: "Frequency" },
    { accessorKey: "route", header: "Route" },
    { accessorKey: "status", header: "Status", cell: (row: any) => <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(row.status)}`}>{row.status}</span> }
  ];

  const diagnosisColumns = [
    { accessorKey: "diagnosisName", header: "Diagnosis" },
    { accessorKey: "icdCode", header: "ICD-10" },
    { accessorKey: "diagnosisType", header: "Type" },
    { accessorKey: "status", header: "Status", cell: (row: any) => <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(row.status)}`}>{row.status}</span> }
  ];

  const labColumns = [
    { accessorKey: "labName", header: "Lab Test" },
    { accessorKey: "labCategory", header: "Category" },
    { accessorKey: "resultValue", header: "Result", cell: (row: any) => <span className={row.isAbnormal ? "text-red-600 font-medium" : ""}>{row.resultValue || "Pending"}</span> },
    { accessorKey: "status", header: "Status", cell: (row: any) => <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(row.status)}`}>{row.status}</span> }
  ];

  const imagingColumns = [
    { accessorKey: "imagingType", header: "Imaging Type" },
    { accessorKey: "bodyPart", header: "Body Part" },
    { accessorKey: "findings", header: "Findings", cell: (row: any) => row.findings?.substring(0, 50) || "-" },
    { accessorKey: "status", header: "Status", cell: (row: any) => <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(row.status)}`}>{row.status}</span> }
  ];

  const noteColumns = [
    { accessorKey: "noteType", header: "Type" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "authoredDate", header: "Date", cell: (row: any) => new Date(row.authoredDate).toLocaleString() },
    { accessorKey: "authoredBy", header: "Author" },
    { accessorKey: "isSigned", header: "Signed", cell: (row: any) => row.isSigned ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" /> }
  ];

  const sections = [
    { id: "vitals", label: "Vital Signs", icon: <Activity size={18} />, data: vitals, columns: vitalColumns, count: vitals.length },
    { id: "allergies", label: "Allergies", icon: <AlertCircle size={18} />, data: allergies, columns: allergyColumns, count: allergies.length },
    { id: "medications", label: "Medications", icon: <Pill size={18} />, data: medications, columns: medicationColumns, count: medications.length },
    { id: "diagnoses", label: "Diagnoses", icon: <Stethoscope size={18} />, data: diagnoses, columns: diagnosisColumns, count: diagnoses.length },
    { id: "labs", label: "Labs", icon: <FlaskConical size={18} />, data: labs, columns: labColumns, count: labs.length },
    { id: "imaging", label: "Imaging", icon: <Camera size={18} />, data: imaging, columns: imagingColumns, count: imaging.length },
    { id: "notes", label: "Clinical Notes", icon: <FileText size={18} />, data: notes, columns: noteColumns, count: notes.length }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading encounter data...</div>
      </div>
    );
  }

  // Render modal content based on type
  const renderModalContent = () => {
    switch (modalType) {
      case "vitals":
        return (
          <CommonFormCard cols={2}>
            <Input label="Temperature (°C)" name="temperature" type="number" step="0.1" value={formData.temperature || ""} onChange={handleNumberChange} />
            <Input label="Heart Rate (bpm)" name="heartRate" type="number" value={formData.heartRate || ""} onChange={handleNumberChange} />
            <Input label="Blood Pressure Systolic" name="bloodPressureSystolic" type="number" value={formData.bloodPressureSystolic || ""} onChange={handleNumberChange} />
            <Input label="Blood Pressure Diastolic" name="bloodPressureDiastolic" type="number" value={formData.bloodPressureDiastolic || ""} onChange={handleNumberChange} />
            <Input label="Oxygen Saturation (%)" name="oxygenSaturation" type="number" value={formData.oxygenSaturation || ""} onChange={handleNumberChange} />
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
            <Input label="Instructions" name="instructions" value={formData.instructions || ""} onChange={handleInputChange} />
          </CommonFormCard>
        );
      case "diagnoses":
        return (
          <CommonFormCard cols={2}>
            <Input label="Diagnosis Name" name="diagnosisName" value={formData.diagnosisName || ""} onChange={handleInputChange} required />
            <Input label="ICD-10 Code" name="icdCode" value={formData.icdCode || ""} onChange={handleInputChange} />
            <Dropdown label="Diagnosis Type" options={diagnosisTypeOptions} value={formData.diagnosisType} onChange={(val) => handleDropdownChange("diagnosisType", val)} />
            <Input label="Diagnosed By" name="diagnosedBy" value={formData.diagnosedBy || ""} onChange={handleInputChange} />
          </CommonFormCard>
        );
      case "labs":
        return (
          <CommonFormCard cols={2}>
            <Input label="Lab Test Name" name="labName" value={formData.labName || ""} onChange={handleInputChange} required />
            <Dropdown label="Lab Category" options={labCategoryOptions} value={formData.labCategory} onChange={(val) => handleDropdownChange("labCategory", val)} />
            <Input label="Ordered By" name="orderedBy" value={formData.orderedBy || ""} onChange={handleInputChange} />
            <div className="col-span-2">
              <TextArea label="Notes" name="notes" value={formData.notes || ""} onChange={handleInputChange} rows={2} />
            </div>
          </CommonFormCard>
        );
      case "imaging":
        return (
          <CommonFormCard cols={2}>
            <Dropdown label="Imaging Type" options={imagingTypeOptions} value={formData.imagingType} onChange={(val) => handleDropdownChange("imagingType", val)} />
            <Input label="Body Part" name="bodyPart" value={formData.bodyPart || ""} onChange={handleInputChange} />
            <Input label="Ordered By" name="orderedBy" value={formData.orderedBy || ""} onChange={handleInputChange} />
            <div className="col-span-2">
              <TextArea label="Clinical Indication" name="clinicalIndication" value={formData.clinicalIndication || ""} onChange={handleInputChange} rows={2} />
            </div>
          </CommonFormCard>
        );
      case "notes":
        return (
          <CommonFormCard cols={2}>
            <Dropdown label="Note Type" options={noteTypeOptions} value={formData.noteType} onChange={(val) => handleDropdownChange("noteType", val)} />
            <Input label="Title" name="title" value={formData.title || ""} onChange={handleInputChange} />
            <div className="col-span-2">
              <TextArea label="Subjective" name="subjective" value={formData.subjective || ""} onChange={handleInputChange} rows={3} placeholder="Patient's description" />
            </div>
            <div className="col-span-2">
              <TextArea label="Objective" name="objective" value={formData.objective || ""} onChange={handleInputChange} rows={3} placeholder="Physical exam findings" />
            </div>
            <div className="col-span-2">
              <TextArea label="Assessment" name="assessment" value={formData.assessment || ""} onChange={handleInputChange} rows={3} placeholder="Diagnosis, assessment" />
            </div>
            <div className="col-span-2">
              <TextArea label="Plan" name="plan" value={formData.plan || ""} onChange={handleInputChange} rows={3} placeholder="Treatment plan" />
            </div>
          </CommonFormCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-2">
              <ChevronLeft size={16} /> Back to Encounters
            </button>
            <h1 className="text-2xl font-bold">Encounter Clinical Dashboard</h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>#{encounter?.encounterNumber}</span>
              <span>{encounter?.encounterType}</span>
              <span>{encounter?.encounterDate ? new Date(encounter.encounterDate).toLocaleDateString() : ""}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(encounter?.status || "")}`}>{encounter?.status}</span>
            </div>
            {encounter?.chiefComplaint && (
              <p className="mt-2 text-gray-700"><span className="font-medium">Chief Complaint:</span> {encounter.chiefComplaint}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button varient="secondary" ><Printer size={14} className="mr-1" /> Print</Button>
            <Button varient="secondary" ><Download size={14} className="mr-1" /> Export</Button>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex overflow-x-auto border-b">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeSection === section.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {section.icon}
              {section.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeSection === section.id ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>
                {section.count}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Section Content */}
        <div className="p-4">
          {sections.map((section) => (
            activeSection === section.id && (
              <CommonCard
                key={section.id}
                title={section.label}
                icon={section.icon}
                button={
                  <Button varient="primary"  onClick={() => handleAdd(section.id)}>
                    <Plus size={14} className="mr-1" /> Add {section.label.slice(0, -1)}
                  </Button>
                }
              >
                <CommonDataGrid
                  columns={section.columns}
                  data={section.data}
                  initialPageSize={10}
                  maxHeight="400px"
                  actions={(row: any) => (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(section.id, row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(section.id, row[`${section.id.slice(0, -1)}Id`])} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                />
                {section.data.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {section.label.toLowerCase()} recorded for this encounter.
                    <button onClick={() => handleAdd(section.id)} className="ml-2 text-blue-600 hover:underline">Add now</button>
                  </div>
                )}
              </CommonCard>
            )
          ))}
        </div>
      </div>

      
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