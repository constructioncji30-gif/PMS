import { redirect } from "next/navigation";

export default function PatientPage({ params }: { params: { id: string } }) {
  redirect(`/patient/${params.id}/clinical-view`);
}