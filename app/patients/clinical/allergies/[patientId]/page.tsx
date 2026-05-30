"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Plus, Edit, Trash2, ChevronLeft } from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";

interface Allergy {
  allergyId: number;
  allergen: string;
  allergyType: string;
  reaction: string;
  severity: string;
  onsetDate: string;
  status: string;
  notes: string;
}

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AllergiesPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [formData, setFormData] = useState <any>({
    allergen: "",
    allergyType: "",
    reaction: "",
    severity: "Moderate",
    onsetDate: "",
    status: "Active",
    notes: ""
  });

  useEffect(() => {
    fetchAllergies();
  }, [patientId]);

  const fetchAllergies = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/allergies/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAllergies(data.allergies);
      }
    } catch (error) {
      console.error("Error fetching allergies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = editingAllergy
        ? `${API_BASE}/clinical/allergies/${editingAllergy.allergyId}`
        : `${API_BASE}/clinical/allergies/${patientId}`;
      const method = editingAllergy ? "PUT" : "POST";

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
        fetchAllergies();
        setIsModalOpen(false);
        resetForm();
        alert(editingAllergy ? "Allergy updated successfully" : "Allergy added successfully");
      }
    } catch (error) {
      console.error("Error saving allergy:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this allergy?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/allergies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchAllergies();
        alert("Allergy deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting allergy:", error);
    }
  };

  const handleEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    setFormData({
      allergen: allergy.allergen,
      allergyType: allergy.allergyType,
      reaction: allergy.reaction,
      severity: allergy.severity,
      onsetDate: allergy.onsetDate?.split('T')[0] || "",
      status: allergy.status,
      notes: allergy.notes || ""
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingAllergy(null);
    setFormData({
      allergen: "",
      allergyType: "",
      reaction: "",
      severity: "Moderate",
      onsetDate: "",
      status: "Active",
      notes: ""
    });
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      Mild: "bg-green-100 text-green-800",
      Moderate: "bg-yellow-100 text-yellow-800",
      Severe: "bg-orange-100 text-orange-800",
      "Life-threatening": "bg-red-100 text-red-800"
    };
    return colors[severity as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="text-center py-8">Loading allergies...</div>;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingAllergy ? "Edit Allergy" : "Add New Allergy"}
        size="lg"
      >
        <CommonFormCard cols={2}>
          <Input
            label="Allergen *"
            value={formData.allergen}
            onChange={(e) => setFormData({ ...formData, allergen: e.target.value })}
            placeholder="e.g., Penicillin, Peanuts, Pollen"
            required
          />
          <Dropdown
            label="Allergy Type"
            options={allergyTypeOptions}
            value={formData.allergyType}
            onChange={(val) => setFormData({ ...formData, allergyType: val })}
          />
          <Input
            label="Reaction"
            value={formData.reaction}
            onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
            placeholder="e.g., Rash, Swelling, Anaphylaxis"
          />
          <Dropdown
            label="Severity"
            options={severityOptions}
            value={formData.severity}
            onChange={(val) => setFormData({ ...formData, severity: val })}
          />
          <Input
            label="Onset Date"
            type="date"
            value={formData.onsetDate}
            onChange={(e) => setFormData({ ...formData, onsetDate: e.target.value })}
          />
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
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
          <Button varient="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
            Cancel
          </Button>
          <Button varient="primary" onClick={handleSubmit}>
            {editingAllergy ? "Update" : "Add"} Allergy
          </Button>
        </div>
      </Modal>

      <CommonCard
        icon={<AlertCircle />}
        title="Patient Allergies"
        button={
          <div className="flex gap-2">
            <Button varient="secondary" onClick={() => router.back()}>
              <ChevronLeft size={16} className="mr-1" /> Back
            </Button>
            <Button varient="primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1" /> Add Allergy
            </Button>
          </div>
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
              {allergies.map((allergy) => (
                <tr key={allergy.allergyId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{allergy.allergen}</td>
                  <td className="px-4 py-3">{allergy.allergyType}</td>
                  <td className="px-4 py-3">{allergy.reaction}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(allergy.severity)}`}>
                      {allergy.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">{allergy.status}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(allergy)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(allergy.allergyId)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allergies.length === 0 && (
            <div className="text-center py-8 text-gray-500">No allergies recorded</div>
          )}
        </div>
      </CommonCard>
    </>
  );
}