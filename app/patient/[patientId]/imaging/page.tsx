"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { Camera } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ImagingPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [imaging, setImaging] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImaging = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/imaging/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setImaging(data.imaging);
      setLoading(false);
    };
    fetchImaging();
  }, [patientId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <CommonCard
      title="Imaging"
      icon={<Camera size={18} />}
      button={
        <Link href={`/patient/${patientId}/clinical-view`}>
          <Button varient="secondary" size="sm">Back to Summary</Button>
        </Link>
      }
    >
      {imaging.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No imaging studies</p>
      ) : (
        <div className="space-y-3">
          {imaging.map((i: any) => (
            <div key={i.imagingId} className="border-b pb-2">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{i.imagingType}</span>
                  <p className="text-xs text-gray-500">Body Part: {i.bodyPart}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${i.status === "Completed" ? "bg-green-100" : "bg-yellow-100"}`}>
                  {i.status}
                </span>
              </div>
              {i.findings && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{i.findings}</p>}
            </div>
          ))}
        </div>
      )}
    </CommonCard>
  );
}