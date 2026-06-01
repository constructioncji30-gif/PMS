"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlaskConical, Plus, Eye, ChevronLeft } from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";

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
  orderedBy: string;
  status: string;
}

const labCategoryOptions = [
  { label: "Blood", value: "Blood" },
  { label: "Urine", value: "Urine" },
  { label: "Pathology", value: "Pathology" },
  { label: "Microbiology", value: "Microbiology" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Hematology", value: "Hematology" }
];

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LabsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState <any>({
    labName: "",
    labCategory: "",
    orderedDate: "",
    orderedBy: "",
    notes: ""
  });

  useEffect(() => {
    fetchLabs();
  }, [patientId]);

  const fetchLabs = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/labs/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLabs(data.labs);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/labs/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        fetchLabs();
        setIsModalOpen(false);
        resetForm();
        alert("Lab order created successfully");
      }
    } catch (error) {
      console.error("Error creating lab:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      labName: "",
      labCategory: "",
      orderedDate: "",
      orderedBy: "",
      notes: ""
    });
  };

  const viewLab = (lab: Lab) => {
    setSelectedLab(lab);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading labs...</div>;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title="Order New Lab Test"
        size="lg"
      >
        <CommonFormCard cols={2}>
          <Input
            label="Lab Test Name *"
            value={formData.labName}
            onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
            required
          />
          <Dropdown
            label="Lab Category"
            options={labCategoryOptions}
            value={formData.labCategory}
            onChange={(val) => setFormData({ ...formData, labCategory: val })}
          />
          <Input
            label="Ordered Date"
            type="date"
            value={formData.orderedDate}
            onChange={(e) => setFormData({ ...formData, orderedDate: e.target.value })}
          />
          <Input
            label="Ordered By"
            value={formData.orderedBy}
            onChange={(e) => setFormData({ ...formData, orderedBy: e.target.value })}
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
          <Button varient="primary" onClick={handleSubmit}>Order Lab</Button>
        </div>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Lab Results"
        size="lg"
      >
        {selectedLab && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-gray-500">Lab Test</label><p className="font-medium">{selectedLab.labName}</p></div>
              <div><label className="text-sm text-gray-500">Category</label><p>{selectedLab.labCategory}</p></div>
              <div><label className="text-sm text-gray-500">Ordered Date</label><p>{selectedLab.orderedDate}</p></div>
              <div><label className="text-sm text-gray-500">Result Date</label><p>{selectedLab.resultDate || "Pending"}</p></div>
              <div><label className="text-sm text-gray-500">Result Value</label><p>{selectedLab.resultValue || "Not available"}</p></div>
              <div><label className="text-sm text-gray-500">Reference Range</label><p>{selectedLab.referenceRange || "N/A"}</p></div>
              <div><label className="text-sm text-gray-500">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedLab.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {selectedLab.status}
                </span>
              </div>
              {selectedLab.isAbnormal && (
                <div><label className="text-sm text-gray-500">Flag</label><p className="text-red-600 font-medium">Abnormal</p></div>
              )}
            </div>
            {selectedLab.interpretation && (
              <div><label className="text-sm text-gray-500">Interpretation</label><p>{selectedLab.interpretation}</p></div>
            )}
          </div>
        )}
        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      <CommonCard
        icon={<FlaskConical />}
        title="Patient Labs"
        button={
          <div className="flex gap-2">
            <Button varient="secondary" onClick={() => router.back()}><ChevronLeft size={16} className="mr-1" /> Back</Button>
            <Button varient="primary" onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-1" /> Order Lab</Button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Lab Test</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Ordered Date</th>
                <th className="px-4 py-3 text-left">Result</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {labs.map((lab) => (
                <tr key={lab.labId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{lab.labName}</td>
                  <td className="px-4 py-3">{lab.labCategory}</td>
                  <td className="px-4 py-3">{lab.orderedDate}</td>
                  <td className="px-4 py-3">
                    {lab.resultValue ? (
                      <span className={lab.isAbnormal ? 'text-red-600 font-medium' : ''}>
                        {lab.resultValue} {lab.unit}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lab.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{lab.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => viewLab(lab)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {labs.length === 0 && <div className="text-center py-8 text-gray-500">No lab orders</div>}
        </div>
      </CommonCard>
    </>
  );
}