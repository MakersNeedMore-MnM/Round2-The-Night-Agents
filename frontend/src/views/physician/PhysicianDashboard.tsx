import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import { Encounter, Patient, StructuredHistory, DocumentRecord, TimelineEvent } from '../../types';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  User,
  ChevronRight,
  ExternalLink,
  Edit2,
  Check,
  X,
  MessageSquare,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export const PhysicianDashboard: React.FC = () => {
  const { user, setCurrentView } = useApp();

  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalToday: 4, readyCount: 4, priorityCount: 1, incompleteCount: 0 });
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>('enc_ramesh_1');

  // Selected encounter clinical data
  const [patient, setPatient] = useState<Patient | null>(null);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [history, setHistory] = useState<StructuredHistory | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Doctor action states
  const [physicianNote, setPhysicianNote] = useState<string>('');
  const [isFinalized, setIsFinalized] = useState(false);
  const [fhirJsonModal, setFhirJsonModal] = useState<any | null>(null);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [activeClarificationText, setActiveClarificationText] = useState('');

  useEffect(() => {
    loadQueue();
    loadEncounterSummary(selectedEncounterId);
  }, []);

  const loadQueue = async () => {
    try {
      const res = await api.getPhysicianQueue();
      if (res.success) {
        setQueue(res.queue);
        setStats(res.stats);
      }
    } catch (e) {
      console.warn('Queue load error:', e);
    }
  };

  const loadEncounterSummary = async (encId: string) => {
    setLoading(true);
    try {
      const res = await api.get30SecSummary(encId);
      if (res.success) {
        setPatient(res.patient);
        setEncounter(res.encounter);
        setHistory(res.history);
        setDocuments(res.documents);
        setTimeline(res.timeline);
        setIsFinalized(res.encounter.status === 'COMPLETED');
      }
    } catch (e) {
      console.warn('Summary load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (encId: string) => {
    setSelectedEncounterId(encId);
    loadEncounterSummary(encId);
  };

  const handleConfirmFact = async (fieldPath: string) => {
    try {
      const res = await api.confirmClinicalFact(selectedEncounterId, {
        fieldPath,
        action: 'CONFIRM',
      });
      if (res.success) {
        setHistory(res.history);
      }
    } catch (e) {
      console.warn('Confirm fact error:', e);
    }
  };

  const handleResolveItem = async (itemId: string, itemType: 'CONTRADICTION' | 'UNRESOLVED') => {
    try {
      const res = await api.resolvePhysicianItem(selectedEncounterId, {
        itemId,
        itemType,
        resolutionNote: 'Physician verbally verified with patient during bedside consultation.',
      });
      if (res.success) {
        setHistory(res.history);
      }
    } catch (e) {
      console.warn('Resolve error:', e);
    }
  };

  const handleFinalizeRecord = async () => {
    try {
      const res = await api.finalizeEncounter(selectedEncounterId, physicianNote);
      if (res.success) {
        setIsFinalized(true);
        setEncounter(res.encounter);
        setHistory(res.history);
        setFhirJsonModal(res.fhirBundle);
      }
    } catch (e) {
      console.warn('Finalize error:', e);
    }
  };

  const handleViewFhirBundle = async () => {
    try {
      const res = await api.getFhirBundle(selectedEncounterId);
      if (res.success) {
        setFhirJsonModal(res.fhirBundle);
      }
    } catch (e) {
      console.warn('FHIR fetch error:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Doctor Profile & Stats Bar */}
      <div className="clinical-card p-5 bg-white rounded-[24px] mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-[#69C7DF] flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">{user.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-50 text-[#69C7DF] font-bold border border-cyan-200">
                {user.department || 'General Medicine'}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              OPD Clinic #12 • Consultation Active
            </div>
          </div>
        </div>

        {/* Quick OPD Queue Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="font-bold text-slate-900">{stats.totalToday}</div>
            <div className="text-[10px] text-slate-400">Total Today</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="font-bold text-emerald-700">{stats.readyCount}</div>
            <div className="text-[10px] text-emerald-600">Ready 30s Briefs</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-center">
            <div className="font-bold text-red-700">{stats.priorityCount}</div>
            <div className="text-[10px] text-red-600">Priority Triage</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Patient Queue, Right 30-Second Clinical Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 1-Column: Patient Queue List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Queue</span>
            <span className="text-xs text-slate-500 font-medium">{queue.length} in OPD</span>
          </div>

          <div className="space-y-2.5">
            {queue.map((enc) => {
              const isSelected = selectedEncounterId === enc.id;
              const isRed = enc.priority === 'RED';
              return (
                <div
                  key={enc.id}
                  onClick={() => handleSelectPatient(enc.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#69C7DF] shadow-md ring-2 ring-[#69C7DF]/20'
                      : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{enc.tokenNumber}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isRed
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : enc.priority === 'YELLOW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {enc.priority === 'RED' ? '⚠ Urgent' : enc.priority}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm mt-1">{enc.patient?.name || 'Patient'}</div>
                  <div className="text-[11px] text-slate-500">
                    {enc.patient?.age} Y / {enc.patient?.gender} • {enc.department}
                  </div>

                  <div className="mt-2 text-[11px] text-slate-600 line-clamp-1 italic">
                    "{enc.chiefComplaintSummary || 'Pre-intake in progress'}"
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Intake: {enc.intakeDurationSeconds ? `${Math.round(enc.intakeDurationSeconds / 60)}m` : 'Active'}</span>
                    <span className="text-[#69C7DF] font-semibold flex items-center gap-0.5">
                      Open Brief <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 3-Columns: The 30-Second Clinical Understanding Dashboard */}
        <div className="lg:col-span-3 space-y-6">
          
          {loading ? (
            <div className="clinical-card p-16 text-center text-slate-400 bg-white rounded-[28px]">
              <div className="w-8 h-8 border-2 border-[#69C7DF] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Loading 30-Second Clinical Story...
            </div>
          ) : history && patient ? (
            <div className="clinical-card p-6 sm:p-8 bg-white rounded-[28px] shadow-soft border border-slate-200/90">
              
              {/* Top Mandatory Disclaimer Banner */}
              <div className="p-3 rounded-2xl bg-cyan-50/80 border border-cyan-200 flex flex-wrap items-center justify-between gap-2 text-xs mb-6">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#69C7DF]" />
                  <span>AI-generated pre-consultation draft — physician verification required.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleViewFhirBundle}
                    className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 text-[11px]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#69C7DF]" />
                    <span>Inspect ABDM FHIR</span>
                  </button>
                  {isFinalized && (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Finalized
                    </span>
                  )}
                </div>
              </div>

              {/* PATIENT BRIEF HEADER */}
              <div className="flex flex-wrap items-center justify-between pb-5 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                      {patient.age} Y / {patient.gender}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                      {encounter?.tokenNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
                    <span>UHID: <strong>{patient.uhid}</strong></span>
                    <span>•</span>
                    <span>ABHA: <strong>{patient.abhaId}</strong></span>
                    <span>•</span>
                    <span>Blood Group: <strong>{patient.bloodGroup}</strong></span>
                    <span>•</span>
                    <span>Language: <strong>Hindi</strong></span>
                  </div>
                </div>

                {/* Priority Badge */}
                <div>
                  {encounter?.priority === 'RED' ? (
                    <div className="px-4 py-2 rounded-2xl bg-red-100 border border-red-300 text-red-800 font-bold text-xs flex items-center gap-2 animate-alert-pulse">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Priority: High (Red Flag Triggered)</span>
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      Priority: Routine
                    </div>
                  )}
                </div>
              </div>

              {/* 1. CRITICAL: UNRESOLVED QUESTIONS ("BEFORE CONSULTATION" ALERT CARD) */}
              {history.unresolvedQuestions && history.unresolvedQuestions.some((q) => q.status === 'OPEN') && (
                <div className="my-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Before Consultation: Action Required</span>
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium">Unresolved Items</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-800">
                    {history.unresolvedQuestions.filter((q) => q.status === 'OPEN').map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-white border border-amber-100 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">⚠ {item.questionText}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.reason}</div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveClarificationText(item.questionText);
                            setShowClarificationModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shrink-0"
                        >
                          Ask Patient
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. CRITICAL: CONTRADICTION ENGINE ALERT */}
              {history.contradictions && history.contradictions.some((c) => c.status === 'PENDING_PHYSICIAN_REVIEW') && (
                <div className="my-5 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-red-900 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>⚠ Record Conflict Detected — Physician Verification Required</span>
                  </div>
                  {history.contradictions.filter((c) => c.status === 'PENDING_PHYSICIAN_REVIEW').map((conflict) => (
                    <div key={conflict.id} className="p-3 bg-white rounded-xl border border-red-100 text-xs space-y-1.5">
                      <div className="font-bold text-slate-900">{conflict.topic}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-1">
                        <div className="p-2 rounded-lg bg-red-50 text-red-900">
                          <strong>Previous Record:</strong> {conflict.pastRecordValue}
                        </div>
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                          <strong>Current Intake:</strong> {conflict.currentInputValue}
                        </div>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleResolveItem(conflict.id, 'CONTRADICTION')}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                        >
                          Physician Verified & Clarified
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. STRUCTURED CLINICAL SECTIONS WITH PROVENANCE BADGES */}
              <div className="mt-6 space-y-6">
                
                {/* Chief Complaint */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Chief Complaint
                    </span>
                    {/* Provenance Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold">
                        Source: Patient Voice ({history.chiefComplaint.provenance.confidence}%)
                      </span>
                      <button
                        onClick={() => handleConfirmFact('chiefComplaint')}
                        className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                          history.chiefComplaint.provenance.isVerified
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                        }`}
                      >
                        {history.chiefComplaint.provenance.isVerified ? '✓ Verified' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    {history.chiefComplaint.value}
                  </div>
                  {history.chiefComplaint.provenance.sourceQuote && (
                    <div className="text-xs text-slate-500 italic mt-1">
                      Patient quote: "{history.chiefComplaint.provenance.sourceQuote}"
                    </div>
                  )}
                </div>

                {/* History of Present Illness (HPI) */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      History of Present Illness (HPI)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold">
                      Source: Patient Voice
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Onset & Duration</span>
                      <strong className="text-slate-900">{history.historyOfPresentIllness.value.onset}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Character & Location</span>
                      <strong className="text-slate-900">{history.historyOfPresentIllness.value.character}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Severity (VAS)</span>
                      <strong className="text-red-600 font-black text-sm">{history.historyOfPresentIllness.value.severity} / 10</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100 sm:col-span-2">
                      <span className="text-slate-400 block text-[10px]">Radiation</span>
                      <strong className="text-slate-900">{history.historyOfPresentIllness.value.radiation}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Relieving Factors</span>
                      <strong className="text-slate-900">{history.historyOfPresentIllness.value.relievingFactors.join(', ')}</strong>
                    </div>
                  </div>

                  {/* Associated Symptoms Flag */}
                  <div className="mt-3 p-2.5 rounded-xl bg-red-50/70 border border-red-100 text-xs">
                    <strong className="text-red-900">Associated Symptoms Reported:</strong>
                    <div className="text-red-800 mt-0.5 font-medium">
                      {history.historyOfPresentIllness.value.associatedSymptoms.join(' • ')}
                    </div>
                  </div>
                </div>

                {/* Drug History & Scanned Prescriptions */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Drug History & Regular Medications
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Source: Prescription OCR (96% Confidence)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {history.drugHistory.value.map((drug, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{drug.name} {drug.dosage}</span>
                          <span className="text-slate-500 ml-2">({drug.frequency} - {drug.timing})</span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Extracted from: District Hospital OPD Prescription (12 Aug 2026)
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">Active</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Medical History & Lab Findings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Past Medical History
                    </div>
                    <ul className="text-xs text-slate-800 space-y-1.5 list-disc list-inside">
                      {history.pastMedicalHistory.value.map((cond, idx) => (
                        <li key={idx}>{cond}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Recent Lab Highlights
                    </div>
                    <div className="text-xs text-slate-800 space-y-1">
                      <div>HbA1c: <strong className="text-red-600">7.8% (Elevated)</strong></div>
                      <div>Creatinine: <strong className="text-amber-600">1.4 mg/dL (Borderline)</strong></div>
                      <div>Hemoglobin: <strong className="text-amber-600">9.8 g/dL (Mild Anemia)</strong></div>
                    </div>
                  </div>
                </div>

                {/* Interactive Timeline Preview */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Patient Longitudinal Timeline
                  </div>
                  <div className="space-y-2">
                    {timeline.slice(0, 3).map((tl) => (
                      <div key={tl.id} className="p-2.5 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 font-semibold mr-2">{tl.date}</span>
                          <strong className="text-slate-800">{tl.title}</strong>
                          <span className="text-slate-500 text-[11px] block">{tl.subtitle}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {tl.facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 4. DOCTOR ACTION BAR & FINALIZATION */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Add Physician Consultation Note:
                  </label>
                  <textarea
                    rows={2}
                    value={physicianNote}
                    onChange={(e) => setPhysicianNote(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#69C7DF] outline-none"
                    placeholder="Enter clinical assessment, differential diagnosis, or prescription orders here..."
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmFact('chiefComplaint')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
                    >
                      Confirm All Intake
                    </button>
                    <button
                      onClick={() => {
                        setActiveClarificationText('Clarify symptom radiation to jaw or epigastrium.');
                        setShowClarificationModal(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Request Clarification</span>
                    </button>
                  </div>

                  <button
                    onClick={handleFinalizeRecord}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Finalize Record & Export ABDM FHIR</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="clinical-card p-16 text-center text-slate-400 bg-white rounded-[28px]">
              Select a patient from the queue to view their pre-consultation clinical story.
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: ABDM FHIR Bundle JSON Viewer */}
      {fhirJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clinical-card p-6 bg-white rounded-[28px] max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">ABDM / FHIR R4 Clinical Bundle</h3>
                <p className="text-[11px] text-slate-500">
                  Ready for Ayushman Bharat Digital Mission (ABDM) Health Information Exchange
                </p>
              </div>
              <button
                onClick={() => setFhirJsonModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 overflow-y-auto p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-2xl flex-1">
              <pre>{JSON.stringify(fhirJsonModal, null, 2)}</pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Profile: ClinicalArtifactBundle (NRCeS compliant)</span>
              <button
                onClick={() => setFhirJsonModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Request Patient Clarification Flow */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clinical-card p-6 bg-white rounded-[28px] max-w-md w-full shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Request Clarification from Patient</h3>
            <p className="text-xs text-slate-500 mt-1">
              Dispatches a fast 1-tap question back to the patient kiosk or mobile device:
            </p>

            <div className="my-4 p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs font-semibold text-slate-800">
              "{activeClarificationText}"
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowClarificationModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowClarificationModal(false);
                  alert('Clarification prompt queued to Patient Kiosk #3.');
                }}
                className="w-1/2 py-2.5 rounded-xl bg-[#69C7DF] text-slate-950 font-bold text-xs"
              >
                Send to Patient
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
