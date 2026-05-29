"use client";

import CommonCard from "../component/CommonCard";
import { Settings as SettingsIcon, Calendar, Loader2 } from "lucide-react";
import CustomCalendar from "../component/Scheduler";
import Dropdown from "../component/Dropdown";
import Modal from "../component/Modal";
import { useState, useEffect } from "react";
import Button from "../component/Button";
import NewAppointmentForm from "./NewAppointment";

interface Appointment {
  appointmentId: number;
  startTime: string;
  endTime: string;
  patientName: string;
  patientId: number;
  providerName: string;
  providerId: number;
  status: string;
  appointmentType: string;
  period: "AM" | "PM";
}

interface DropdownOption {
  label: string;
  value: string;
}

interface Practice {
  practiceId: number;
  practiceName: string;
}

interface Provider {
  providerId: number;
  firstName: string;
  lastName: string;
  providerType: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function SchedulerPage() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  // Fetch practices
  const fetchPractices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/practices`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPractices(data.practices || []);
      }
    } catch (error) {
      console.error("Error fetching practices:", error);
    }
  };

  // Fetch providers
  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      let url = `${API_BASE}/providers?status=active`;
      if (selectedPractice) {
        url += `&practiceId=${selectedPractice}`;
      }
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      let url = `${API_BASE}/appointments?date=${formattedDate}`;
      if (selectedProvider) {
        url += `&providerId=${selectedProvider}`;
      }
      
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        // Transform appointments to include period
        const formattedAppointments = (data.appointments || []).map((apt: any) => ({
          ...apt,
          period: getPeriodFromTime(apt.startTime)
        }));
        setAppointments(formattedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get period from time string
  const getPeriodFromTime = (time: string): "AM" | "PM" => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 12 ? "PM" : "AM";
  };

  // Create appointment
  const createAppointment = async (appointmentData: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchAppointments(); // Refresh appointments
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating appointment:", error);
      return false;
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchAppointments();
        alert("Appointment cancelled successfully");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Error cancelling appointment");
    }
  };

  // Convert time to minutes for comparison
  const toMinutes = (time: string, period: "AM" | "PM"): number => {
    let [hour, minute] = time.split(':').map(Number);
    
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    
    return hour * 60 + minute;
  };

  // Handle schedule click
  const handleSchedule = (time: string, period: "AM" | "PM") => {
    setSelectedTime(time);
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  // Handle add appointment
  const handleAddAppointment = async (formData: any) => {
    const appointmentData = {
      patientId: formData.patientId,
      patientName: formData.patientName,
      providerId: selectedProvider || formData.providerId,
      providerName: formData.providerName,
      locationId: "LOC001",
      locationName: "Main Clinic",
      appointmentDate: selectedDate.toISOString().split('T')[0],
      startTime: selectedTime,
      duration: formData.duration || 30,
      status: "scheduled",
      appointmentType: formData.appointmentType || "office",
      visitReason: formData.reason,
      comments: formData.comments
    };
    
    const success = await createAppointment(appointmentData);
    if (success) {
      setIsModalOpen(false);
      setSelectedTime(null);
      alert("Appointment scheduled successfully!");
    } else {
      alert("Failed to schedule appointment");
    }
  };

  // Initial load
  useEffect(() => {
    fetchPractices();
  }, []);

  useEffect(() => {
    if (selectedPractice) {
      fetchProviders();
    }
  }, [selectedPractice]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, selectedProvider]);

  // Convert practices to dropdown options
  const practiceOptions: DropdownOption[] = [
    { label: "All Practices", value: "" },
    ...practices.map(p => ({ label: p.practiceName, value: p.practiceId.toString() }))
  ];

  // Convert providers to dropdown options
  const providerOptions: DropdownOption[] = [
    { label: "All Providers", value: "" },
    ...providers.map(p => ({ 
      label: `Dr. ${p.firstName} ${p.lastName} (${p.providerType})`, 
      value: p.providerId.toString() 
    }))
  ];

  // Check if time slot has appointment
  const hasAppointment = (time: string, period: "AM" | "PM"): Appointment | null => {
    return appointments.find(apt => {
      const aptHour = parseInt(apt.startTime.split(':')[0]);
      const aptPeriod = aptHour >= 12 ? "PM" : "AM";
      return apt.startTime.startsWith(time.split(':')[0]) && aptPeriod === period;
    }) || null;
  };

  // Generate time slots
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = [0, 30]; // 30-minute intervals
  const periods: ("AM" | "PM")[] = ["AM", "PM"];

  return (
    <>
     {isModalOpen && (    <Modal
     
        close={() => {
          setIsModalOpen(false);
          setSelectedTime(null);
        }}
        title="Schedule New Appointment"
        size="lg"
      >
        <NewAppointmentForm 
          setPatientData={handleAddAppointment}
          close={() => {
            setIsModalOpen(false);
            setSelectedTime(null);
          }}
          selectedTime={selectedTime ? `${selectedTime} ${selectedPeriod}` : null}
        />
      </Modal>)}

      <CommonCard
        icon={<SettingsIcon />}
        title="Appointment Scheduler"
        button={
          <Button varient="primary" onClick={() => setIsModalOpen(true)}>
            <Calendar size={16} className="mr-1" /> New Appointment
          </Button>
        }
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-80 flex flex-col space-y-4">
            <CustomCalendar 
              selectedDate={selectedDate}
              onDateChange={(date: Date) => setSelectedDate(date)}
            />
            
            <Dropdown 
              label="Practice" 
              options={practiceOptions} 
              value={selectedPractice}
              onChange={(val:any) => setSelectedPractice(val)}
            />
            
            <Dropdown 
              label="Provider" 
              options={providerOptions} 
              value={selectedProvider}
              onChange={(val:any) => setSelectedProvider(val)}
            />

            {/* Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Appointments:</span>
                  <span className="font-semibold">{appointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled:</span>
                  <span className="text-green-600 font-semibold">
                    {appointments.filter(a => a.status === 'scheduled').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="text-blue-600 font-semibold">
                    {appointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cancelled:</span>
                  <span className="text-red-600 font-semibold">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="border border-border w-full rounded-lg overflow-hidden">
            <div className="p-4 max-h-[600px] overflow-y-auto w-full">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
              ) : (
                periods.map((period) => (
                  <div key={period} className="mb-6">
                    <h3 className="font-bold text-lg mb-2 sticky top-0 bg-white py-2 border-b">
                      {period}
                    </h3>
                    {hours.map((hour) => (
                      <div key={`${period}-${hour}`} className="mb-2">
                        {minutes.map((minute) => {
                          const timeString = `${hour}:${minute.toString().padStart(2, "0")}`;
                          const appointment = hasAppointment(timeString, period);
                          const isBooked = !!appointment;

                          return (
                            <div
                              key={`${period}-${hour}-${minute}`}
                              className="flex items-stretch w-full mb-1"
                            >
                              {/* Time slot button */}
                              <button
                                className={`bg-gray-100 text-black my-1 rounded-lg h-16 w-24 
                                  border border-gray-300 flex items-center justify-center flex-shrink-0
                                  hover:bg-gray-200 transition-colors
                                  ${isBooked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => !isBooked && handleSchedule(timeString, period)}
                                disabled={isBooked}
                                title={isBooked ? "Slot already booked" : "Click to book"}
                              >
                                <div className="text-center">
                                  <div className="font-semibold">{timeString}</div>
                                  <div className="text-xs">{period}</div>
                                </div>
                              </button>

                              {/* Appointment display */}
                              <div className="flex-1 m-1">
                                {appointment ? (
                                  <div 
                                    className={`rounded-md h-full flex flex-col items-start 
                                      justify-center p-2 text-sm font-medium cursor-pointer
                                      transition-colors
                                      ${appointment.status === 'scheduled' 
                                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                        : appointment.status === 'completed'
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-red-500 text-white hover:bg-red-600'}`}
                                    onClick={() => deleteAppointment(appointment.appointmentId)}
                                  >
                                    <div className="font-semibold">{appointment.patientName}</div>
                                    <div className="text-xs opacity-90">
                                      {appointment.providerName}
                                    </div>
                                    <div className="text-xs opacity-75 mt-1">
                                      {appointment.appointmentType}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-dashed border-gray-300 rounded-md 
                                    h-full flex items-center justify-center text-gray-400 text-sm">
                                    Available
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CommonCard>
    </>
  );
}