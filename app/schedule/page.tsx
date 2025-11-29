"use client";

import CommonCard from "../component/CommonCard";
import { Settings as SettingsIcon } from "lucide-react";
import CustomCalendar from "../component/Scheduler";
import Dropdown from "../component/Dropdown";
import Modal from "../component/Modal";
import { useState } from "react";
import Button from "../component/Button";
import NewAppointmentForm from "./NewAppointment";

export default function Index() {
  const practiceOptions = [
    { label: "Physician", value: "physician" },
    { label: "Nurse", value: "nurse" },
    { label: "Technician", value: "technician" },
    { label: "Therapist", value: "therapist" },
    { label: "Other", value: "other" },
  ];

  const providerOptions = [
    { label: "Physician", value: "physician" },
    { label: "Nurse", value: "nurse" },
    { label: "Technician", value: "technician" },
    { label: "Therapist", value: "therapist" },
    { label: "Other", value: "other" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [paientData, setPatientData] = useState([]);
 
  return (
    <>
      {" "}
      {isOpen && (
        <Modal
          close={() => setIsOpen(false)}
          title="New Appointment"
          icon={<span>📅</span>}
        >
          <NewAppointmentForm setPatientData={setPatientData} close={() => setIsOpen(false)} />
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
        <div>
          <div className="flex col">
            {" "}
            <div className="flex flex-col">
              <CustomCalendar />
              <Dropdown label="Practice" options={practiceOptions} />

              <Dropdown label="Provider " options={providerOptions} />
            </div>
            <div className="border border-border w-full">
              <div className="p-4 max-h-screen overflow-y-auto w-full">
                {(() => {
                  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                  const minutes = [0, 10, 20, 30, 40, 50];
                  const periods = ["AM", "PM"];

                  return periods.map((period) => (
                    <div key={period} className="mb-4 font-medium text-sm">
                      {hours.map((hour) => (
                        <div key={`${period}-${hour}`}>
                          {minutes.map((minute, index) => (
                            <div
                              key={`${period}-${hour}-${minute}`}
                              className="flex flex-row items-stretch w-full"
                            >
                              {/* Time box */}
                              <div
                                className="bg-lime-100 text-black my-1 rounded-lg 
                               h-24 w-24 border border-lime-300 
                               flex items-center justify-center flex-shrink-0 cursor-pointer"
                                onClick={
                                  paientData?.some(
                                    (i: any) =>
                                      i.startTime?.split(":")[0] == hour
                                  )
                                    ? () => {}
                                    : () => setIsOpen(true)
                                }
                                title={paientData?.some(
                                    (i: any) =>
                                      i.startTime?.split(":")[0] == hour
                                  )?'':'Click to Add Appointment'}
                              >
                                {hour}:{minute.toString().padStart(2, "0")}{" "}
                                {period}
                              </div>

                              {/* Extra section (only for hour 1 or 5) */}
                              {paientData?.map(
                                (i: any) =>
                                  i.startTime?.split(":")[0] == hour && (
                                    <div className="flex-1 bg-slate-400 m-1 rounded-md flex items-center justify-center text-white">
                                      {i.startTime == `0${hour}:${minute.toString().padStart(2, "0")}`
                                        ? i.patient
                                        : ""}
                                    </div>
                                  )
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </CommonCard>
    </>
  );
}
