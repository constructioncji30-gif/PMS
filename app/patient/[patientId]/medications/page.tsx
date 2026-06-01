"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { Pill } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MedicationsPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/medications/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setMedications(data.medications);
      setLoading(false);
    };
    fetchMedications();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <CommonCard
      title="Medications"
      icon={<Pill size={18} />}
      button={
        <Link href={`/patient/${patientId}/clinical-view`}>
          <Button varient="secondary" size="sm">Back to Summary</Button>
        </Link>
      }
    >
      {medications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No medications prescribed</p>
      ) : (
        <div className="space-y-3">
          {medications.map((m: any) => (
            <div key={m.medicationId} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{m.medicationName}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${m.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{m.dosage} - {m.frequency} - {m.route}</p>
              {m.instructions && <p className="text-xs text-gray-400 mt-1">{m.instructions}</p>}
            </div>
          ))}
        </div>
      )}
    </CommonCard>
  );
}