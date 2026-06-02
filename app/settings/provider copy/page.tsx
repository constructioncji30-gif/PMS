"use client";

import { useState, useEffect } from "react";
import CommonCard from "@/app/component/CommonCard";
import { Users, SearchCheck } from "lucide-react";
import CommonLink from "@/app/component/CommonLink";
import Button from "@/app/component/Button";
import { ColumnDef } from "@tanstack/react-table";
import CommonDataGrid from "@/app/component/DataGrid";
import { useRouter } from "next/navigation";

// Define user type
interface User {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginDate: string | null;
  createdDate: string;
}

// Define columns
const columns: ColumnDef<User>[] = [
  { accessorKey: "userId", header: "ID", size: 60 },
  { 
    accessorKey: "name", 
    header: "Name",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    size: 150
  },
  { accessorKey: "username", header: "Username", size: 120 },
  { accessorKey: "email", header: "Email", size: 200 },
  { 
    accessorKey: "role", 
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const roleColors: Record<string, string> = {
        super_admin: "bg-red-100 text-red-800",
        admin: "bg-purple-100 text-purple-800",
        provider: "bg-blue-100 text-blue-800",
        nurse: "bg-green-100 text-green-800",
        receptionist: "bg-yellow-100 text-yellow-800",
        user: "bg-gray-100 text-gray-800",
      };
      const displayName: Record<string, string> = {
        super_admin: "Super Admin",
        admin: "Admin",
        provider: "Provider",
        nurse: "Nurse",
        receptionist: "Receptionist",
        user: "User",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || "bg-gray-100"}`}>
          {displayName[role] || role}
        </span>
      );
    },
    size: 120
  },
  { 
    accessorKey: "isActive", 
    header: "Status",
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.original.isActive 
          ? "bg-green-100 text-green-800" 
          : "bg-gray-100 text-gray-800"
      }`}>
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
    size: 100
  },
  { 
    accessorKey: "lastLoginDate", 
    header: "Last Login",
    cell: ({ row }) => row.original.lastLoginDate 
      ? new Date(row.original.lastLoginDate).toLocaleDateString() 
      : "Never",
    size: 120
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button 
          varient="primary" 
          
          onClick={() => handleView(row.original.userId)}
        >
          View
        </Button>
        <Button 
          varient="secondary" 
           
          onClick={() => handleEdit(row.original.userId)}
        >
          Edit
        </Button>
        <Button 
          varient="danger" 
          
          onClick={() => handleDelete(row.original.userId, row.original.firstName + " " + row.original.lastName)}
        >
          Delete
        </Button>
      </div>
    ),
    size: 200
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Action handlers (defined outside component to be used in columns)
let router: any;
let fetchUsersRef: any;

const handleView = (userId: number) => {
  if (router) {
    router.push(`/settings/user/${userId}`);
  }
};

const handleEdit = (userId: number) => {
  if (router) {
    router.push(`/settings/user/edit/${userId}`);
  }
};

const handleDelete = async (userId: number, userName: string) => {
  if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
  
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert("User deleted successfully");
      if (fetchUsersRef) {
        fetchUsersRef();
      }
    } else {
      alert(data.error || "Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Error deleting user");
  }
};

export default function UserGridPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const routerNext = useRouter();

  // Set router for action handlers
  useEffect(() => {
    router = routerNext;
  }, [routerNext]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      let url = `${API_BASE}/users?limit=100`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedRole) url += `&role=${selectedRole}`;
      if (selectedStatus) url += `&isActive=${selectedStatus === "active"}`;
      
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
        setTotalUsers(data.pagination?.total || data.users.length);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set fetchUsers ref for action handlers
  useEffect(() => {
    fetchUsersRef = fetchUsers;
  }, [fetchUsers]);

  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole, selectedStatus]);

  // Role options for filter
  const roleOptions = [
    { label: "All Roles", value: "" },
    { label: "Super Admin", value: "super_admin" },
    { label: "Admin", value: "admin" },
    { label: "Provider", value: "provider" },
    { label: "Nurse", value: "nurse" },
    { label: "Receptionist", value: "receptionist" },
    { label: "User", value: "user" },
  ];

  // Status options for filter
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  if (loading && users.length === 0) {
    return (
      <CommonCard
        icon={<Users />}
        button={
          <CommonLink
            varient="primary"
            href="/settings/user/create"
            title="Create User"
          />
        }
        title="User Management"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading users...</div>
        </div>
      </CommonCard>
    );
  }

  return (
    <CommonCard
      icon={<Users />}
      button={
        <CommonLink
          varient="primary"
          href="/settings/user/create"
          title="Create User"
        />
      }
      title="User Management"
    >
      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedRole("");
              setSelectedStatus("");
            }}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-semibold">{totalUsers}</span>
        </div>
        <div className="text-sm text-gray-600">
          Showing: <span className="font-semibold">{users.length}</span> users
        </div>
      </div>

      {/* Data Grid */}
      <CommonDataGrid 
        columns={columns} 
        data={users} 
        initialPageSize={10}
        maxHeight="500px"
      />

      {users.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          No users found. Click "Create User" to add your first user.
        </div>
      )}
    </CommonCard>
  );
}