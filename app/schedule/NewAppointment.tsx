"use client";

import React, { useState } from "react";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import CommonFormCard from "@/app/component/CommonFormCard";
import TextAea from "../component/TextAea";

const doctors = [
  { id: 1, label: "BEECHLER, LAURI" },
  { id: 2, label: "Dr. John Doe" },
  { id: 3, label: "Dr. Jane Smith" },
];

const locations = [
  { id: "aspire", label: "Aspire Regenerative Wound Care" },
  { id: "cityclinic", label: "City Clinic" },
  { id: "healthcenter", label: "Health Center" },
];

const statusOptions = [
  { id: "pending", label: "Pending" },
  { id: "scheduled", label: "Scheduled" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const durationOptions = [
  { id: "10", label: "10 min" },
  { id: "20", label: "20 min" },
  { id: "30", label: "30 min" },
  { id: "60", label: "60 min" },
];

const appointmentTypes = [
  { id: "office", label: "Office Visit" },
  { id: "tele", label: "Tele Visit" },
];

const NewAppointmentForm = ({setPatientData,close}:any) => {
  const [formData, setFormData] = useState({
    patient: "",
    location: "",
    provider: "",
    date: "",
    startTime: "",
    duration: "",
    status: "pending",
    appointmentType: "",
    reason: "",
    comments: "",
  });

  const handleChange = (name: string, value: any) => {
    console.log(value);
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
setPatientData((prev:any)=>[...prev,formData])
close()

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
          onChange={(val) => handleChange("location", val.target.value)}
        />

        <Dropdown
          label="Provider"
          options={doctors}
          value={formData.provider}
          onChange={(val) => handleChange("provider", val.target.value)}
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
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
          onChange={(val) => handleChange("duration", val.target.value)}
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={(val) => handleChange("status", val.target.value)}
        />

        <Dropdown
          label="Appointment Type"
          options={appointmentTypes}
          value={formData.appointmentType}
          onChange={(val) => handleChange("appointmentType", val.target.value)}
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
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder="Additional comments"
          />
        </div>
        <div className="text-right col-span-2">
          <Button type="submit">Save</Button>
        </div>
      </CommonFormCard>
    </form>
  );
};

export default NewAppointmentForm;
