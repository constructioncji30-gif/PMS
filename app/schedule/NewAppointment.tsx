"use client";

import React, { useState, useEffect } from "react";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import CommonFormCard from "@/app/component/CommonFormCard";
import TextArea from "../component/TextAea";

interface AppointmentFormData {
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  duration: string;
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function NewAppointmentForm({ setPatientData, close, selectedTime }: NewAppointmentFormProps) {
  const [patients, setPatients] = useState<DropdownOption[]>([]);
  const [providers, setProviders] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: "",
    patientName: "",
    providerId: "",
    providerName: "",
    duration: "30",
    appointmentType: "office",
    reason: "",
    comments: "",
  });

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/patients?limit=100`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const patientOptions = data.patients.map((p: any) => ({
          id: p.patientId,
          label: `${p.firstName} ${p.lastName} (${p.email || p.cellPhone || 'No contact'})`
        }));
        setPatients(patientOptions);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch providers
  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/providers?status=active`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const providerOptions = data.providers.map((p: any) => ({
          id: p.providerId,
          label: `Dr. ${p.firstName} ${p.lastName} - ${p.providerType}`
        }));
        setProviders(providerOptions);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchProviders();
  }, []);

  const durationOptions: DropdownOption[] = [
    { id: "15", label: "15 min" },
    { id: "30", label: "30 min" },
    { id: "45", label: "45 min" },
    { id: "60", label: "60 min" },
  ];

  const appointmentTypes: DropdownOption[] = [
    { id: "office", label: "Office Visit" },
    { id: "tele", label: "Tele Visit" },
    { id: "emergency", label: "Emergency" },
    { id: "followup", label: "Follow-up" },
  ];

  const handleChange = (name: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-populate patient name when patient is selected
    if (name === 'patientId') {
      const selectedPatient = patients.find(p => p.id.toString() === value);
      if (selectedPatient) {
        setFormData(prev => ({ ...prev, patientName: selectedPatient.label.split(' (')[0] }));
      }
    }
    
    // Auto-populate provider name when provider is selected
    if (name === 'providerId') {
      const selectedProvider = providers.find(p => p.id.toString() === value);
      if (selectedProvider) {
        setFormData(prev => ({ ...prev, providerName: selectedProvider.label }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.providerId) {
      alert("Please select both a patient and a provider");
      return;
    }
    
    setPatientData(formData);
    close();
  };

  return (
    <form onSubmit={handleSubmit}>
      <CommonFormCard className="border-0 shadow-sm mb-0" cols={2}>
        <div className="col-span-2">
          <Dropdown
            label="Select Patient *"
            options={patients}
            value={formData.patientId}
            onChange={(val:any) => handleChange("patientId", val)}
           
            required
          />
        </div>

        <Dropdown
          label="Select Provider *"
          options={providers}
          value={formData.providerId}
          onChange={(val:any) => handleChange("providerId", val)}
          
          required
        />

        <div className="col-span-2">
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <strong>Selected Time Slot:</strong> {selectedTime || "Not selected"}
          </div>
        </div>

        <Dropdown
          label="Duration"
          options={durationOptions}
          value={formData.duration}
          onChange={(val:any) => handleChange("duration", val)}
        />

        <Dropdown
          label="Appointment Type"
          options={appointmentTypes}
          value={formData.appointmentType}
          onChange={(val:any) => handleChange("appointmentType", val)}
        />

        <div className="col-span-2">
          <Input
            label="Visit Reason"
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="Enter visit reason"
          />
        </div>
        
        <div className="col-span-2">
          <TextArea
            label="Comments"
            value={formData.comments}
            onChange={(e: any) => handleChange("comments", e.target.value)}
            placeholder="Additional comments"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end gap-3 col-span-2 mt-4">
          <Button type="button" varient="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" varient="primary" disabled={loading}>
            Schedule Appointment
          </Button>
        </div>
      </CommonFormCard>
    </form>
  );
}