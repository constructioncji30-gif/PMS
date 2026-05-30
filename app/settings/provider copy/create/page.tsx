"use client";

import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import CommonCard from "@/app/component/CommonCard";
import CommonLink from "@/app/component/CommonLink";
import Dropdown from "@/app/component/Dropdown";
import CommonFormCard from "@/app/component/CommonFormCard";

// Types
interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName: string;
  prefixTitle: string;
  suffix: string;
  role: string;
  phoneNumber: string;
  cellPhone: string;
  isActive: boolean;
  isEmailVerified: boolean;
  jobTitle: string;
  department: string;
}

// Dropdown options
const roleOptions = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
  { label: "Provider", value: "provider" },
  { label: "Nurse", value: "nurse" },
  { label: "Receptionist", value: "receptionist" },
  { label: "Billing Specialist", value: "billing" },
  { label: "Lab Technician", value: "lab_tech" },
  { label: "User", value: "user" },
];

const statusOptions = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const emailVerificationOptions = [
  { label: "Verified", value: "true" },
  { label: "Not Verified", value: "false" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function UserCreation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    middleName: "",
    prefixTitle: "",
    suffix: "",
    role: "user",
    phoneNumber: "",
    cellPhone: "",
    isActive: true,
    isEmailVerified: false,
    jobTitle: "",
    department: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear password error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordError(null);
    }
  };

  // Handle dropdown changes
  const handleDropdownChange = (name: keyof UserFormData) => (value: any) => {
    setFormData(prev => ({ ...prev, [name]: value === "true" ? true : value === "false" ? false : value }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("accessToken");
      
      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...submitData } = formData;
      
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("User created successfully!");
        router.push("/settings/user");
      } else {
        setError(data.error || data.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonCard
      icon={<UserPlusIcon />}
      button={
        <div className="flex gap-2">
          <Button
            varient="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
          <CommonLink
            varient="danger"
            href="/settings/user"
            title="Cancel"
          />
        </div>
      }
      title="Create New User"
    >
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Account Information */}
      <CommonFormCard cols={2} title="Account Information">
        <Input
          label="Username *"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter username"
          required
        />
        <Input
          label="Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email address"
          required
        />
        <Input
          label="Password *"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter password (min 8 characters)"
          required
        />
        <Input
          label="Confirm Password *"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm password"
          
          required
        />
        <Dropdown
          label="Role"
          options={roleOptions}
          value={formData.role}
          onChange={handleDropdownChange("role")}
        />
        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.isActive ? "true" : "false"}
          onChange={handleDropdownChange("isActive")}
        />
        <Dropdown
          label="Email Verification"
          options={emailVerificationOptions}
          value={formData.isEmailVerified ? "true" : "false"}
          onChange={handleDropdownChange("isEmailVerified")}
        />
      </CommonFormCard>

      {/* Personal Information */}
      <CommonFormCard cols={2} title="Personal Information">
        <Input
          label="First Name *"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter first name"
          required
        />
        <Input
          label="Last Name *"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter last name"
          required
        />
        <Input
          label="Middle Name"
          name="middleName"
          type="text"
          value={formData.middleName}
          onChange={handleInputChange}
          placeholder="Enter middle name"
        />
        <Input
          label="Prefix/Title"
          name="prefixTitle"
          type="text"
          value={formData.prefixTitle}
          onChange={handleInputChange}
          placeholder="e.g., Mr., Mrs., Dr."
        />
        <Input
          label="Suffix"
          name="suffix"
          type="text"
          value={formData.suffix}
          onChange={handleInputChange}
          placeholder="e.g., Jr., Sr., III"
        />
      </CommonFormCard>

      {/* Contact Information */}
      <CommonFormCard cols={2} title="Contact Information">
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
        <Input
          label="Cell Phone"
          name="cellPhone"
          type="tel"
          value={formData.cellPhone}
          onChange={handleInputChange}
          placeholder="Enter cell phone number"
        />
      </CommonFormCard>

      {/* Professional Information */}
      <CommonFormCard cols={2} title="Professional Information">
        <Input
          label="Job Title"
          name="jobTitle"
          type="text"
          value={formData.jobTitle}
          onChange={handleInputChange}
          placeholder="Enter job title"
        />
        <Input
          label="Department"
          name="department"
          type="text"
          value={formData.department}
          onChange={handleInputChange}
          placeholder="Enter department"
        />
      </CommonFormCard>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
        <Button
          type="button"
          varient="secondary"
          onClick={() => router.push("/settings/user")}
        >
          Cancel
        </Button>
        <Button
          type="button"
          varient="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </Button>
      </div>
    </CommonCard>
  );
}