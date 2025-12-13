"use client";

import React, { useState } from "react";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import CommonFormCard from "@/app/component/CommonFormCard";
 import TextAea from "../component/TextAea";

interface AppointmentFormData {
  patient: string;
  location: string;
  provider: string;
  date: string;
  startTime: string;
  duration: string;
  status: string;
  appointmentType: string;
  reason: string;
  comments: string;
}

interface DropdownOption {
  id: string | number;
  label: string;
}

interface NewAppointmentFormProps {
  setPatientData: (data: any) => void;
  close: () => void;
  selectedTime?: string | null;
}

const doctors: DropdownOption[] = [
  { id: 1, label: "BEECHLER, LAURI" },
  { id: 2, label: "Dr. John Doe" },
  { id: 3, label: "Dr. Jane Smith" },
];

const locations: DropdownOption[] = [
  { id: "aspire", label: "Aspire Regenerative Wound Care" },
  { id: "cityclinic", label: "City Clinic" },
  { id: "healthcenter", label: "Health Center" },
];

const statusOptions: DropdownOption[] = [
  { id: "pending", label: "Pending" },
  { id: "scheduled", label: "Scheduled" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const durationOptions: DropdownOption[] = [
  { id: "10", label: "10 min" },
  { id: "20", label: "20 min" },
  { id: "30", label: "30 min" },
  { id: "60", label: "60 min" },
];

const appointmentTypes: DropdownOption[] = [
  { id: "office", label: "Office Visit" },
  { id: "tele", label: "Tele Visit" },
];

const NewAppointmentForm = ({ setPatientData, close, selectedTime }: NewAppointmentFormProps) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient: "",
    location: "",
    provider: "",
    date: "",
    startTime: selectedTime ? selectedTime.split(" ")[0] : "", // Extract time from selectedTime
    duration: "",
    status: "pending",
    appointmentType: "",
    reason: "",
    comments: "",
  });

  // Update startTime when selectedTime changes
  React.useEffect(() => {
    if (selectedTime) {
      const timePart = selectedTime.split(" ")[0];
      setFormData(prev => ({ ...prev, startTime: timePart }));
    }
  }, [selectedTime]);

  const handleChange = (name: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name: keyof AppointmentFormData) => (val: any) => {
    // Handle both event objects and direct values
    const value = val?.target?.value !== undefined ? val.target.value : val;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.patient || !formData.date || !formData.startTime) {
      alert("Please fill in all required fields: Patient, Date, and Start Time");
      return;
    }

    // Add the new appointment
    setPatientData((prev: AppointmentFormData[]) => [...prev, formData]);
    close();
  };

  // Get current date in YYYY-MM-DD format for the date input min attribute
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit}>
      <CommonFormCard className="border-0 shadow-sm mb-0" cols={2}>
        <div className="col-span-2">
          <Input
            label="Search Patient"
            value={formData.patient}
            onChange={(e) => handleChange("patient", e.target.value)}
            placeholder="Search Patient"
            required
          />
        </div>

        <Dropdown
          label="Location"
          options={locations}
          value={formData.location}
          onChange={handleDropdownChange("location")}
        />

        <Dropdown
          label="Provider"
          options={doctors}
          value={formData.provider}
          onChange={handleDropdownChange("provider")}
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          min={getTodayDate()}
          required
        />

        <Input
          label="Start Time"
          type="time"
          value={formData.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          required
        />

        <Dropdown
          label="Duration"
          options={durationOptions}
          value={formData.duration}
          onChange={handleDropdownChange("duration")}
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={handleDropdownChange("status")}
        />

        <Dropdown
          label="Appointment Type"
          options={appointmentTypes}
          value={formData.appointmentType}
          onChange={handleDropdownChange("appointmentType")}
        />

        <Input
          label="Visit Reason"
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Enter visit reason"
        />
        
        <div className="col-span-2">
          <TextAea
            label="Comments"
            value={formData.comments}
            onChange={(e:any) => handleChange("comments", e.target.value)}
            placeholder="Additional comments"
            rows={4}
          />
        </div>
        
        <div className="flex justify-end gap-3 col-span-2 mt-4">
          <Button 
            type="button" 
            varient="secondary" 
            onClick={close}
          >
            Cancel
          </Button>
          <Button type="submit" varient="primary">
            Save Appointment
          </Button>
        </div>
      </CommonFormCard>
    </form>
  );
};

export default NewAppointmentForm;