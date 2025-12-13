"use client";
import CommonCard from "../component/CommonCard";
import { Settings as SettingsIcon } from "lucide-react";
import CustomCalendar from "../component/Scheduler";
import Dropdown from "../component/Dropdown";
import Modal from "../component/Modal";
import { useState } from "react";
import Button from "../component/Button";
import NewAppointmentForm from "./NewAppointment";

interface Appointment {
  startTime: string;
  patient: string;
  period: "AM" | "PM";
}

interface DropdownOption {
  label: string;
  value: string;
}

export default function Index() {
  const practiceOptions: DropdownOption[] = [
    { label: "Physician", value: "physician" },
    { label: "Nurse", value: "nurse" },
    { label: "Technician", value: "technician" },
    { label: "Therapist", value: "therapist" },
    { label: "Other", value: "other" },
  ];

  const providerOptions: DropdownOption[] = [
    { label: "Physician", value: "physician" },
    { label: "Nurse", value: "nurse" },
    { label: "Technician", value: "technician" },
    { label: "Therapist", value: "therapist" },
    { label: "Other", value: "other" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<Appointment[]>([]);

  // Function to convert time to minutes for easy comparison
  const toMinutes = (time: string, period: "AM" | "PM"): number => {
    let hour = 0;
    let minute = 0;

    if (time.includes(":")) {
      const [h, m] = time.split(":").map(Number);
      hour = h;
      minute = m;
    } else if (time.includes(".")) {
      const [h, m] = time.split(".").map(Number);
      hour = h;
      minute = m < 10 ? m * 10 : m;
    }

    // Convert to 24-hour format for proper comparison
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minute;
  };

  // Handle scheduling a new appointment
  const handleSchedule = (time: string, period: "AM" | "PM") => {
    setSelectedTime(`${time} ${period}`);
    setIsOpen(true);
  };

  // Handle adding new appointment from form
  const handleAddAppointment = (appointmentData: Omit<Appointment, "startTime" | "period">) => {
    if (!selectedTime) return;

    const [time, period] = selectedTime.split(" ") as [string, "AM" | "PM"];
    
    const newAppointment: Appointment = {
      ...appointmentData,
      startTime: time,
      period: period,
    };

    setPatientData(prev => [...prev, newAppointment]);
    setIsOpen(false);
    setSelectedTime(null);
  };

 
  const hasAppointment = (time: string, period: "AM" | "PM"): Appointment | null => {
    return patientData.find(appointment => 
      appointment.startTime === time && appointment.period === period
    ) || null;
  };

  return (
    <>
      {isOpen && (
        <Modal
          close={() => {
            setIsOpen(false);
            setSelectedTime(null);
          }}
          title="New Appointment"
          icon={<span>📅</span>}
        >
          <NewAppointmentForm 
            setPatientData={handleAddAppointment} 
            close={() => {
              setIsOpen(false);
              setSelectedTime(null);
            }} 
            selectedTime={selectedTime}
          />
        </Modal>
      )}

      <CommonCard
        icon={<SettingsIcon />}
        title="Settings"
        button={
          <Button varient="primary" onClick={() => setIsOpen(true)}>
            New Appointment
          </Button>
        }
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col space-y-4">
            <CustomCalendar />
            <Dropdown label="Practice" options={practiceOptions} />
            <Dropdown label="Provider" options={providerOptions} />
          </div>

          <div className="border border-border w-full rounded-lg overflow-hidden">
            <div className="p-4 max-h-screen overflow-y-auto w-full">
              {(() => {
                const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                const minutes = [0, 10, 20, 30, 40, 50];
                const periods: ("AM" | "PM")[] = ["AM", "PM"];

                return periods.map((period) => (
                  <div key={period} className="mb-6">
                    <h3 className="font-bold text-lg mb-2 sticky top-0 bg-white py-2">
                      {period}
                    </h3>
                    {hours.map((hour) => (
                      <div key={`${period}-${hour}`} className="mb-2">
                        {minutes.map((minute) => {
                          const timeString = `${hour}:${minute.toString().padStart(2, "0")}`;
                          const appointment = hasAppointment(timeString, period);

                          return (
                            <div
                              key={`${period}-${hour}-${minute}`}
                              className="flex items-stretch w-full mb-1"
                            >
                              {/* Time box */}
                              <div
                                className="bg-lime-100 text-black my-1 rounded-lg 
                                h-20 w-24 border border-lime-300 
                                flex items-center justify-center flex-shrink-0 cursor-pointer
                                hover:bg-lime-200 transition-colors"
                                onClick={() => handleSchedule(timeString, period)}
                                title="Click to Add Appointment"
                              >
                                <div className="text-center">
                                  <div className="font-semibold">{timeString}</div>
                                  <div className="text-xs">{period}</div>
                                </div>
                              </div>

                              {/* Appointment display */}
                              <div className="flex-1 m-1">
                                {appointment ? (
                                  <div
                                    className="bg-blue-500 rounded-md h-full flex items-center 
                                    justify-center text-white p-2 text-sm font-medium"
                                  >
                                    {appointment.patient}
                                  </div>
                                ) : (
                                  <div
                                    className="border border-dashed border-gray-300 rounded-md 
                                    h-full flex items-center justify-center text-gray-400 text-sm"
                                  >
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
                ));
              })()}
            </div>
          </div>
        </div>
      </CommonCard>
    </>
  );
}