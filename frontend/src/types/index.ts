export type UserRole = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'ADMIN' | 'SUPERADMIN';

export type ProvenanceType = 
  | 'PATIENT_REPORTED'
  | 'DOCUMENT_EXTRACTED'
  | 'PHYSICIAN_CONFIRMED'
  | 'UNKNOWN'
  | 'NOT_ASKED'
  | 'PATIENT_UNSURE';

export interface Provenance {
  sourceType: ProvenanceType;
  sourceDocumentId?: string;
  sourceDocumentTitle?: string;
  sourceQuote?: string;
  confidence?: number;
  timestamp: string;
  verifiedBy?: string;
  isVerified: boolean;
}

export interface ClinicalFact<T = any> {
  value: T;
  provenance: Provenance;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  token?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  abhaId: string;
  uhid: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  preferredLanguage: string;
  consentGiven: boolean;
  consentTimestamp?: string;
  recordCompleteness: number;
  unresolvedCount: number;
}

export interface Encounter {
  id: string;
  patientId: string;
  tokenNumber: string;
  department: string;
  status: 'QUEUED' | 'INTAKE_IN_PROGRESS' | 'READY_FOR_CONSULTATION' | 'IN_CONSULTATION' | 'COMPLETED' | 'PRIORITY_ESCALATED';
  priority: 'ROUTINE' | 'YELLOW' | 'ORANGE' | 'RED';
  intakeStartTime: string;
  intakeCompletedTime?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  chiefComplaintSummary?: string;
  redFlagsDetected?: string[];
  intakeDurationSeconds?: number;
}

export interface StructuredHistory {
  encounterId: string;
  patientId: string;
  chiefComplaint: ClinicalFact<string>;
  historyOfPresentIllness: ClinicalFact<{
    onset: string;
    location: string;
    duration: string;
    character: string;
    severity: number;
    radiation: string;
    aggravatingFactors: string[];
    relievingFactors: string[];
    associatedSymptoms: string[];
  }>;
  pastMedicalHistory: ClinicalFact<string[]>;
  pastSurgicalHistory: ClinicalFact<string[]>;
  drugHistory: ClinicalFact<Array<{
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    provenance: Provenance;
  }>>;
  allergyHistory: ClinicalFact<Array<{
    allergen: string;
    reaction: string;
    severity: string;
    provenance: Provenance;
  }>>;
  familyHistory: ClinicalFact<string[]>;
  personalHistory: ClinicalFact<{
    diet: string;
    sleep: string;
    smoking: string;
    alcohol: string;
    physicalActivity: string;
  }>;
  reviewOfSystems: ClinicalFact<{
    respiratory?: string;
    cardiovascular?: string;
    gastrointestinal?: string;
    neurological?: string;
  }>;
  unresolvedQuestions: Array<{
    id: string;
    category: string;
    questionText: string;
    reason: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'RESOLVED';
  }>;
  contradictions: Array<{
    id: string;
    topic: string;
    pastRecordValue: string;
    currentInputValue: string;
    severity: 'HIGH' | 'MEDIUM';
    status: 'PENDING_PHYSICIAN_REVIEW' | 'RESOLVED';
    resolutionNote?: string;
  }>;
  physicianNotes?: string;
  isPhysicianConfirmed: boolean;
  confirmedAt?: string;
  confirmedBy?: string;
}

export interface DocumentRecord {
  id: string;
  patientId: string;
  encounterId?: string;
  title: string;
  docType: 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'RADIOLOGY' | 'OPD_SLIP';
  uploadedAt: string;
  facilityName: string;
  doctorName?: string;
  documentDate: string;
  fileUrl: string;
  status: 'PROCESSED' | 'NEEDS_REVIEW' | 'FLAGGED';
  ocrConfidence: number;
  extractions: {
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
      confidence: number;
      status: 'CONFIRMED' | 'PENDING' | 'REJECTED';
    }>;
    labValues?: Array<{
      testName: string;
      result: string;
      unit: string;
      referenceRange: string;
      isAbnormal: boolean;
      confidence: number;
      status: 'CONFIRMED' | 'PENDING' | 'REJECTED';
    }>;
    diagnoses?: string[];
  };
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  type: 'CONSULTATION' | 'MEDICATION' | 'LAB_REPORT' | 'PROCEDURE' | 'DOCUMENT';
  title: string;
  subtitle: string;
  facility: string;
  tags: string[];
  details?: Record<string, any>;
  sourceDocumentId?: string;
}

export interface TriageAlert {
  id: string;
  encounterId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  tokenNumber: string;
  priority: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  department: string;
  detectedAt: string;
  triggerSymptoms: string[];
  reason: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'RESOLVED';
  assignedStaff?: string;
  notes?: string;
}

export interface ClinicalQuestionOption {
  id: string;
  labelEn: string;
  labelHi: string;
  value: any;
  icon?: string;
  triggersRedFlag?: boolean;
}

export interface ClinicalQuestion {
  id: string;
  category: string;
  questionEn: string;
  questionHi: string;
  inputType: 'VOICE_AND_TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'NUMERIC_SCALE' | 'BOOLEAN';
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabelEn?: string;
  scaleMinLabelHi?: string;
  scaleMaxLabelEn?: string;
  scaleMaxLabelHi?: string;
  options?: ClinicalQuestionOption[];
  clinicalTargetField: string;
  required: boolean;
  canSkip: boolean;
}

export interface AyushAssessment {
  id: string;
  patientId: string;
  encounterId: string;
  prakriti: {
    vata: number;
    pitta: number;
    kapha: number;
    dominant: 'VATA' | 'PITTA' | 'KAPHA' | 'PITTA_VATA' | 'VATA_KAPHA' | 'TRIDOSHIC';
  };
  vikriti: string;
  agni: 'SAMA' | 'VISHAMA' | 'TIKSHNA' | 'MANDA' | string;
  koshtha: 'MRIDU' | 'MADHYAMA' | 'KRURA' | string;
  aharaShakti: string;
  vyayamaShakti: string;
  satmya: string;
  sattva: string;
  vaya: string;
  ahara: {
    rasaDominance: string[];
    regularity: string;
  };
  vihara: {
    sleepPattern: string;
    stressLevel: string;
  };
  nidana: string[];
  sampraptiSummary: string;
}

