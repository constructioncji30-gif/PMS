"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { FlaskConical } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LabsPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/labs/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setLabs(data.labs);
      setLoading(false);
    };
    fetchLabs();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <CommonCard
      title="Labs"
      icon={<FlaskConical size={18} />}
      button={
        <Link href={`/patient/${patientId}/clinical-view`}>
          <Button varient="secondary" size="sm">Back to Summary</Button>
        </Link>
      }
    >
      {labs.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No lab results</p>
      ) : (
        <div className="space-y-3">
          {labs.map((l: any) => (
            <div key={l.labId} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{l.labName}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${l.status === "Completed" ? "bg-green-100" : "bg-yellow-100"}`}>
                  {l.status}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className={`text-sm ${l.isAbnormal ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  Result: {l.resultValue || "Pending"} {l.unit}
                </p>
                {l.referenceRange && <p className="text-xs text-gray-400">Ref: {l.referenceRange}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </CommonCard>
  );
}