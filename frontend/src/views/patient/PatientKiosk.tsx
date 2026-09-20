import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import { speechService } from '../../services/speech';
import { ClinicalQuestion, DocumentRecord, TimelineEvent } from '../../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  HeartPulse,
  Activity,
  ShieldCheck,
  Clock,
  ExternalLink,
  Edit3,
  XCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

export const PatientKiosk: React.FC = () => {
  const { patient, setPatient, encounter, setEncounter, selectedLanguage, setSelectedLanguage, setCurrentView } = useApp();

  // Mode tabs: 'HOME' | 'INTERVIEW' | 'DOCUMENTS' | 'TIMELINE' | 'ONBOARDING'
  const [activeTab, setActiveTab] = useState<'ONBOARDING' | 'HOME' | 'INTERVIEW' | 'DOCUMENTS' | 'TIMELINE'>('HOME');

  // Onboarding sub-steps: 1 = Identity, 2 = Language, 3 = Consent
  const [onboardStep, setOnboardStep] = useState<number>(1);
  const [idType, setIdType] = useState<'ABHA' | 'UHID' | 'MOBILE' | 'NEW'>('UHID');
  const [idValue, setIdValue] = useState<string>('UHID-2026-9812');
  const [isListeningConsent, setIsListeningConsent] = useState(false);

  // Interview state
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<ClinicalQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [severityValue, setSeverityValue] = useState<number>(7);
  const [redFlagHalted, setRedFlagHalted] = useState<any | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  // Document Upload & OCR state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStepText, setUploadStepText] = useState<string>('');
  const [scannedDocs, setScannedDocs] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  // Timeline events state
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [timelineFilter, setTimelineFilter] = useState<string>('ALL');

  useEffect(() => {
    loadDocuments();
    loadTimeline();
  }, [patient?.id]);

  const loadDocuments = async () => {
    try {
      const res = await api.request(`/documents/patient/${patient?.id || 'pat_ramesh_1'}`);
      if (res.success && res.documents) {
        setScannedDocs(res.documents);
        if (res.documents.length > 0) setSelectedDoc(res.documents[0]);
      }
    } catch (e) {
      console.warn('Doc load error:', e);
    }
  };

  const loadTimeline = async () => {
    try {
      const res = await api.getTimeline(patient?.id || 'pat_ramesh_1', timelineFilter);
      if (res.success && res.timeline) {
        setTimelineEvents(res.timeline);
      }
    } catch (e) {
      console.warn('Timeline load error:', e);
    }
  };

  // 1. Identity Submission
  const handleIdentify = async () => {
    try {
      const res = await api.identifyPatient({
        identifierType: idType,
        identifierValue: idValue,
      });
      if (res.success) {
        setPatient(res.patient);
        setEncounter(res.encounter);
        setOnboardStep(2); // Go to Language
      }
    } catch (e) {
      console.warn('Identify error:', e);
      setOnboardStep(2);
    }
  };

  // 2. Play Consent Audio
  const playConsentAudio = () => {
    setIsListeningConsent(true);
    const hindiConsent =
      'नमस्ते। चिकित्सारोध में आपकी स्वास्थ्य जानकारी केवल डॉक्टर के परामर्श को सुगम बनाने के लिए ली जा रही है। आप इसे किसी भी समय वापस ले सकते हैं।';
    const englishConsent =
      'Namaste. In ChikitsaBodha, your health information is collected solely to assist your physician in today consultation. You may withdraw consent at any time.';

    speechService.speak(
      selectedLanguage === 'hi' ? hindiConsent : englishConsent,
      selectedLanguage,
      () => setIsListeningConsent(false)
    );
  };

  // 3. Confirm Consent
  const handleConsentAgreement = async (agree: boolean) => {
    if (agree && patient) {
      await api.recordConsent(patient.id, true, isListeningConsent);
    }
    speechService.stopSpeaking();
    setActiveTab('HOME');
  };

  // 4. Start Voice Intake Interview
  const startIntakeInterview = async (startVoiceMic: boolean = false) => {
    setActiveTab('INTERVIEW');
    setRedFlagHalted(null);
    setInterviewComplete(false);

    try {
      // Initialize with chief complaint
      const prompt = selectedLanguage === 'hi'
        ? 'मेरे सीने में 2 दिन से भारी दर्द और सांस लेने में तकलीफ हो रही है।'
        : 'I have retrosternal chest discomfort and breathlessness for 2 days.';

      const res = await api.submitChiefComplaint(
        encounter?.id || 'enc_ramesh_1',
        patient?.id || 'pat_ramesh_1',
        prompt,
        selectedLanguage
      );

      if (res.success) {
        setCurrentQuestion(res.nextQuestion);
        if (startVoiceMic) {
          triggerVoiceInput();
        } else if (res.nextQuestion) {
          speakQuestion(res.nextQuestion);
        }
      }
    } catch (e) {
      console.warn('Start interview error:', e);
    }
  };

  const speakQuestion = (question: ClinicalQuestion) => {
    const text = selectedLanguage === 'hi' ? question.questionHi : question.questionEn;
    setIsSpeakingQuestion(true);
    speechService.speak(text, selectedLanguage, () => setIsSpeakingQuestion(false));
  };

  const triggerVoiceInput = () => {
    setIsRecording(true);
    speechService.listen(
      selectedLanguage,
      (transcript) => {
        setIsRecording(false);
        // Handle answer
        submitAnswer(transcript, false, false);
      },
      (err) => {
        setIsRecording(false);
        submitAnswer('Chest pain since 2 days', false, false);
      }
    );
  };

  const submitAnswer = async (value: any, skipped: boolean = false, unsure: boolean = false) => {
    if (!currentQuestion) return;

    speechService.stopSpeaking();

    const target = currentQuestion.clinicalTargetField;
    const updatedAnswers = { ...answers, [target]: value };
    setAnswers(updatedAnswers);

    try {
      const res = await api.answerQuestion({
        encounterId: encounter?.id || 'enc_ramesh_1',
        patientId: patient?.id || 'pat_ramesh_1',
        questionId: currentQuestion.id,
        targetField: target,
        answerValue: value,
        skipped,
        unsure,
      });

      if (res.success) {
        if (res.redFlagAssessment && res.redFlagAssessment.hasRedFlag && res.redFlagAssessment.shouldHaltIntake) {
          // RED FLAG SAFETY ENGINE TRIGGERED!
          setRedFlagHalted(res.redFlagAssessment);
          // Play supportive safety audio
          speechService.speak(
            selectedLanguage === 'hi' ? res.redFlagAssessment.patientGuidanceHi : res.redFlagAssessment.patientGuidanceEn,
            selectedLanguage
          );
          return;
        }

        if (res.nextQuestion) {
          setCurrentQuestion(res.nextQuestion);
          speakQuestion(res.nextQuestion);
        } else {
          setInterviewComplete(true);
        }
      }
    } catch (e) {
      console.warn('Submit answer error:', e);
      setInterviewComplete(true);
    }
  };

  // 5. Document Upload & OCR Simulation
  const handleUploadDocument = async (simType: 'RX' | 'LAB') => {
    setIsUploading(true);
    setUploadStepText('Quality Check: Assessing scan clarity & DPI...');

    setTimeout(() => {
      setUploadStepText('OCR Processing: Running Indian prescription engine...');
    }, 900);

    setTimeout(() => {
      setUploadStepText('Entity Extraction: Classifying clinical entities...');
    }, 1800);

    setTimeout(async () => {
      try {
        const res = await api.uploadAndOcrDocument({
          patientId: patient?.id || 'pat_ramesh_1',
          simulationType: simType,
          fileName: simType === 'LAB' ? 'Apollo_Diagnostics_Lipid_HbA1c.pdf' : 'District_Hospital_OPD_Prescription.pdf',
          fileType: simType === 'LAB' ? 'LAB_REPORT' : 'PRESCRIPTION',
        });

        if (res.success) {
          setScannedDocs((prev) => [res.document, ...prev]);
          setSelectedDoc(res.document);
          loadTimeline();
        }
      } catch (e) {
        console.warn('Doc upload error:', e);
      } finally {
        setIsUploading(false);
      }
    }, 2600);
  };

  // Action on Extraction: Confirm / Reject
  const handleExtractionAction = async (itemType: 'MEDICATION' | 'LAB', itemIndex: number, action: 'CONFIRM' | 'REJECT') => {
    if (!selectedDoc) return;
    try {
      const res = await api.actionExtraction(selectedDoc.id, {
        itemType,
        itemIndex,
        action,
      });
      if (res.success) {
        setSelectedDoc(res.document);
        setScannedDocs((prev) => prev.map((d) => (d.id === res.document.id ? res.document : d)));
      }
    } catch (e) {
      console.warn('Extraction action error:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Kiosk Patient Status Strip */}
      <div className="clinical-card p-4 sm:p-5 rounded-[24px] bg-white mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100/70 border border-cyan-200 flex items-center justify-center text-slate-800 font-bold text-base">
            {patient?.gender === 'FEMALE' ? '👩' : '👨'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg">{patient?.name || 'Ramesh Kumar'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {patient?.age || 52} Y / {patient?.gender || 'MALE'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-50 text-[#69C7DF] font-bold border border-cyan-200">
                UHID: {patient?.uhid || 'UHID-2026-9812'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Dept: <strong>{encounter?.department || 'General Medicine'}</strong></span>
              <span>•</span>
              <span>Token: <strong className="text-slate-800 font-bold">{encounter?.tokenNumber || 'G-124'}</strong></span>
              <span>•</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {encounter?.status === 'PRIORITY_ESCALATED' ? 'Priority Alert' : 'History in progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'HOME' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => startIntakeInterview(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'INTERVIEW' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#69C7DF]" />
            <span>Voice Intake</span>
          </button>
          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'DOCUMENTS' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#55C8B5]" />
            <span>Scan Docs</span>
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'TIMELINE' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#7867C8]" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setActiveTab('ONBOARDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 ${
              activeTab === 'ONBOARDING' ? 'bg-white shadow-xs text-slate-900' : ''
            }`}
            title="Re-run ID & Consent"
          >
            ID & Consent
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ONBOARDING (IDENTITY, LANGUAGE, CONSENT) */}
      {/* ========================================================================= */}
      {activeTab === 'ONBOARDING' && (
        <div className="max-w-2xl mx-auto">
          <div className="clinical-card p-8 bg-white rounded-[28px]">
            
            {/* Header Greeting */}
            <div className="text-center mb-8">
              <div className="text-3xl">Namaste 👋</div>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Let's understand your health story.</h2>
              <p className="text-slate-500 text-xs mt-1">
                Step {onboardStep} of 3: {onboardStep === 1 ? 'Patient Identification' : onboardStep === 2 ? 'Select Language' : 'Informed Consent'}
              </p>
            </div>

            {/* Step 1: Identification */}
            {onboardStep === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => setIdType('UHID')}
                    className={`py-2 rounded-xl font-semibold border ${idType === 'UHID' ? 'bg-cyan-50 border-[#69C7DF] text-slate-900' : 'border-slate-200 text-slate-600'}`}
                  >
                    Hospital UHID
                  </button>
                  <button
                    onClick={() => setIdType('ABHA')}
                    className={`py-2 rounded-xl font-semibold border ${idType === 'ABHA' ? 'bg-cyan-50 border-[#69C7DF] text-slate-900' : 'border-slate-200 text-slate-600'}`}
                  >
                    ABHA ID
                  </button>
                  <button
                    onClick={() => setIdType('MOBILE')}
                    className={`py-2 rounded-xl font-semibold border ${idType === 'MOBILE' ? 'bg-cyan-50 border-[#69C7DF] text-slate-900' : 'border-slate-200 text-slate-600'}`}
                  >
                    Mobile OTP
                  </button>
                  <button
                    onClick={() => setIdType('NEW')}
                    className={`py-2 rounded-xl font-semibold border ${idType === 'NEW' ? 'bg-cyan-50 border-[#69C7DF] text-slate-900' : 'border-slate-200 text-slate-600'}`}
                  >
                    New Patient
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {idType === 'UHID' ? 'Enter Hospital UHID / OPD Number' : idType === 'ABHA' ? 'Enter 14-Digit ABHA ID' : 'Enter Mobile Number'}
                  </label>
                  <input
                    type="text"
                    value={idValue}
                    onChange={(e) => setIdValue(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#69C7DF] outline-none"
                    placeholder="e.g. UHID-2026-9812 or 91-2834-8291-0021"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Aadhaar is not mandatory. You can use your mobile number, hospital slip, or register as a walk-in.
                  </p>
                </div>

                <button
                  onClick={handleIdentify}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-sm shadow-sm hover:shadow-md transition-all"
                >
                  Verify & Next: Language
                </button>
              </div>
            )}

            {/* Step 2: Language Selection */}
            {onboardStep === 2 && (
              <div>
                <div className="text-sm font-semibold text-slate-800 mb-3 text-center">
                  Choose your preferred conversational language:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
                    { code: 'en', label: 'English', sub: 'Indian English' },
                    { code: 'ta', label: 'தமிழ்', sub: 'Tamil' },
                    { code: 'te', label: 'తెలుగు', sub: 'Telugu' },
                    { code: 'mr', label: 'मराठी', sub: 'Marathi' },
                    { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
                    { code: 'gu', label: 'ગુજરાતી', sub: 'Gujarati' },
                    { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setSelectedLanguage(l.code)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        selectedLanguage === l.code
                          ? 'border-[#69C7DF] bg-cyan-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-lg text-slate-900">{l.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{l.sub}</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardStep(1)}
                    className="w-1/3 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardStep(3)}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-xs shadow-sm"
                  >
                    Confirm Language & Proceed
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Consent Screen */}
            {onboardStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/80 border border-slate-200/80 text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Pre-Consultation Consent Agreement</div>
                  <p>
                    <strong>Why information is collected:</strong> To prepare and organize your symptoms and previous medical documents before seeing the doctor.
                  </p>
                  <p>
                    <strong>Who accesses it:</strong> Only your treating doctor and authorized triage clinical staff at this hospital.
                  </p>
                  <p>
                    <strong>Clinical Safety:</strong> The AI summarizes facts but never diagnoses or prescribes. The physician remains in total control.
                  </p>
                  <p>
                    <strong>Withdrawal:</strong> You can withdraw consent anytime in the Privacy Center.
                  </p>
                </div>

                {/* Listen to explanation button */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-50/60 border border-cyan-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <Volume2 className="w-4 h-4 text-[#69C7DF]" />
                    <span>Listen to explanation in {selectedLanguage === 'hi' ? 'Hindi' : 'English'}</span>
                  </div>
                  <button
                    onClick={playConsentAudio}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#69C7DF] hover:bg-slate-50"
                  >
                    {isListeningConsent ? 'Playing...' : 'Play Explanation'}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleConsentAgreement(false)}
                    className="w-1/3 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleConsentAgreement(true)}
                    className="w-2/3 py-3 rounded-2xl bg-[#5BC58A] text-white font-bold text-xs shadow-md hover:bg-[#4eb37a] transition-all"
                  >
                    I Understand & Continue
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PATIENT HOME DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'HOME' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left 2-Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Action Card: "Tell us what is bothering you" */}
            <div className="clinical-card p-6 sm:p-8 bg-gradient-to-br from-white via-[#EEF3F6]/30 to-cyan-50/50 rounded-[28px] border border-cyan-100/90 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800">
                    Step 1: Clinical History
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    Tell us what is bothering you today
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-lg">
                    Speak naturally in Hindi or English. Our clinical engine will guide you through structured follow-up questions for the doctor.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#69C7DF]/20 text-[#69C7DF] flex items-center justify-center shrink-0">
                  <Mic className="w-6 h-6" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => startIntakeInterview(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 text-slate-950" />
                  <span>🎙 Start Talking</span>
                </button>

                <button
                  onClick={() => startIntakeInterview(false)}
                  className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm shadow-xs hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <span>Tap instead</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('DOCUMENTS')}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Upload Medical Records</span>
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Sample voice phrases you can try:
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                    "मेरे सीने में 2 दिन से दर्द है"
                  </span>
                  <span className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                    "I have chest discomfort and shortness of breath"
                  </span>
                  <span className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                    "पेट में तेज जलन और गैस की समस्या है"
                  </span>
                </div>
              </div>
            </div>

            {/* Health Summary & Recent Activity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* My Health Summary Card */}
              <div className="clinical-card p-5 bg-white rounded-[24px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-sm">My Health Summary</span>
                  <Activity className="w-4 h-4 text-[#69C7DF]" />
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Chief Complaint</span>
                    <span className="font-semibold text-slate-800">Chest discomfort (2 days)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Known Conditions</span>
                    <span className="font-semibold text-slate-800">Diabetes T2, Hypertension</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Active Medications</span>
                    <span className="font-semibold text-slate-800">Metformin 500mg, Amlodipine 5mg</span>
                  </div>
                </div>
              </div>

              {/* Recent Documents Card */}
              <div className="clinical-card p-5 bg-white rounded-[24px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-sm">Recent Documents</span>
                  <FileText className="w-4 h-4 text-[#55C8B5]" />
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  {scannedDocs.slice(0, 2).map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => { setSelectedDoc(doc); setActiveTab('DOCUMENTS'); }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-cyan-50/50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold text-slate-800 truncate">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">{doc.documentDate} • {doc.docType}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {doc.ocrConfidence}% OCR
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('DOCUMENTS')}
                    className="w-full text-center text-xs text-[#69C7DF] font-bold py-1 hover:underline"
                  >
                    View all ({scannedDocs.length}) documents →
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Sidebar: Completeness Gauge & Visit Info */}
          <div className="space-y-6">
            
            {/* Record Completeness Ring (NOT a fake medical score!) */}
            <div className="clinical-card p-6 bg-white rounded-[28px] text-center border border-slate-200/80">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Health Record Completeness
              </div>

              {/* Circular Gauge */}
              <div className="relative w-32 h-32 mx-auto my-3 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#progressGrad)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (patient?.recordCompleteness || 82) / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#69C7DF" />
                      <stop offset="100%" stopColor="#5BC58A" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">
                    {patient?.recordCompleteness || 82}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">Organized</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 px-2 leading-relaxed">
                Missing: <strong className="text-slate-800">Medication adherence verification</strong> for morning doses.
              </p>

              <button
                onClick={() => startIntakeInterview(false)}
                className="mt-4 w-full py-2.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-[#69C7DF] font-bold text-xs hover:bg-cyan-100 transition-all"
              >
                Complete Remaining Details
              </button>
            </div>

            {/* Visit Details Card */}
            <div className="clinical-card p-5 bg-white rounded-[24px]">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Today's OPD Appointment
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Consulting Doctor:</span>
                  <span className="font-semibold text-slate-800">Dr. Arvind Sharma, MD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room / Clinic:</span>
                  <span className="font-semibold text-slate-800">Room #12 (OPD Ground Floor)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Queue Position:</span>
                  <span className="font-bold text-cyan-600">3 patients ahead</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VOICE & TOUCH CONVERSATIONAL CLINICAL INTERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'INTERVIEW' && (
        <div className="max-w-3xl mx-auto">
          
          {/* Red Flag Escalation Banner if detected */}
          {redFlagHalted ? (
            <div className="clinical-card p-8 bg-red-50/90 border-2 border-red-300 rounded-[28px] shadow-lg animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 animate-alert-pulse">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-200 text-red-900 uppercase tracking-wider">
                    Immediate Clinical Triage Alert
                  </span>
                  <h2 className="text-2xl font-black text-red-950 mt-2">
                    {selectedLanguage === 'hi' ? redFlagHalted.urgencyTitleHi : redFlagHalted.urgencyTitleEn}
                  </h2>
                  <p className="text-red-900 text-sm mt-2 leading-relaxed font-medium">
                    {selectedLanguage === 'hi' ? redFlagHalted.patientGuidanceHi : redFlagHalted.patientGuidanceEn}
                  </p>

                  <div className="mt-4 p-3.5 bg-white/90 rounded-2xl border border-red-200 text-xs text-slate-700">
                    <strong className="text-red-800">Detected Indicators:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                      {redFlagHalted.detectedSymptoms.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setCurrentView('triage-center')}
                      className="px-5 py-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-700"
                    >
                      View Staff Triage Dispatch
                    </button>
                    <button
                      onClick={() => setRedFlagHalted(null)}
                      className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs"
                    >
                      Continue Intake Anyway
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : interviewComplete ? (
            /* Interview Completed State */
            <div className="clinical-card p-8 bg-white rounded-[28px] text-center shadow-soft">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#5BC58A] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Pre-Consultation Story Prepared!</h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                Your medical story, symptoms, and previous prescriptions have been organized for Dr. Arvind Sharma.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('HOME')}
                  className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('physician-dashboard')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-xs shadow-md"
                >
                  Inspect Doctor's 30s View →
                </button>
              </div>
            </div>
          ) : currentQuestion ? (
            /* Active Conversational Question Card */
            <div className="clinical-card p-6 sm:p-8 bg-white rounded-[28px] shadow-soft border border-slate-200/80">
              
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                  {currentQuestion.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakQuestion(currentQuestion)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1 font-medium"
                    title="Repeat question audio"
                  >
                    <Volume2 className="w-4 h-4 text-[#69C7DF]" />
                    <span>Repeat Voice</span>
                  </button>
                </div>
              </div>

              {/* The Question Text in Hindi & English */}
              <div className="my-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  {selectedLanguage === 'hi' ? currentQuestion.questionHi : currentQuestion.questionEn}
                </h3>
                {selectedLanguage === 'hi' && (
                  <p className="text-xs text-slate-400 mt-1 font-normal italic">
                    {currentQuestion.questionEn}
                  </p>
                )}
              </div>

              {/* Dynamic Interactive Input Section */}
              <div className="mt-6">
                
                {/* 1. SINGLE_CHOICE or MULTIPLE_CHOICE Buttons */}
                {currentQuestion.options && currentQuestion.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => submitAnswer(opt.value, false, false)}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-[#69C7DF] hover:bg-cyan-50/40 text-left transition-all group flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm group-hover:text-cyan-900">
                            {selectedLanguage === 'hi' ? opt.labelHi : opt.labelEn}
                          </div>
                          {selectedLanguage === 'hi' && (
                            <div className="text-[11px] text-slate-400 mt-0.5">{opt.labelEn}</div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#69C7DF] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. NUMERIC_SCALE (e.g. 0 to 10 Pain Scale) */}
                {currentQuestion.inputType === 'NUMERIC_SCALE' && (
                  <div className="py-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                      <span>{currentQuestion.scaleMinLabelEn}</span>
                      <span className="text-lg font-black text-[#69C7DF]">{severityValue} / 10</span>
                      <span>{currentQuestion.scaleMaxLabelEn}</span>
                    </div>

                    <input
                      type="range"
                      min={currentQuestion.scaleMin || 0}
                      max={currentQuestion.scaleMax || 10}
                      value={severityValue}
                      onChange={(e) => setSeverityValue(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#69C7DF]"
                    />

                    <div className="flex justify-between mt-4">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSeverityValue(num)}
                          className={`w-8 h-8 rounded-xl font-bold text-xs ${
                            severityValue === num
                              ? 'bg-gradient-to-tr from-[#69C7DF] to-[#55C8B5] text-slate-950 shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => submitAnswer(severityValue, false, false)}
                      className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-sm shadow-sm"
                    >
                      Confirm Severity ({severityValue}/10)
                    </button>
                  </div>
                )}

                {/* 3. VOICE_AND_TEXT Input with active Waveform */}
                {currentQuestion.inputType === 'VOICE_AND_TEXT' && (
                  <div className="text-center py-6">
                    {/* Animated Mic Waveform Button */}
                    <button
                      onClick={triggerVoiceInput}
                      className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${
                        isRecording
                          ? 'bg-red-500 text-white shadow-xl scale-110 animate-pulse'
                          : 'bg-gradient-to-tr from-[#69C7DF] to-[#55C8B5] text-slate-950 shadow-md hover:scale-105'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                    </button>

                    {/* Waveform Bars */}
                    {isRecording && (
                      <div className="flex items-center justify-center gap-1.5 h-10 mt-4">
                        <span className="w-1.5 bg-[#69C7DF] rounded-full animate-wave-1"></span>
                        <span className="w-1.5 bg-[#55C8B5] rounded-full animate-wave-2"></span>
                        <span className="w-1.5 bg-[#7867C8] rounded-full animate-wave-3"></span>
                        <span className="w-1.5 bg-[#5BC58A] rounded-full animate-wave-4"></span>
                        <span className="w-1.5 bg-[#69C7DF] rounded-full animate-wave-5"></span>
                      </div>
                    )}

                    <div className="text-xs font-semibold text-slate-700 mt-3">
                      {isRecording ? 'Listening... Speak your answer now' : 'Tap mic to speak your response'}
                    </div>

                    {/* Quick Answer Buttons */}
                    {currentQuestion.options && (
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {currentQuestion.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => submitAnswer(opt.value, false, false)}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                          >
                            {selectedLanguage === 'hi' ? opt.labelHi : opt.labelEn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Bottom Navigation Utilities: Skip, Not Sure, Go Back */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => submitAnswer('Patient unsure', false, true)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  Not sure
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => submitAnswer('Skipped by patient', true, false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Exit to Home
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12">
              <button
                onClick={() => startIntakeInterview(false)}
                className="px-6 py-3 rounded-2xl bg-[#69C7DF] text-slate-950 font-bold text-xs"
              >
                Restart Interview
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MEDICAL DOCUMENT SCANNER & OCR EXTRACTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'DOCUMENTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Upload & Document List */}
          <div className="space-y-6">
            
            {/* Upload Zone */}
            <div className="clinical-card p-6 bg-white rounded-[28px] text-center border-dashed border-2 border-slate-300">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100/60 text-[#69C7DF] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Upload Medical Documents</h3>
              <p className="text-slate-500 text-xs mt-1">
                Scan prescriptions, blood reports, or discharge summaries.
              </p>

              {/* Upload Progress Loader */}
              {isUploading ? (
                <div className="mt-4 p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs">
                  <div className="w-6 h-6 border-2 border-[#69C7DF] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <div className="font-bold text-slate-800">{uploadStepText}</div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleUploadDocument('RX')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-xs shadow-xs hover:scale-102 transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Scan Prescription (OCR)</span>
                  </button>
                  <button
                    onClick={() => handleUploadDocument('LAB')}
                    className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Scan Blood Test Report</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scanned Documents List */}
            <div className="clinical-card p-5 bg-white rounded-[24px]">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Scanned Files ({scannedDocs.length})
              </div>
              <div className="space-y-2.5">
                {scannedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedDoc?.id === doc.id
                        ? 'border-[#69C7DF] bg-cyan-50/50 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 font-bold text-slate-700">
                        {doc.docType}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {doc.ocrConfidence}% Confidence
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1.5 truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{doc.facilityName} • {doc.documentDate}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: OCR Extraction Details with Confirm/Reject Actions */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <div className="clinical-card p-6 sm:p-8 bg-white rounded-[28px] shadow-soft">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800">
                      {selectedDoc.docType}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedDoc.title}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Facility: <strong>{selectedDoc.facilityName}</strong> • Date: <strong>{selectedDoc.documentDate}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-400">OCR Reliability</div>
                    <div className="text-lg font-black text-emerald-600">{selectedDoc.ocrConfidence}% High</div>
                  </div>
                </div>

                {/* Important Medical UX Rule Banner */}
                <div className="my-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Human-in-the-loop:</strong> Uncertain OCR is never automatically applied. Please verify or edit any medications below.
                  </span>
                </div>

                {/* 1. Extracted Medications */}
                {selectedDoc.extractions.medications && selectedDoc.extractions.medications.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                      Extracted Medications
                    </div>
                    <div className="space-y-3">
                      {selectedDoc.extractions.medications.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{med.name}</div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              Dosage: <strong className="text-slate-800">{med.dosage}</strong> • Frequency: {med.frequency}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              OCR Confidence: {med.confidence}% • Status: <strong className="text-cyan-700">{med.status}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {med.status === 'CONFIRMED' ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Confirmed
                              </span>
                            ) : med.status === 'REJECTED' ? (
                              <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                                <XCircle className="w-4 h-4" /> Rejected
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleExtractionAction('MEDICATION', idx, 'CONFIRM')}
                                  className="px-3 py-1.5 rounded-xl bg-[#5BC58A] text-white font-bold text-xs shadow-xs hover:bg-emerald-600"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleExtractionAction('MEDICATION', idx, 'REJECT')}
                                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-red-500 font-semibold text-xs hover:bg-red-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Extracted Lab Values */}
                {selectedDoc.extractions.labValues && selectedDoc.extractions.labValues.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                      Extracted Laboratory Parameters
                    </div>
                    <div className="space-y-3">
                      {selectedDoc.extractions.labValues.map((lab, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{lab.testName}</span>
                              {lab.isAbnormal && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                                  Abnormal
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              Result: <strong className="text-slate-900 text-sm">{lab.result} {lab.unit}</strong>
                              <span className="text-slate-400 text-[11px] ml-2">({lab.referenceRange})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleExtractionAction('LAB', idx, 'CONFIRM')}
                              className="px-3 py-1.5 rounded-xl bg-[#5BC58A] text-white font-bold text-xs"
                            >
                              Verified
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="clinical-card p-12 bg-white rounded-[28px] text-center text-slate-400">
                Select a document to inspect OCR extraction.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MEDICAL TIMELINE */}
      {/* ========================================================================= */}
      {activeTab === 'TIMELINE' && (
        <div className="max-w-3xl mx-auto">
          <div className="clinical-card p-6 sm:p-8 bg-white rounded-[28px] shadow-soft">
            
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Longitudinal Medical Timeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organized chronological health events linked back to original records.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-xs">
                {['ALL', 'CONSULTATION', 'MEDICATION', 'LAB_REPORT'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setTimelineFilter(f);
                      loadTimeline();
                    }}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                      timelineFilter === f
                        ? 'bg-[#69C7DF] text-slate-950 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'ALL' ? 'All Events' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="mt-8 relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="relative group">
                  
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#69C7DF] group-hover:scale-125 transition-transform shadow-xs"></div>

                  <div className="p-4 rounded-2xl bg-[#EEF3F6]/50 border border-slate-200/80 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">{evt.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                        {evt.type}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-1">{evt.title}</div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.subtitle}</div>
                    <div className="text-[11px] text-slate-400 mt-2">Facility: {evt.facility}</div>

                    {/* Source Evidence Link */}
                    {evt.sourceDocumentId && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-cyan-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Traceable to Scanned Record</span>
                        </span>
                        <button
                          onClick={() => {
                            const matched = scannedDocs.find((d) => d.id === evt.sourceDocumentId);
                            if (matched) {
                              setSelectedDoc(matched);
                              setActiveTab('DOCUMENTS');
                            }
                          }}
                          className="font-bold text-[#69C7DF] hover:underline"
                        >
                          View Document Evidence →
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
