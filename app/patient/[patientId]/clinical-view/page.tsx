"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CommonCard from "@/app/component/CommonCard";
import { Activity, AlertCircle, Pill, Stethoscope, Calendar, Heart, Eye } from "lucide-react";
import Button from "@/app/component/Button";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ClinicalViewPage() {
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<any>(null);
  const [vitals, setVitals] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [patientId]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const [patientRes, vitalsRes, allergiesRes, medsRes, diagRes, encRes] = await Promise.all([
        fetch(`${API_BASE}/patients/${patientId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/vitals/patient/${patientId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/clinical/allergies/${patientId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/clinical/medications/${patientId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/clinical/diagnoses/${patientId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/encounters/patient/${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const patientData = await patientRes.json();
      const vitalsData = await vitalsRes.json();
      const allergiesData = await allergiesRes.json();
      const medsData = await medsRes.json();
      const diagData = await diagRes.json();
      const encData = await encRes.json();

      if (patientData.success) setPatient(patientData.patient);
      if (vitalsData.success) setVitals(vitalsData.vitals || []);
      if (allergiesData.success) setAllergies(allergiesData.allergies || []);
      if (medsData.success) setMedications(medsData.medications || []);
      if (diagData.success) setDiagnoses(diagData.activeDiagnoses || []);
      if (encData.success) setEncounters(encData.encounters || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading clinical data...</div>;
  }

  const sections = [
    { title: "Vital Signs", icon: <Heart size={18} />, data: vitals, count: vitals.length, link: "vitals", viewAll: vitals.length > 3 },
    { title: "Allergies", icon: <AlertCircle size={18} />, data: allergies, count: allergies.length, link: "allergies", viewAll: allergies.length > 3 },
    { title: "Medications", icon: <Pill size={18} />, data: medications, count: medications.length, link: "medications", viewAll: medications.length > 3 },
    { title: "Diagnoses", icon: <Stethoscope size={18} />, data: diagnoses, count: diagnoses.length, link: "diagnoses", viewAll: diagnoses.length > 3 },
    { title: "Encounters", icon: <Calendar size={18} />, data: encounters, count: encounters.length, link: "encounters", viewAll: encounters.length > 3 }
  ];

  return (
    <div className="space-y-4">
      <CommonCard title="Patient Information" icon={<Activity size={18} />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{patient?.firstName} {patient?.lastName}</p></div>
          <div><p className="text-xs text-gray-500">DOB</p><p className="font-medium">{patient?.dob}</p></div>
          <div><p className="text-xs text-gray-500">Gender</p><p className="font-medium">{patient?.sex}</p></div>
          <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{patient?.cellPhone}</p></div>
        </div>
      </CommonCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <CommonCard key={section.title} title={section.title} icon={section.icon}>
            {section.data.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No {section.title.toLowerCase()} recorded</p>
            ) : (
              <>
                {section.data.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="border-b pb-2 mb-2">
                    {section.title === "Vital Signs" && (
                      <div className="flex justify-between text-sm">
                        <span>Temp: {item.temperature}°C</span>
                        <span>HR: {item.heartRate} bpm</span>
                        <span>BP: {item.bloodPressureSystolic}/{item.bloodPressureDiastolic}</span>
                      </div>
                    )}
                    {section.title === "Allergies" && (
                      <div>
                        <span className="font-medium">{item.allergen}</span>
                        <p className="text-sm text-gray-500">{item.reaction}</p>
                      </div>
                    )}
                    {section.title === "Medications" && (
                      <div>
                        <span className="font-medium">{item.medicationName}</span>
                        <p className="text-sm text-gray-500">{item.dosage} - {item.frequency}</p>
                      </div>
                    )}
                    {section.title === "Diagnoses" && (
                      <div>
                        <span className="font-medium">{item.diagnosisName}</span>
                        <p className="text-xs text-gray-500">ICD-10: {item.icdCode}</p>
                      </div>
                    )}
                    {section.title === "Encounters" && (
                      <div>
                        <span className="font-medium">{item.encounterType}</span>
                        <p className="text-sm text-gray-500">{item.chiefComplaint || "No chief complaint"}</p>
                      </div>
                    )}
                  </div>
                ))}
                {section.viewAll && (
                  <div className="mt-2 text-right">
                    <Link href={`/patient/${patientId}/${section.link}`} className="text-blue-600 text-sm hover:underline">
                      View All ({section.count}) →
                    </Link>
                  </div>
                )}
              </>
            )}
          </CommonCard>
        ))}
      </div>
    </div>
  );
}