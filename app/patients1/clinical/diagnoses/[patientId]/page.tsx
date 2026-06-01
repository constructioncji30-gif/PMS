"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Stethoscope, Plus, Edit, Trash2, ChevronLeft } from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";

interface Diagnosis {
  diagnosisId: number;
  diagnosisName: string;
  icdCode: string;
  diagnosisType: string;
  onsetDate: string;
  diagnosedDate: string;
  diagnosedBy: string;
  status: string;
  notes: string;
}

const diagnosisTypeOptions = [
  { label: "Primary", value: "Primary" },
  { label: "Secondary", value: "Secondary" },
  { label: "Chronic", value: "Chronic" },
  { label: "Acute", value: "Acute" }
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Resolved", value: "Resolved" },
  { label: "Chronic", value: "Chronic" },
  { label: "Inactive", value: "Inactive" }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DiagnosesPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiag, setEditingDiag] = useState<Diagnosis | null>(null);
  const [formData, setFormData] = useState <any>({
    diagnosisName: "",
    icdCode: "",
    diagnosisType: "",
    onsetDate: "",
    diagnosedDate: "",
    diagnosedBy: "",
    status: "Active",
    notes: ""
  });

  useEffect(() => {
    fetchDiagnoses();
  }, [patientId]);

  const fetchDiagnoses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/diagnoses/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDiagnoses(data.activeDiagnoses);
      }
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = editingDiag
        ? `${API_BASE}/clinical/diagnoses/${editingDiag.diagnosisId}`
        : `${API_BASE}/clinical/diagnoses/${patientId}`;
      const method = editingDiag ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        fetchDiagnoses();
        setIsModalOpen(false);
        resetForm();
        alert(editingDiag ? "Diagnosis updated successfully" : "Diagnosis added successfully");
      }
    } catch (error) {
      console.error("Error saving diagnosis:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this diagnosis?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/diagnoses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchDiagnoses();
        alert("Diagnosis deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting diagnosis:", error);
    }
  };

  const handleEdit = (diag: Diagnosis) => {
    setEditingDiag(diag);
    setFormData({
      diagnosisName: diag.diagnosisName,
      icdCode: diag.icdCode,
      diagnosisType: diag.diagnosisType,
      onsetDate: diag.onsetDate?.split('T')[0] || "",
      diagnosedDate: diag.diagnosedDate?.split('T')[0] || "",
      diagnosedBy: diag.diagnosedBy || "",
      status: diag.status,
      notes: diag.notes || ""
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingDiag(null);
    setFormData({
      diagnosisName: "",
      icdCode: "",
      diagnosisType: "",
      onsetDate: "",
      diagnosedDate: "",
      diagnosedBy: "",
      status: "Active",
      notes: ""
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading diagnoses...</div>;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingDiag ? "Edit Diagnosis" : "Add New Diagnosis"}
        size="lg"
      >
        <CommonFormCard cols={2}>
          <Input
            label="Diagnosis Name *"
            value={formData.diagnosisName}
            onChange={(e) => setFormData({ ...formData, diagnosisName: e.target.value })}
            required
          />
          <Input
            label="ICD-10 Code"
            value={formData.icdCode}
            onChange={(e) => setFormData({ ...formData, icdCode: e.target.value })}
            placeholder="e.g., I10, E11.9"
          />
          <Dropdown
            label="Diagnosis Type"
            options={diagnosisTypeOptions}
            value={formData.diagnosisType}
            onChange={(val) => setFormData({ ...formData, diagnosisType: val })}
          />
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
          />
          <Input
            label="Onset Date"
            type="date"
            value={formData.onsetDate}
            onChange={(e) => setFormData({ ...formData, onsetDate: e.target.value })}
          />
          <Input
            label="Diagnosed Date"
            type="date"
            value={formData.diagnosedDate}
            onChange={(e) => setFormData({ ...formData, diagnosedDate: e.target.value })}
          />
          <Input
            label="Diagnosed By"
            value={formData.diagnosedBy}
            onChange={(e) => setFormData({ ...formData, diagnosedBy: e.target.value })}
          />
          <div className="col-span-2">
            <TextArea
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </CommonFormCard>
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
          <Button varient="primary" onClick={handleSubmit}>{editingDiag ? "Update" : "Add"} Diagnosis</Button>
        </div>
      </Modal>

      <CommonCard
        icon={<Stethoscope />}
        title="Patient Diagnoses"
        button={
          <div className="flex gap-2">
            <Button varient="secondary" onClick={() => router.back()}><ChevronLeft size={16} className="mr-1" /> Back</Button>
            <Button varient="primary" onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-1" /> Add Diagnosis</Button>
          </div>
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
                <th className="px-4 py-3 text-left">Diagnosed Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {diagnoses.map((diag) => (
                <tr key={diag.diagnosisId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{diag.diagnosisName}</td>
                  <td className="px-4 py-3">{diag.icdCode}</td>
                  <td className="px-4 py-3">{diag.diagnosisType}</td>
                  <td className="px-4 py-3">{diag.status}</td>
                  <td className="px-4 py-3">{diag.diagnosedDate}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(diag)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(diag.diagnosisId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {diagnoses.length === 0 && <div className="text-center py-8 text-gray-500">No diagnoses recorded</div>}
        </div>
      </CommonCard>
    </>
  );
}