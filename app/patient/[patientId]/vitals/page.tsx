"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { Activity } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function VitalsPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/vitals/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setVitals(data.vitals);
      setLoading(false);
    };
    fetchVitals();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <CommonCard
      title="Vital Signs"
      icon={<Activity size={18} />}
      button={
        <Link href={`/patient/${patientId}/clinical-view`}>
          <Button varient="secondary" size="sm">Back to Summary</Button>
        </Link>
      }
    >
      {vitals.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No vital signs recorded</p>
      ) : (
        <div className="space-y-3">
          {vitals.map((v: any) => (
            <div key={v.vitalId} className="border-b pb-2">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div><span className="text-gray-500">Temp:</span> {v.temperature}°C</div>
                <div><span className="text-gray-500">HR:</span> {v.heartRate} bpm</div>
                <div><span className="text-gray-500">BP:</span> {v.bloodPressureSystolic}/{v.bloodPressureDiastolic}</div>
                <div><span className="text-gray-500">SpO2:</span> {v.oxygenSaturation}%</div>
                <div><span className="text-gray-500">Pain:</span> {v.painLevel || 0}/10</div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{new Date(v.measuredAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </CommonCard>
  );
}