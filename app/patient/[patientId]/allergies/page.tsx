"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { AlertCircle } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AllergiesPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllergies = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/allergies/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setAllergies(data.allergies);
      setLoading(false);
    };
    fetchAllergies();
  }, [patientId]);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "Mild": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Severe": return "bg-orange-100 text-orange-800";
      case "Life-threatening": return "bg-red-100 text-red-800";
      default: return "bg-gray-100";
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <CommonCard
      title="Allergies"
      icon={<AlertCircle size={18} />}
      button={
        <Link href={`/patient/${patientId}/clinical-view`}>
          <Button varient="secondary" size="sm">Back to Summary</Button>
        </Link>
      }
    >
      {allergies.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No allergies recorded</p>
      ) : (
        <div className="space-y-3">
          {allergies.map((a: any) => (
            <div key={a.allergyId} className="border-b pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{a.allergen}</span>
                  <p className="text-sm text-gray-500">{a.reaction}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getSeverityColor(a.severity)}`}>
                  {a.severity}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Type: {a.allergyType} | Status: {a.status}</p>
            </div>
          ))}
        </div>
      )}
    </CommonCard>
  );
}