"use client";

import { useState } from "react";
import { SearchCheck } from "lucide-react";

import PatientTabs from "./patientTabs/PatientTabs";
import SearchPatient from "./Search/SearchPatient";
import PatientDetail from "./patientDetails/PatientMain";

// Define patient type
interface Patient {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  city: string;
  status: string;
}

// Define columns

// Dummy patient data

export default function PatientGridPage() {
  const [data, setData] = useState<Patient[]>([
    {
      id: 0,
      name: "Search Patient",
      gender: "Male",
      age: 35,
      phone: "055-123-4567",
      city: "Riyadh",
      status: "Active",
    },
  ]);
  const [screen, setScreen] = useState(0);
const [active, setActive] = useState(0);

  return (
    <>
      <PatientTabs
        icon={<SearchCheck />}
        setScreen={setScreen}
        tabData={data.map((item) => ({
          ...item,
          icon: <SearchCheck />,
        }))}
     
     active={active} setActive={setActive}/>
      {screen === 0 ? <SearchPatient setData={setData} setScreen={setScreen} setActive={setActive} /> : <PatientDetail />}
    </>
  );
}
