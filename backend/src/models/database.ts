import {
  User,
  Patient,
  Encounter,
  StructuredHistory,
  DocumentRecord,
  TimelineEvent,
  TriageAlert,
  AuditLog,
  AyushAssessment,
} from '../types';

export class InMemoryDatabase {
  users: User[] = [];
  patients: Patient[] = [];
  encounters: Encounter[] = [];
  histories: Record<string, StructuredHistory> = {};
  documents: DocumentRecord[] = [];
  timelineEvents: TimelineEvent[] = [];
  triageAlerts: TriageAlert[] = [];
  auditLogs: AuditLog[] = [];
  notifications: Array<{
    id: string;
    targetRole: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority: 'RED' | 'YELLOW' | 'BLUE';
    link?: string;
  }> = [];
  ayushAssessments: AyushAssessment[] = [];

  constructor() {
    this.seedAll();
  }

  private seedAll() {
    // 1. Seed Users
    this.users = [
      {
        id: 'usr_doc_1',
        email: 'doctor@chikitsabodha.demo',
        name: 'Dr. Arvind Sharma, MD',
        role: 'DOCTOR',
        department: 'General Medicine',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98101 23456',
      },
      {
        id: 'usr_adm_1',
        email: 'admin@chikitsabodha.demo',
        name: 'Rajesh Nair',
        role: 'ADMIN',
        department: 'Hospital Administration & OPD Command',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98202 34567',
      },
      {
        id: 'usr_pat_1',
        email: 'patient@chikitsabodha.demo',
        name: 'Ramesh Kumar',
        role: 'PATIENT',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98765 43210',
      },
      {
        id: 'usr_nur_1',
        email: 'nurse@chikitsabodha.demo',
        name: 'Sister Deepa Verma',
        role: 'NURSE',
        department: 'Emergency & OPD Triage Desk',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813576-90f77ea6bbfe?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98303 45678',
      },
    ];

    // 2. Seed Patients
    this.patients = [
      {
        id: 'pat_ramesh_1',
        abhaId: '91-2834-8291-0021',
        uhid: 'UHID-2026-9812',
        name: 'Ramesh Kumar',
        age: 52,
        gender: 'MALE',
        phone: '+91 98765 43210',
        bloodGroup: 'B+',
        emergencyContact: {
          name: 'Sunita Kumar',
          relation: 'Spouse',
          phone: '+91 98765 43211',
        },
        preferredLanguage: 'hi',
        consentGiven: true,
        consentTimestamp: '2026-09-20T09:15:00.000Z',
        recordCompleteness: 82,
        unresolvedCount: 2,
      },
      {
        id: 'pat_sunita_2',
        abhaId: '91-4821-3910-4492',
        uhid: 'UHID-2026-9815',
        name: 'Sunita Devi',
        age: 45,
        gender: 'FEMALE',
        phone: '+91 98234 56789',
        bloodGroup: 'O+',
        emergencyContact: {
          name: 'Manoj Devi',
          relation: 'Brother',
          phone: '+91 98234 56780',
        },
        preferredLanguage: 'hi',
        consentGiven: true,
        consentTimestamp: '2026-09-20T09:30:00.000Z',
        recordCompleteness: 90,
        unresolvedCount: 0,
      },
      {
        id: 'pat_vikram_3',
        abhaId: '91-1092-4821-3310',
        uhid: 'UHID-2026-9820',
        name: 'Vikram Patel',
        age: 61,
        gender: 'MALE',
        phone: '+91 98901 23456',
        bloodGroup: 'A+',
        emergencyContact: {
          name: 'Aakash Patel',
          relation: 'Son',
          phone: '+91 98901 23457',
        },
        preferredLanguage: 'en',
        consentGiven: true,
        consentTimestamp: '2026-09-20T10:00:00.000Z',
        recordCompleteness: 88,
        unresolvedCount: 1,
      },
      {
        id: 'pat_priya_4',
        abhaId: '91-7712-4829-9901',
        uhid: 'UHID-2026-9833',
        name: 'Priya Sharma',
        age: 28,
        gender: 'FEMALE',
        phone: '+91 97112 34567',
        bloodGroup: 'AB+',
        emergencyContact: {
          name: 'Rohit Sharma',
          relation: 'Spouse',
          phone: '+91 97112 34568',
        },
        preferredLanguage: 'hi',
        consentGiven: true,
        consentTimestamp: '2026-09-20T10:15:00.000Z',
        recordCompleteness: 94,
        unresolvedCount: 0,
      }
    ];

    // 3. Seed Encounters
    this.encounters = [
      {
        id: 'enc_ramesh_1',
        patientId: 'pat_ramesh_1',
        tokenNumber: 'G-124',
        department: 'General Medicine',
        status: 'READY_FOR_CONSULTATION',
        priority: 'RED',
        intakeStartTime: '2026-09-20T09:20:00.000Z',
        intakeCompletedTime: '2026-09-20T09:26:00.000Z',
        assignedDoctorId: 'usr_doc_1',
        assignedDoctorName: 'Dr. Arvind Sharma, MD',
        chiefComplaintSummary: 'Retrosternal chest pain for 2 days radiating to left arm with breathlessness',
        redFlagsDetected: ['Chest pain with dyspnea', 'Radiation to left arm'],
        intakeDurationSeconds: 360,
      },
      {
        id: 'enc_sunita_2',
        patientId: 'pat_sunita_2',
        tokenNumber: 'C-042',
        department: 'Cardiology',
        status: 'READY_FOR_CONSULTATION',
        priority: 'YELLOW',
        intakeStartTime: '2026-09-20T09:35:00.000Z',
        intakeCompletedTime: '2026-09-20T09:41:00.000Z',
        assignedDoctorId: 'usr_doc_1',
        assignedDoctorName: 'Dr. Arvind Sharma, MD',
        chiefComplaintSummary: 'Intermittent palpitations and fatigue for 3 weeks',
        intakeDurationSeconds: 320,
      },
      {
        id: 'enc_vikram_3',
        patientId: 'pat_vikram_3',
        tokenNumber: 'O-018',
        department: 'Orthopedics',
        status: 'READY_FOR_CONSULTATION',
        priority: 'ROUTINE',
        intakeStartTime: '2026-09-20T10:05:00.000Z',
        intakeCompletedTime: '2026-09-20T10:10:00.000Z',
        assignedDoctorId: 'usr_doc_1',
        assignedDoctorName: 'Dr. Arvind Sharma, MD',
        chiefComplaintSummary: 'Bilateral knee stiffness and difficulty climbing stairs for 6 months',
        intakeDurationSeconds: 290,
      },
      {
        id: 'enc_priya_4',
        patientId: 'pat_priya_4',
        tokenNumber: 'AY-007',
        department: 'AYUSH / Ayurveda',
        status: 'READY_FOR_CONSULTATION',
        priority: 'ROUTINE',
        intakeStartTime: '2026-09-20T10:20:00.000Z',
        intakeCompletedTime: '2026-09-20T10:27:00.000Z',
        assignedDoctorId: 'usr_doc_1',
        assignedDoctorName: 'Dr. Arvind Sharma, MD',
        chiefComplaintSummary: 'Chronic postprandial acidity (Amlapitta) and irregular bowel habits',
        intakeDurationSeconds: 390,
      }
    ];

    // 4. Seed Structured History for Ramesh Kumar
    this.histories['enc_ramesh_1'] = {
      encounterId: 'enc_ramesh_1',
      patientId: 'pat_ramesh_1',
      chiefComplaint: {
        value: 'Chest discomfort and heaviness for 2 days, worse today morning',
        provenance: {
          sourceType: 'PATIENT_REPORTED',
          sourceQuote: 'मेरे सीने में 2 दिन से दर्द और भारीपन है, आज सुबह से बढ़ गया है।',
          confidence: 96,
          timestamp: '2026-09-20T09:21:10.000Z',
          isVerified: false,
        }
      },
      historyOfPresentIllness: {
        value: {
          onset: '2 days ago, abrupt increase in severity 3 hours ago',
          location: 'Retrosternal (central chest)',
          duration: 'Persistent with intermittent worsening on walking',
          character: 'Crushing heavy pressure and squeezing tightness',
          severity: 7, // 0-10
          radiation: 'Radiating to left shoulder and inner aspect of left arm',
          aggravatingFactors: ['Walking briskly', 'Climbing stairs', 'Emotional stress'],
          relievingFactors: ['Resting in seated position'],
          associatedSymptoms: ['Shortness of breath (Dyspnea)', 'Cold diaphoresis (clammy sweating)', 'Mild nausea'],
        },
        provenance: {
          sourceType: 'PATIENT_REPORTED',
          confidence: 94,
          timestamp: '2026-09-20T09:22:45.000Z',
          isVerified: false,
        }
      },
      pastMedicalHistory: {
        value: [
          'Type 2 Diabetes Mellitus (Diagnosed 6 years ago)',
          'Essential Hypertension (Diagnosed 4 years ago)',
          'Dyslipidemia'
        ],
        provenance: {
          sourceType: 'DOCUMENT_EXTRACTED',
          sourceDocumentId: 'doc_ramesh_lab_1',
          sourceDocumentTitle: 'Apollo Diagnostics HbA1c Report (dated 14 Aug 2026)',
          confidence: 95,
          timestamp: '2026-09-20T09:23:30.000Z',
          isVerified: false,
        }
      },
      pastSurgicalHistory: {
        value: ['No major surgeries reported'],
        provenance: {
          sourceType: 'PATIENT_REPORTED',
          confidence: 90,
          timestamp: '2026-09-20T09:23:45.000Z',
          isVerified: false,
        }
      },
      drugHistory: {
        value: [
          {
            name: 'Metformin Hydrochloride',
            dosage: '500 mg',
            frequency: 'Twice daily (BD)',
            timing: 'After meals',
            provenance: {
              sourceType: 'DOCUMENT_EXTRACTED',
              sourceDocumentId: 'doc_ramesh_rx_1',
              sourceDocumentTitle: 'District Hospital OPD Prescription (12 Aug 2026)',
              confidence: 97,
              timestamp: '2026-09-20T09:24:00.000Z',
              isVerified: false,
            }
          },
          {
            name: 'Amlodipine Besylate',
            dosage: '5 mg',
            frequency: 'Once daily (OD)',
            timing: 'Morning',
            provenance: {
              sourceType: 'DOCUMENT_EXTRACTED',
              sourceDocumentId: 'doc_ramesh_rx_1',
              sourceDocumentTitle: 'District Hospital OPD Prescription (12 Aug 2026)',
              confidence: 94,
              timestamp: '2026-09-20T09:24:00.000Z',
              isVerified: false,
            }
          }
        ],
        provenance: {
          sourceType: 'DOCUMENT_EXTRACTED',
          confidence: 96,
          timestamp: '2026-09-20T09:24:00.000Z',
          isVerified: false,
        }
      },
      allergyHistory: {
        value: [
          {
            allergen: 'Penicillin / Amoxicillin',
            reaction: 'Erythematous skin rash, facial itching',
            severity: 'Moderate',
            provenance: {
              sourceType: 'DOCUMENT_EXTRACTED',
              sourceDocumentId: 'doc_ramesh_discharge_prev',
              sourceDocumentTitle: 'Previous Hospital Discharge Summary (15 Jul 2025)',
              confidence: 95,
              timestamp: '2026-09-20T09:24:20.000Z',
              isVerified: false,
            }
          }
        ],
        provenance: {
          sourceType: 'DOCUMENT_EXTRACTED',
          confidence: 95,
          timestamp: '2026-09-20T09:24:20.000Z',
          isVerified: false,
        }
      },
      familyHistory: {
        value: ['Father had ischemic stroke at age 68', 'Mother has Type 2 Diabetes'],
        provenance: {
          sourceType: 'PATIENT_REPORTED',
          confidence: 90,
          timestamp: '2026-09-20T09:24:40.000Z',
          isVerified: false,
        }
      },
      personalHistory: {
        value: {
          diet: 'Vegetarian, occasional high-carbohydrate meals',
          sleep: '6 hours, restless due to night-time discomfort',
          smoking: 'Non-smoker',
          alcohol: 'Denies alcohol intake',
          physicalActivity: 'Sedentary desk worker',
        },
        provenance: {
          sourceType: 'PATIENT_REPORTED',
          confidence: 92,
          timestamp: '2026-09-20T09:25:00.000Z',
          isVerified: false,
        }
      },
      reviewOfSystems: {
        value: {
          cardiovascular: 'Chest pressure, palpitations on fast walking',
          respiratory: 'Associated breathlessness with exertion',
          gastrointestinal: 'No hematemesis, mild dyspepsia',
          neurological: 'No syncope, no limb weakness',
        },
        provenance: {
          sourceType: 'PATIENT_REPORTED',
          confidence: 93,
          timestamp: '2026-09-20T09:25:20.000Z',
          isVerified: false,
        }
      },
      unresolvedQuestions: [
        {
          id: 'unres_1',
          category: 'MEDICATION_ADHERENCE',
          questionText: 'Did patient take Metformin and Amlodipine today morning?',
          reason: 'Prescription scanned but patient did not confirm morning dose intake.',
          urgency: 'HIGH',
          status: 'OPEN',
        },
        {
          id: 'unres_2',
          category: 'ALLERGY_VERIFICATION',
          questionText: 'Clarify conflicting allergy response: patient stated "No allergies" in kiosk, but 2025 discharge documents record Penicillin allergy rash.',
          reason: 'Severe patient safety contraindication if beta-lactam antibiotics are prescribed.',
          urgency: 'HIGH',
          status: 'OPEN',
        }
      ],
      contradictions: [
        {
          id: 'contra_1',
          topic: 'Penicillin Allergy Conflict',
          pastRecordValue: 'Discharge Summary 2025: Documented Penicillin allergy (urticarial rash)',
          currentInputValue: 'Kiosk Intake Response: Patient selected "No known allergies"',
          severity: 'HIGH',
          status: 'PENDING_PHYSICIAN_REVIEW',
        }
      ],
      isPhysicianConfirmed: false,
    };

    // 5. Seed Documents
    this.documents = [
      {
        id: 'doc_ramesh_lab_1',
        patientId: 'pat_ramesh_1',
        encounterId: 'enc_ramesh_1',
        title: 'Complete Metabolic Panel & Glycated Hb',
        docType: 'LAB_REPORT',
        uploadedAt: '2026-09-20T09:22:00.000Z',
        facilityName: 'Apollo Diagnostics Centre, Delhi',
        doctorName: 'Dr. S. K. Gupta, Pathologist',
        documentDate: '14 Aug 2026',
        fileUrl: '/sample-docs/ramesh-lab-report.pdf',
        status: 'NEEDS_REVIEW',
        ocrConfidence: 96,
        extractions: {
          labValues: [
            {
              testName: 'HbA1c (Glycosylated Hemoglobin)',
              result: '7.8',
              unit: '%',
              referenceRange: '< 5.7 Normal, 5.7 - 6.4 Prediabetes, ≥ 6.5 Diabetes',
              isAbnormal: true,
              confidence: 98,
              status: 'CONFIRMED',
            },
            {
              testName: 'Serum Creatinine',
              result: '1.4',
              unit: 'mg/dL',
              referenceRange: '0.7 - 1.2 mg/dL',
              isAbnormal: true,
              confidence: 92,
              status: 'CONFIRMED',
            },
            {
              testName: 'Hemoglobin (Hb)',
              result: '9.8',
              unit: 'g/dL',
              referenceRange: '13.0 - 17.0 g/dL',
              isAbnormal: true,
              confidence: 96,
              status: 'CONFIRMED',
            }
          ],
          diagnoses: ['Uncontrolled Type 2 Diabetes', 'Borderline elevated serum creatinine'],
        }
      },
      {
        id: 'doc_ramesh_rx_1',
        patientId: 'pat_ramesh_1',
        encounterId: 'enc_ramesh_1',
        title: 'District Hospital OPD Prescription',
        docType: 'PRESCRIPTION',
        uploadedAt: '2026-09-20T09:23:00.000Z',
        facilityName: 'District Civil Hospital, OPD Unit 3',
        doctorName: 'Dr. V. Mehra, MD',
        documentDate: '12 Aug 2026',
        fileUrl: '/sample-docs/ramesh-prescription.pdf',
        status: 'PROCESSED',
        ocrConfidence: 95,
        extractions: {
          medications: [
            {
              name: 'Tab. Metformin Hydrochloride',
              dosage: '500 mg',
              frequency: 'Twice daily (BD), after meals',
              confidence: 97,
              status: 'CONFIRMED',
            },
            {
              name: 'Tab. Amlodipine Besylate',
              dosage: '5 mg',
              frequency: 'Once daily (OD), morning',
              confidence: 94,
              status: 'CONFIRMED',
            }
          ],
          diagnoses: ['Essential Hypertension', 'Type 2 Diabetes Mellitus'],
        }
      },
      {
        id: 'doc_ramesh_discharge_prev',
        patientId: 'pat_ramesh_1',
        title: 'Previous Hospital Discharge Summary',
        docType: 'DISCHARGE_SUMMARY',
        uploadedAt: '2025-07-16T10:00:00.000Z',
        facilityName: 'City General Hospital',
        doctorName: 'Dr. P. Roy, MS',
        documentDate: '15 Jul 2025',
        fileUrl: '/sample-docs/ramesh-discharge-2025.pdf',
        status: 'PROCESSED',
        ocrConfidence: 94,
        extractions: {
          diagnoses: ['Acute Gastroenteritis with dehydration', 'Drug allergy to Penicillin noted'],
        }
      }
    ];

    // 6. Seed Timeline Events
    this.timelineEvents = [
      {
        id: 'tl_1',
        patientId: 'pat_ramesh_1',
        date: '2026-09-20',
        type: 'CONSULTATION',
        title: 'OPD Clinical Intake (General Medicine)',
        subtitle: 'Token G-124 — Pre-consultation story prepared via ChikitsaBodha',
        facility: 'District Hospital OPD',
        tags: ['Intake Complete', 'Priority: High', 'Red Flag'],
      },
      {
        id: 'tl_2',
        patientId: 'pat_ramesh_1',
        date: '2026-08-14',
        type: 'LAB_REPORT',
        title: 'Blood Test Results (HbA1c & Creatinine)',
        subtitle: 'Hb 9.8 g/dL (Low), HbA1c 7.8% (Elevated), Creatinine 1.4 mg/dL',
        facility: 'Apollo Diagnostics Centre',
        tags: ['Abnormal Values', 'Diabetes Mellitus'],
        sourceDocumentId: 'doc_ramesh_lab_1',
      },
      {
        id: 'tl_3',
        patientId: 'pat_ramesh_1',
        date: '2026-08-12',
        type: 'MEDICATION',
        title: 'Prescription Issued (OPD Follow-up)',
        subtitle: 'Tab. Metformin 500mg BD, Tab. Amlodipine 5mg OD',
        facility: 'District Civil Hospital',
        tags: ['Antidiabetic', 'Antihypertensive'],
        sourceDocumentId: 'doc_ramesh_rx_1',
      },
      {
        id: 'tl_4',
        patientId: 'pat_ramesh_1',
        date: '2025-07-15',
        type: 'CONSULTATION',
        title: 'Hospital Discharge Summary',
        subtitle: 'Discharged stable after treatment for acute gastroenteritis. Penicillin allergy recorded.',
        facility: 'City General Hospital',
        tags: ['Discharge', 'Allergy Recorded'],
        sourceDocumentId: 'doc_ramesh_discharge_prev',
      }
    ];

    // 7. Seed Triage Alert
    this.triageAlerts = [
      {
        id: 'trg_1',
        encounterId: 'enc_ramesh_1',
        patientId: 'pat_ramesh_1',
        patientName: 'Ramesh Kumar',
        age: 52,
        gender: 'Male',
        tokenNumber: 'G-124',
        priority: 'RED',
        department: 'General Medicine',
        detectedAt: '2026-09-20T09:22:45.000Z',
        triggerSymptoms: [
          'Acute retrosternal chest pain (Severity 7/10)',
          'Associated breathlessness (Dyspnea)',
          'Radiation to left arm'
        ],
        reason: 'Potential acute coronary syndrome / cardiorespiratory emergency detected during kiosk voice intake. Urgent bedside ECG and medical triage recommended.',
        status: 'ACTIVE',
      },
      {
        id: 'trg_2',
        encounterId: 'enc_sunita_2',
        patientId: 'pat_sunita_2',
        patientName: 'Sunita Devi',
        age: 45,
        gender: 'Female',
        tokenNumber: 'C-042',
        priority: 'YELLOW',
        department: 'Cardiology',
        detectedAt: '2026-09-20T09:37:00.000Z',
        triggerSymptoms: ['Frequent palpitations at rest', 'History of Hypothyroidism'],
        reason: 'Subacute palpitations with pending thyroid panel. Needs routine rhythm evaluation.',
        status: 'ACTIVE',
      }
    ];

    // 8. Seed Audit Logs
    this.auditLogs = [
      {
        id: 'aud_1',
        timestamp: '2026-09-20T09:15:02.000Z',
        actorId: 'pat_ramesh_1',
        actorName: 'Ramesh Kumar',
        actorRole: 'PATIENT',
        action: 'CONSENT_GRANTED',
        resource: 'Patient Consent Agreement v2.1',
        details: 'Patient completed multilingual biometric/voice consent in Hindi.',
        ipAddress: '192.168.1.104 (Kiosk #3)',
      },
      {
        id: 'aud_2',
        timestamp: '2026-09-20T09:23:05.000Z',
        actorId: 'system_ai',
        actorName: 'ChikitsaBodha Red-Flag Engine',
        actorRole: 'SUPERADMIN',
        action: 'TRIAGE_ALERT_DISPATCHED',
        resource: 'Encounter enc_ramesh_1',
        details: 'Dispatched RED tier alert for chest pain with breathlessness to Dr. Arvind Sharma and Nurse Deepa Verma.',
        ipAddress: 'Internal Event Bus',
      },
      {
        id: 'aud_3',
        timestamp: '2026-09-20T09:28:15.000Z',
        actorId: 'usr_doc_1',
        actorName: 'Dr. Arvind Sharma, MD',
        actorRole: 'DOCTOR',
        action: 'VIEW_30SEC_BRIEF',
        resource: 'Patient pat_ramesh_1',
        details: 'Accessed pre-consultation clinical summary and OCR prescription evidence.',
        ipAddress: '192.168.1.42 (Consultation Room 12)',
      }
    ];

    // 9. Seed Notifications
    this.notifications = [
      {
        id: 'notif_1',
        targetRole: 'DOCTOR',
        title: 'Priority Patient Detected: Token G-124',
        message: 'Ramesh Kumar (52/M) reported chest pain with breathlessness. Red-flag alert triggered.',
        timestamp: '2026-09-20T09:23:10.000Z',
        isRead: false,
        priority: 'RED',
        link: '/physician/enc_ramesh_1',
      },
      {
        id: 'notif_2',
        targetRole: 'DOCTOR',
        title: 'Patient History Ready: Token C-042',
        message: 'Sunita Devi (45/F) completed intake. Structured clinical story ready for review.',
        timestamp: '2026-09-20T09:41:00.000Z',
        isRead: false,
        priority: 'BLUE',
        link: '/physician/enc_sunita_2',
      },
      {
        id: 'notif_3',
        targetRole: 'NURSE',
        title: 'Immediate Triage Needed: Kiosk #3',
        message: 'High priority alert at General Medicine OPD intake kiosk.',
        timestamp: '2026-09-20T09:23:15.000Z',
        isRead: false,
        priority: 'RED',
        link: '/triage',
      }
    ];

    // 10. Seed AYUSH Assessment
    this.ayushAssessments = [
      {
        id: 'ay_1',
        patientId: 'pat_priya_4',
        encounterId: 'enc_priya_4',
        prakriti: {
          vata: 35,
          pitta: 50,
          kapha: 15,
          dominant: 'PITTA_VATA',
        },
        vikriti: 'Pitta-Pradhana Amlapitta with Vataja Anubandha',
        agni: 'TIKSHNA',
        koshtha: 'MADHYAMA',
        aharaShakti: 'MADHYAMA',
        vyayamaShakti: 'AVARA',
        satmya: 'Abhyavaharana of ushna, katu, teekshna rasa',
        sattva: 'MADHYAMA',
        vaya: 'Madhyama Vaya (Yuva)',
        ahara: {
          rasaDominance: ['Katu (Pungent)', 'Amla (Sour)', 'Lavana (Salty)'],
          regularity: 'Irregular lunch times, frequent fast food',
        },
        vihara: {
          sleepPattern: 'Late night sleeping (Ratrijagarana)',
          stressLevel: 'High occupational mental stress',
        },
        nidana: ['Ati-katu ahara sevana', 'Ratrijagarana', 'Mental stress'],
        sampraptiSummary: 'Pitta dosha prakopa resulting in Vidagdhajirna, sour eructations, and epigastric burning sensation.',
      }
    ];
  }
}

export const db = new InMemoryDatabase();
