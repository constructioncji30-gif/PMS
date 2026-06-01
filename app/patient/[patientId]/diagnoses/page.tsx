"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { Stethoscope } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DiagnosesPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/diagnoses/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setDiagnoses(data.activeDiagnoses || []);
      setLoading(false);
    };
    fetchDiagnoses();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <CommonCard
      title="Diagnoses"
      icon={<Stethoscope size={18} />}
      button={
        <Link href={`/patient/${patientId}/clinical-view`}>
          <Button varient="secondary" size="sm">Back to Summary</Button>
        </Link>
      }
    >
      {diagnoses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No diagnoses recorded</p>
      ) : (
        <div className="space-y-3">
          {diagnoses.map((d: any) => (
            <div key={d.diagnosisId} className="border-b pb-2">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{d.diagnosisName}</span>
                  <p className="text-xs text-gray-500">ICD-10: {d.icdCode}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${d.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>
                  {d.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">Type: {d.diagnosisType}</p>
            </div>
          ))}
        </div>
      )}
    </CommonCard>
  );
}