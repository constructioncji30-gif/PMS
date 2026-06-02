"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  Activity,
  AlertCircle,
  Pill,
  Stethoscope,
  FlaskConical,
  Camera,
  FileText
} from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pms-backend-two.vercel.app/api";

// Types
interface Encounter {
  encounterId: number;
  encounterNumber: string;
  encounterType: string;
  encounterDate: string;
  chiefComplaint: string;
  visitReason: string;
  status: string;
  priority: string;
  providerId: number;
  provider?: {
    firstName: string;
    lastName: string;
  };
  locationId: number;
  location?: {
    locationName: string;
  };
  notes: string;
}

// Dropdown options
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

const priorityOptions = [
  { label: "Routine", value: "Routine" },
  { label: "Urgent", value: "Urgent" },
  { label: "Emergency", value: "Emergency" }
];

// Helper functions
const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function EncountersPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEncounter, setEditingEncounter] = useState<Encounter | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    encounterType: "",
    encounterDate: "",
    chiefComplaint: "",
    visitReason: "",
    priority: "Routine",
    status: "Scheduled",
    notes: ""
  });

  // Fetch encounters
  const fetchEncounters = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/encounters/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEncounters(data.encounters);
      }
    } catch (error) {
      console.error("Error fetching encounters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncounters();
  }, [patientId]);

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  // Create encounter
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/encounters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ patientId, ...formData })
      });
      const data = await response.json();
      if (data.success) {
        fetchEncounters();
        setIsModalOpen(false);
        resetForm();
        alert("Encounter created successfully");
      }
    } catch (error) {
      console.error("Error creating encounter:", error);
    }
  };

  // Update encounter
  const handleUpdate = async () => {
    if (!editingEncounter) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/encounters/${editingEncounter.encounterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        fetchEncounters();
        setIsModalOpen(false);
        resetForm();
        alert("Encounter updated successfully");
      }
    } catch (error) {
      console.error("Error updating encounter:", error);
    }
  };

  // Delete encounter
  const handleDelete = async (encounterId: number) => {
    if (!confirm("Are you sure you want to delete this encounter?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/encounters/${encounterId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchEncounters();
        alert("Encounter deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting encounter:", error);
    }
  };

  // Open edit modal
  const openEditModal = (encounter: Encounter) => {
    setEditingEncounter(encounter);
    setFormData({
      encounterType: encounter.encounterType,
      encounterDate: encounter.encounterDate?.split('T')[0] || "",
      chiefComplaint: encounter.chiefComplaint || "",
      visitReason: encounter.visitReason || "",
      priority: encounter.priority || "Routine",
      status: encounter.status,
      notes: encounter.notes || ""
    });
    setIsModalOpen(true);
  };

  // Open view modal
  const openViewModal = (encounter: Encounter) => {
    setSelectedEncounter(encounter);
    setIsViewModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingEncounter(null);
    setFormData({
      encounterType: "",
      encounterDate: "",
      chiefComplaint: "",
      visitReason: "",
      priority: "Routine",
      status: "Scheduled",
      notes: ""
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading encounters...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <ChevronLeft size={16} /> Back to Clinical Summary
        </button>
        <Button varient="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={14} className="mr-1" /> New Encounter
        </Button>
      </div>

      {/* Encounters List */}
      <CommonCard title="Patient Encounters" icon={<Calendar size={18} />}>
        {encounters.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No encounters recorded</p>
        ) : (
          <div className="space-y-3">
            {encounters.map((encounter) => (
              <div
                key={encounter.encounterId}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => openViewModal(encounter)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-lg">
                        {encounter.encounterType}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(encounter.status)}`}>
                        {encounter.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        #{encounter.encounterNumber}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(encounter.encounterDate).toLocaleDateString()}
                    </p>
                    
                    {encounter.chiefComplaint && (
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Chief Complaint:</span> {encounter.chiefComplaint}
                      </p>
                    )}
                    
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      {encounter.provider && (
                        <span>Provider: Dr. {encounter.provider.firstName} {encounter.provider.lastName}</span>
                      )}
                      {encounter.location && (
                        <span>Location: {encounter.location.locationName}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openViewModal(encounter); }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(encounter); }}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(encounter.encounterId); }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CommonCard>

      {/* Create/Edit Encounter Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={`${editingEncounter ? "Edit" : "New"} Encounter`}
        size="lg"
      >
        <CommonFormCard cols={2}>
          <Dropdown
            label="Encounter Type *"
            options={encounterTypeOptions}
            value={formData.encounterType}
            onChange={(val) => handleDropdownChange("encounterType", val)}
            required
          />
          <Input
            label="Encounter Date"
            type="date"
            name="encounterDate"
            value={formData.encounterDate}
            onChange={handleInputChange}
          />
          <Dropdown
            label="Priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(val) => handleDropdownChange("priority", val)}
          />
          <Dropdown
            label="Status"
            options={encounterStatusOptions}
            value={formData.status}
            onChange={(val) => handleDropdownChange("status", val)}
          />
          <div className="col-span-2">
            <Input
              label="Chief Complaint"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              placeholder="Main reason for visit"
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Visit Reason"
              name="visitReason"
              value={formData.visitReason}
              onChange={handleInputChange}
              placeholder="Detailed reason for encounter"
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Additional notes about the encounter"
            />
          </div>
        </CommonFormCard>
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
            Cancel
          </Button>
          <Button varient="primary" onClick={editingEncounter ? handleUpdate : handleCreate}>
            {editingEncounter ? "Update" : "Create"} Encounter
          </Button>
        </div>
      </Modal>

      {/* View Encounter Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Encounter Details"
        size="lg"
      >
        {selectedEncounter && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Encounter Number</label>
                <p className="font-mono text-sm">{selectedEncounter.encounterNumber}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Type</label>
                <p className="font-medium">{selectedEncounter.encounterType}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date</label>
                <p>{new Date(selectedEncounter.encounterDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedEncounter.status)}`}>
                  {selectedEncounter.status}
                </span>
              </div>
              <div>
                <label className="text-xs text-gray-500">Priority</label>
                <p>{selectedEncounter.priority || "Routine"}</p>
              </div>
              {selectedEncounter.provider && (
                <div>
                  <label className="text-xs text-gray-500">Provider</label>
                  <p>Dr. {selectedEncounter.provider.firstName} {selectedEncounter.provider.lastName}</p>
                </div>
              )}
              {selectedEncounter.location && (
                <div>
                  <label className="text-xs text-gray-500">Location</label>
                  <p>{selectedEncounter.location.locationName}</p>
                </div>
              )}
            </div>
            
            {selectedEncounter.chiefComplaint && (
              <div>
                <label className="text-xs text-gray-500">Chief Complaint</label>
                <p className="text-sm mt-1">{selectedEncounter.chiefComplaint}</p>
              </div>
            )}
            
            {selectedEncounter.visitReason && (
              <div>
                <label className="text-xs text-gray-500">Visit Reason</label>
                <p className="text-sm mt-1">{selectedEncounter.visitReason}</p>
              </div>
            )}
            
            {selectedEncounter.notes && (
              <div>
                <label className="text-xs text-gray-500">Notes</label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedEncounter.notes}</p>
              </div>
            )}
            
            <div className="border-t pt-4 mt-2">
              <label className="text-xs text-gray-500">Clinical Data Available</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Link href={`/patient/${patientId}/vitals`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <Activity size={14} /> Vitals
                </Link>
                <Link href={`/patient/${patientId}/allergies`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <AlertCircle size={14} /> Allergies
                </Link>
                <Link href={`/patient/${patientId}/medications`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <Pill size={14} /> Medications
                </Link>
                <Link href={`/patient/${patientId}/diagnoses`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <Stethoscope size={14} /> Diagnoses
                </Link>
                <Link href={`/patient/${patientId}/labs`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <FlaskConical size={14} /> Labs
                </Link>
                <Link href={`/patient/${patientId}/imaging`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <Camera size={14} /> Imaging
                </Link>
                <Link href={`/patient/${patientId}/notes`} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <FileText size={14} /> Notes
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          {selectedEncounter && (
            <Button
              varient="primary"
              onClick={() => {
                setIsViewModalOpen(false);
                openEditModal(selectedEncounter);
              }}
            >
              <Edit size={14} className="mr-1" /> Edit
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}