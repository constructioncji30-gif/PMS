"use client";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Settings,
  NewspaperIcon,
} from "lucide-react";

import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import CommonCard from "@/app/component/CommonCard";
import CommonLink from "@/app/component/CommonLink";
import Dropdown from "@/app/component/Dropdown";
import CheckBox from "@/app/component/CheckBox";
import { useState } from "react";
import CommonFormCard from "@/app/component/CommonFormCard";

const size = 40;
 
// Dropdown options
const sexOptions = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
];
const statusOptions = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];
const maritalStatusOptions = [
  { id: "single", label: "Single" },
  { id: "married", label: "Married" },
  { id: "divorced", label: "Divorced" },
  { id: "widowed", label: "Widowed" },
];
const languageOptions = [
  { id: "english", label: "English" },
  { id: "english-uk", label: "English (UK)" },
];
const cityOptions = [
  { id: "riyadh", label: "Riyadh" },
  { id: "jeddah", label: "Jeddah" },
  { id: "dammam", label: "Dammam" },
];
const phoneTypeOptions = [
  { id: "mobile", label: "Mobile" },
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
];
const relationshipOptions = [
  { id: "parent", label: "Parent" },
  { id: "sibling", label: "Sibling" },
  { id: "friend", label: "Friend" },
  { id: "other", label: "Other" },
];
const paymentMethodOptions = [
  { id: "cash", label: "Cash" },
  { id: "credit-card", label: "Credit Card" },
  { id: "check", label: "Check" },
  { id: "insurance", label: "Insurance" },
];

export default function Index() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    prefixTitle: "",
    suffix: "",
    dob: "",
    sex: "",
    ssn: "",
    previousName: "",
    professionalSuffix: "",
    status: "",
    maritalStatus: "",
    preferredLanguage: "",
    interpreterRequired: "",
    biologicalSex: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    homePhone: "",
    primaryPhoneType: "",
    cellPhone: "",
    workPhone: "",
    email: "",
    comments: "",
    emergencyContactNumber: "",
    relationship: "",
    emergencyEmail: "",
    altPatientName: "",
    altPatientPhone: "",
    altPatientEmail: "",
    altPatientAddress: "",
    race: [] as string[],
    ethnicity: [] as string[],
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceGroupNumber: "",
    insurancePhone: "",
    insuranceAddress: "",
    motherName: "",
    motherPhone: "",
    motherEmail: "",
    motherAddress: "",
    referringPhysician: "",
    primaryPhysician: "",
    paymentMethod: "",
  });

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <CommonCard
      icon={<NewspaperIcon />}
      button={
        <div>
          <Button varient="primary" onClick={() => alert("Saved!")}>
            Save
          </Button>
          <CommonLink varient="danger" href="/settings/patients" title="Cancel" />
        </div>
      }
      title="Create New Patient"
    >
      {/* Patient Info */}
      <CommonFormCard title="Patient Information">
        <Input
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
        <Input
          label="Middle Name"
          type="text"
          value={formData.middleName}
          onChange={(e) => handleChange("middleName", e.target.value)}
        />
        <Input
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
        <Input
          label="DOB"
          type="date"
          value={formData.dob}
          onChange={(e) => handleChange("dob", e.target.value)}
        />
        <Dropdown
          label="Sex"
          options={sexOptions}
          value={formData.sex}
          onChange={(val) => handleChange("sex", val)}
        />
        <Input
          label="SSN"
          type="text"
          value={formData.ssn}
          onChange={(e) => handleChange("ssn", e.target.value)}
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={(val) => handleChange("status", val)}
        />
        <Dropdown
          label="Marital Status"
          options={maritalStatusOptions}
          value={formData.maritalStatus}
          onChange={(val) => handleChange("maritalStatus", val)}
        />
        <Dropdown
          label="Preferred Language"
          options={languageOptions}
          value={formData.preferredLanguage}
          onChange={(val) => handleChange("preferredLanguage", val)}
        />

        <CheckBox
          label="Interpreter Required"
          values={["Yes", "No"]}
          checked={formData.interpreterRequired}
          onClick={(val) => handleChange("interpreterRequired", val)}
        />

        <Dropdown
          label="Biological Sex (at Birth)"
          options={sexOptions}
          value={formData.biologicalSex}
          onChange={(val) => handleChange("biologicalSex", val)}
        />
      </CommonFormCard>

      {/* Contact */}
      <CommonFormCard title="Patient Address & Contact Information">
        <Input
          label="Address Line 1"
          type="text"
          value={formData.address1}
          onChange={(e) => handleChange("address1", e.target.value)}
        />
        <Input
          label="Address Line 2"
          type="text"
          value={formData.address2}
          onChange={(e) => handleChange("address2", e.target.value)}
        />
        <Dropdown
          label="City"
          options={cityOptions}
          value={formData.city}
          onChange={(val) => handleChange("city", val)}
        />
        <Input
          label="State"
          type="text"
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
        />
        <Input
          label="Zip Code"
          type="text"
          value={formData.zip}
          onChange={(e) => handleChange("zip", e.target.value)}
        />
        <Input
          label="Country"
          type="text"
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />
        <Dropdown
          label="Primary Phone Type"
          options={phoneTypeOptions}
          value={formData.primaryPhoneType}
          onChange={(val) => handleChange("primaryPhoneType", val)}
        />
        <Input
          label="Cell Phone"
          type="text"
          value={formData.cellPhone}
          onChange={(e) => handleChange("cellPhone", e.target.value)}
        />
        <Input
          label="Work Phone"
          type="text"
          value={formData.workPhone}
          onChange={(e) => handleChange("workPhone", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          label="Comments"
          type="text"
          value={formData.comments}
          onChange={(e) => handleChange("comments", e.target.value)}
        />
      </CommonFormCard>

      {/* Emergency */}
      <CommonFormCard title="Emergency Contact">
        <Input
          label="Emergency Contact Number"
          type="text"
          value={formData.emergencyContactNumber}
          onChange={(e) => handleChange("emergencyContactNumber", e.target.value)}
        />
        <Dropdown
          label="Relationship"
          options={relationshipOptions}
          value={formData.relationship}
          onChange={(val) => handleChange("relationship", val)}
        />
        <Input
          label="Email"
          type="email"
          value={formData.emergencyEmail}
          onChange={(e) => handleChange("emergencyEmail", e.target.value)}
        />
      </CommonFormCard>

      {/* Alternative Info */}
      <CommonFormCard title="Alternative Patient Information">
        <Input
          label="Alternative Patient Name"
          type="text"
          value={formData.altPatientName}
          onChange={(e) => handleChange("altPatientName", e.target.value)}
        />
        <Input
          label="Alternative Patient Contact Number"
          type="text"
          value={formData.altPatientPhone}
          onChange={(e) => handleChange("altPatientPhone", e.target.value)}
        />
        <Input
          label="Alternative Patient Email"
          type="email"
          value={formData.altPatientEmail}
          onChange={(e) => handleChange("altPatientEmail", e.target.value)}
        />
        <Input
          label="Alternative Patient Address"
          type="text"
          value={formData.altPatientAddress}
          onChange={(e) => handleChange("altPatientAddress", e.target.value)}
        />
      </CommonFormCard>

      {/* Race & Ethnicity */}
      <CommonFormCard className="md:grid-cols-2" title="Race & Ethnicity">
        <CheckBox
          label="Race*"
          values={["White", "Black or African American", "Asian", "Native American", "Other"]}
          checked={formData.race}
          onClick={(val) => handleChange("race", val)}
        />
        <CheckBox
          label="Ethnicity*"
          values={["Hispanic or Latino", "Not Hispanic or Latino", "Unknown"]}
          checked={formData.ethnicity}
          onClick={(val) => handleChange("ethnicity", val)}
        />
      </CommonFormCard>

      {/* Insurance */}
      <CommonFormCard title="Insurance Information">
        <Input
          label="Insurance Provider"
          type="text"
          value={formData.insuranceProvider}
          onChange={(e) => handleChange("insuranceProvider", e.target.value)}
        />
        <Input
          label="Insurance Policy Number"
          type="text"
          value={formData.insurancePolicyNumber}
          onChange={(e) => handleChange("insurancePolicyNumber", e.target.value)}
        />
        <Input
          label="Insurance Group Number"
          type="text"
          value={formData.insuranceGroupNumber}
          onChange={(e) => handleChange("insuranceGroupNumber", e.target.value)}
        />
        <Input
          label="Insurance Phone"
          type="text"
          value={formData.insurancePhone}
          onChange={(e) => handleChange("insurancePhone", e.target.value)}
        />
        <Input
          label="Insurance Address"
          type="text"
          value={formData.insuranceAddress}
          onChange={(e) => handleChange("insuranceAddress", e.target.value)}
        />
      </CommonFormCard>

      {/* Mother / Guardian */}
      <CommonFormCard title="Mother/Guardian Information">
        <Input
          label="Mother/Guardian Name"
          type="text"
          value={formData.motherName}
          onChange={(e) => handleChange("motherName", e.target.value)}
        />
        <Input
          label="Mother/Guardian Contact Number"
          type="text"
          value={formData.motherPhone}
          onChange={(e) => handleChange("motherPhone", e.target.value)}
        />
        <Input
          label="Mother/Guardian Email"
          type="email"
          value={formData.motherEmail}
          onChange={(e) => handleChange("motherEmail", e.target.value)}
        />
        <Input
          label="Mother/Guardian Address"
          type="text"
          value={formData.motherAddress}
          onChange={(e) => handleChange("motherAddress", e.target.value)}
        />
      </CommonFormCard>

      {/* Additional */}
      <CommonFormCard title="Additional Info">
        <Input
          label="Referring Physician"
          type="text"
          value={formData.referringPhysician}
          onChange={(e) => handleChange("referringPhysician", e.target.value)}
        />
        <Input
          label="Primary Care Physician"
          type="text"
          value={formData.primaryPhysician}
          onChange={(e) => handleChange("primaryPhysician", e.target.value)}
        />
        <Dropdown
          label="Payment Method*"
          options={paymentMethodOptions}
          value={formData.paymentMethod}
          onChange={(val) => handleChange("paymentMethod", val)}
        />
      </CommonFormCard>
    </CommonCard>
  );
}
