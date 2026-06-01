"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pill, Plus, Edit, Trash2, ChevronLeft } from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";

interface Medication {
  medicationId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate: string;
  status: string;
  instructions: string;
  pharmacy: string;
}

const routeOptions = [
  { label: "Oral", value: "Oral" },
  { label: "Intravenous", value: "Intravenous" },
  { label: "Intramuscular", value: "Intramuscular" },
  { label: "Subcutaneous", value: "Subcutaneous" },
  { label: "Topical", value: "Topical" },
  { label: "Inhalation", value: "Inhalation" }
];

const frequencyOptions = [
  { label: "Once daily", value: "Once daily" },
  { label: "Twice daily", value: "Twice daily" },
  { label: "Three times daily", value: "Three times daily" },
  { label: "Four times daily", value: "Four times daily" },
  { label: "Every 6 hours", value: "Every 6 hours" },
  { label: "Every 8 hours", value: "Every 8 hours" },
  { label: "As needed", value: "As needed" }
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Completed", value: "Completed" },
  { label: "Discontinued", value: "Discontinued" },
  { label: "On Hold", value: "On Hold" }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MedicationsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<any>({
    medicationName: "",
    dosage: "",
    frequency: "",
    route: "",
    prescribedBy: "",
    prescribedDate: "",
    startDate: "",
    endDate: "",
    status: "Active",
    instructions: "",
    pharmacy: ""
  });

  useEffect(() => {
    fetchMedications();
  }, [patientId]);

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/medications/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMedications(data.medications);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = editingMed
        ? `${API_BASE}/clinical/medications/${editingMed.medicationId}`
        : `${API_BASE}/clinical/medications/${patientId}`;
      const method = editingMed ? "PUT" : "POST";

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
        fetchMedications();
        setIsModalOpen(false);
        resetForm();
        alert(editingMed ? "Medication updated successfully" : "Medication prescribed successfully");
      }
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this medication?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/medications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchMedications();
        alert("Medication deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  };

  const handleEdit = (med: Medication) => {
    setEditingMed(med);
    setFormData({
      medicationName: med.medicationName,
      dosage: med.dosage,
      frequency: med.frequency,
      route: med.route,
      prescribedBy: med.prescribedBy || "",
      prescribedDate: med.prescribedDate?.split('T')[0] || "",
      startDate: med.startDate?.split('T')[0] || "",
      endDate: med.endDate?.split('T')[0] || "",
      status: med.status,
      instructions: med.instructions || "",
      pharmacy: med.pharmacy || ""
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingMed(null);
    setFormData({
      medicationName: "",
      dosage: "",
      frequency: "",
      route: "",
      prescribedBy: "",
      prescribedDate: "",
      startDate: "",
      endDate: "",
      status: "Active",
      instructions: "",
      pharmacy: ""
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading medications...</div>;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingMed ? "Edit Medication" : "Prescribe New Medication"}
        size="lg"
      >
        <CommonFormCard cols={2}>
          <Input
            label="Medication Name *"
            value={formData.medicationName}
            onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
            required
          />
          <Input
            label="Dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="e.g., 500mg, 10ml"
          />
          <Dropdown
            label="Frequency"
            options={frequencyOptions}
            value={formData.frequency}
            onChange={(val) => setFormData({ ...formData, frequency: val })}
          />
          <Dropdown
            label="Route"
            options={routeOptions}
            value={formData.route}
            onChange={(val) => setFormData({ ...formData, route: val })}
          />
          <Input
            label="Prescribed By"
            value={formData.prescribedBy}
            onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
          />
          <Input
            label="Prescribed Date"
            type="date"
            value={formData.prescribedDate}
            onChange={(e) => setFormData({ ...formData, prescribedDate: e.target.value })}
          />
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
          />
          <Input
            label="Pharmacy"
            value={formData.pharmacy}
            onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
          />
          <div className="col-span-2">
            <TextArea
              label="Instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={2}
            />
          </div>
        </CommonFormCard>
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
          <Button varient="primary" onClick={handleSubmit}>{editingMed ? "Update" : "Prescribe"}</Button>
        </div>
      </Modal>

      <CommonCard
        icon={<Pill />}
        title="Patient Medications"
        button={
          <div className="flex gap-2">
            <Button varient="secondary" onClick={() => router.back()}><ChevronLeft size={16} className="mr-1" /> Back</Button>
            <Button varient="primary" onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-1" /> Prescribe</Button>
          </div>
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
              {medications.map((med) => (
                <tr key={med.medicationId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{med.medicationName}</td>
                  <td className="px-4 py-3">{med.dosage}</td>
                  <td className="px-4 py-3">{med.frequency}</td>
                  <td className="px-4 py-3">{med.route}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${med.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(med)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(med.medicationId)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {medications.length === 0 && <div className="text-center py-8 text-gray-500">No medications prescribed</div>}
        </div>
      </CommonCard>
    </>
  );
}