"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { Calendar } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EncountersPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncounters = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/encounters/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setEncounters(data.encounters);
      setLoading(false);
    };
    fetchEncounters();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <CommonCard
      title="Encounters"
      icon={<Calendar size={18} />}
      button={
        <Link href={`/patient/${patientId}/clinical-view`}>
          <Button varient="secondary" size="sm">Back to Summary</Button>
        </Link>
      }
    >
      {encounters.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No encounters</p>
      ) : (
        <div className="space-y-3">
          {encounters.map((e: any) => (
            <div key={e.encounterId} className="border-b pb-2">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{e.encounterType}</span>
                  <p className="text-xs text-gray-500">#{e.encounterNumber}</p>
                </div>
                <span className="text-sm text-gray-500">{new Date(e.encounterDate).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{e.chiefComplaint || "No chief complaint"}</p>
              <span className={`px-2 py-0.5 rounded-full text-xs ${e.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100"}`}>
                {e.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </CommonCard>
  );
}