"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Plus, Edit, Eye, ChevronLeft, CheckCircle } from "lucide-react";

import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import Modal from "@/app/component/Modal";
import TextArea from "@/app/component/TextAea";

interface ClinicalNote {
  noteId: number;
  noteType: string;
  title: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  authoredBy: string;
  authoredDate: string;
  status: string;
  isSigned: boolean;
  signedBy: string;
  content:any;
  signedDate: string;
}

const noteTypeOptions = [
  { label: "Progress Note", value: "Progress Note" },
  { label: "SOAP Note", value: "SOAP Note" },
  { label: "Discharge Summary", value: "Discharge Summary" },
  { label: "Consultation Note", value: "Consultation Note" },
  { label: "Follow-up Note", value: "Follow-up Note" }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ClinicalNotesPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ClinicalNote | null>(null);
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);
  const [formData, setFormData] = useState <any>({
    noteType: "",
    title: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    content: ""
  });

  useEffect(() => {
    fetchNotes();
  }, [patientId]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/notes/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = editingNote
        ? `${API_BASE}/clinical/notes/${editingNote.noteId}`
        : `${API_BASE}/clinical/notes/${patientId}`;
      const method = editingNote ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        fetchNotes();
        setIsModalOpen(false);
        resetForm();
        alert(editingNote ? "Note updated successfully" : "Note created successfully");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleSign = async (noteId: number) => {
    if (!confirm("Sign this note? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/clinical/notes/${noteId}/sign`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchNotes();
        alert("Note signed successfully");
      }
    } catch (error) {
      console.error("Error signing note:", error);
    }
  };

  const handleEdit = (note: ClinicalNote) => {
    setEditingNote(note);
    setFormData({
      noteType: note.noteType,
      title: note.title || "",
      subjective: note.subjective || "",
      objective: note.objective || "",
      assessment: note.assessment || "",
      plan: note.plan || "",
      content: note?.content || ""
    });
    setIsModalOpen(true);
  };

  const viewNote = (note: ClinicalNote) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setEditingNote(null);
    setFormData({
      noteType: "",
      title: "",
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      content: ""
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading clinical notes...</div>;
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingNote ? "Edit Clinical Note" : "New Clinical Note"}
       
      >
        <CommonFormCard cols={2}>
          <Dropdown
            label="Note Type"
            options={noteTypeOptions}
            value={formData.noteType}
            onChange={(val) => setFormData({ ...formData, noteType: val })}
          />
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="col-span-2">
            <TextArea
              label="Subjective (Patient's description)"
              value={formData.subjective}
              onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
              rows={3}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Objective (Exam findings, vitals, labs)"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              rows={3}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Assessment (Diagnosis)"
              value={formData.assessment}
              onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
              rows={3}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Plan (Treatment plan)"
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              rows={3}
            />
          </div>
        </CommonFormCard>
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
          <Button varient="primary" onClick={handleSubmit}>{editingNote ? "Update" : "Create"} Note</Button>
        </div>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedNote?.title || selectedNote?.noteType || "Clinical Note"}
  
      >
        {selectedNote && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500 border-b pb-2">
              <span>Author: {selectedNote.authoredBy}</span>
              <span>Date: {new Date(selectedNote.authoredDate).toLocaleString()}</span>
              <span>Status: {selectedNote.status}</span>
              {selectedNote.isSigned && <span>Signed by: {selectedNote.signedBy}</span>}
            </div>
            {selectedNote.subjective && (
              <div><label className="text-sm font-semibold">Subjective</label><p className="mt-1">{selectedNote.subjective}</p></div>
            )}
            {selectedNote.objective && (
              <div><label className="text-sm font-semibold">Objective</label><p className="mt-1">{selectedNote.objective}</p></div>
            )}
            {selectedNote.assessment && (
              <div><label className="text-sm font-semibold">Assessment</label><p className="mt-1">{selectedNote.assessment}</p></div>
            )}
            {selectedNote.plan && (
              <div><label className="text-sm font-semibold">Plan</label><p className="mt-1">{selectedNote.plan}</p></div>
            )}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button varient="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      <CommonCard
        icon={<FileText />}
        title="Clinical Notes"
        button={
          <div className="flex gap-2">
            <Button varient="secondary" onClick={() => router.back()}><ChevronLeft size={16} className="mr-1" /> Back</Button>
            <Button varient="primary" onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-1" /> New Note</Button>
          </div>
        }
      >
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.noteId} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{note.title || note.noteType}</h3>
                    {note.isSigned && <CheckCircle size={14} className="text-green-500" />}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {note.authoredBy} • {new Date(note.authoredDate).toLocaleDateString()}
                  </div>
                  {note.assessment && <p className="text-sm mt-2 line-clamp-2">{note.assessment}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => viewNote(note)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                  {!note.isSigned && (
                    <>
                      <button onClick={() => handleEdit(note)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleSign(note.noteId)} className="p-1 text-purple-600 hover:bg-purple-50 rounded"><CheckCircle size={16} /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {notes.length === 0 && <div className="text-center py-8 text-gray-500">No clinical notes</div>}
        </div>
      </CommonCard>
    </>
  );
}