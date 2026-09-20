# CHIKITSABODHA (चिकित्साबोध)
### *"From Patient Voice to Clinical Understanding"*

> **AI-Powered Multilingual Clinical Intake & Health Intelligence Platform for Indian Hospitals, Government OPDs, and AYUSH Institutions.**

---

## 🏥 Clinical Problem & Positioning

In high-volume Indian hospital Outpatient Departments (OPDs), doctors frequently consult 80–120 patients per shift. In a typical 3-minute interaction, up to 70% of time is consumed by translating colloquial symptoms, deciphering crumpled paper prescriptions, and eliciting basic medical timelines.

**ChikitsaBodha alters this paradigm:**
> *"We don't replace the doctor. We prepare the patient for the doctor."*  
> *"Let AI collect the story. Let doctors understand the patient."*

The AI structures information, extracts prescription entities, tracks longitudinal timelines, and screens for life-threatening red flags. **It NEVER autonomously diagnoses, prescribes, or claims clinical certainty.** The treating physician remains the ultimate authority.

---

## 🚀 Key Modules & Architecture

```
                                  [ Patient ]
                                       │
                ┌──────────────────────┴──────────────────────┐
                │             1. Identification               │ (ABHA / UHID / Mobile)
                │             2. Informed Consent             │ (Audio explanation in Hindi/En)
                │             3. Preferred Language           │ (Hindi, English, Tamil, etc.)
                └──────────────────────┬──────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │          Conversational Intake              │
                │   • Voice Waveform & Speech-to-Text         │
                │   • JSON Clinical Question Engine           │
                │   • Touch Scale (VAS 0-10)                  │
                └──────────────────────┬──────────────────────┘
                                       │
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
        [ Red-Flag Safety Engine ]               [ Document Scanner & OCR ]
        • Chest pain + Dyspnea                   • Prescriptions (Rx)
        • Immediate Triage Escalation            • Lab reports (HbA1c, Creatinine)
        • Halts intake & alerts staff            • Human-in-the-loop verification
                   │                                       │
                   └───────────────────┬───────────────────┘
                                       ▼
                         [ Longitudinal Timeline ]
                                       │
                                       ▼
                      [ 30-Second Clinical Understanding ]
                      • Chief Complaint (Provenance-linked)
                      • Structured HPI & Past Illness
                      • Drug History from Scanned Rx
                      • Contradiction Engine (Allergy Conflict)
                      • "Before Consultation" Unresolved Items
                                       │
                                       ▼
                           [ Physician Verification ]
                           • Confirm / Edit / Reject
                           • Add Clinical Consultation Note
                           • Finalize & Generate ABDM FHIR Bundle
```

---

## 🎨 Visual Design System & Aesthetics

Inspired by modern, calm healthcare SaaS:
- **Background**: `#EEF3F6` (soft light grey-blue)
- **Surfaces**: `#FFFFFF` (white cards with 24–28px radius and soft shadows)
- **Typography**: Inter & Manrope, dark navy `#111827`, secondary text `#667085`
- **Primary Healthcare Blue/Cyan**: `#69C7DF`
- **Secondary Teal**: `#55C8B5`
- **Brand Purple**: `#7867C8` (AI accents)
- **AYUSH Palette**: Subtle Saffron (`#E67E22`) and Herbal Green (`#27AE60`)
- **Status Indicators**: Success `#5BC58A`, Warning `#F2C66D`, Danger `#E87575`

---

## 🔑 Seeded Demo Accounts (Zero External Config Needed)

The application runs **100% out of the box** without external AI API keys. A quick-switch role dropdown in the header allows instant role simulation:

| Role | Email | Name / Department |
|---|---|---|
| **Doctor** | `doctor@chikitsabodha.demo` | Dr. Arvind Sharma, MD (General Medicine) |
| **Patient** | `patient@chikitsabodha.demo` | Ramesh Kumar, 52/M (UHID-2026-9812) |
| **Nurse / Triage** | `nurse@chikitsabodha.demo` | Sister Deepa Verma (Emergency Triage) |
| **Hospital Admin** | `admin@chikitsabodha.demo` | Rajesh Nair (OPD Command Center) |

---

## 💻 Quick Start & Installation

### Prerequisites
- Node.js (v18+ recommended, tested on v24)
- npm (v9+)

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start the Backend API Server
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` with health check at `/api/health`.*

### 3. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000` with automatic API proxying.*

---

## 🌟 15-Step Demo Walkthrough

1. **Overview & Landing Page**: Explore startup positioning, problem statement, workflow visualization, and live experience launchers.
2. **Launch Patient Kiosk**: Click *"Start Patient Intake"* in the header or hero.
3. **Step 1: Patient Identification**: Confirm patient identity via Hospital UHID (`UHID-2026-9812`), ABHA ID, or Mobile number.
4. **Step 2: Language**: Choose Hindi (हिन्दी) or English.
5. **Step 3: Informed Consent**: Click *"Listen to explanation"* to hear Hindi/English speech synthesis explaining data use and privacy rights, then click *"I Understand & Continue"*.
6. **Patient Home**: Inspect the Today's Visit token (`G-124`), Health Record Completeness ring (82% organized), and click `🎙 Start Talking`.
7. **Conversational Intake**:
   - System prompts: *"नमस्ते। आपको सबसे ज़्यादा तकलीफ़ किस चीज़ की हो रही है?"*
   - Patient reports chest discomfort (`मेरे सीने में दर्द है`).
   - Adaptive clinical question engine asks follow-ups: onset, character, 0-10 severity touch scale, radiation.
8. **Red-Flag Safety Trigger**: When associated breathlessness is selected, the **Red-Flag Safety Engine** immediately halts routine intake, displays supportive emergency guidance, and notifies triage staff.
9. **Document Scanner & OCR**:
   - Click *"Scan Docs"* tab.
   - Scan prescription (`Tab. Metformin 500mg`, `Tab. Amlodipine 5mg`).
   - Scan blood report (`HbA1c 7.8%`, `Serum Creatinine 1.4 mg/dL`).
   - Human-in-the-loop: Confirm or edit extracted parameters with confidence badges.
10. **Longitudinal Timeline**: View chronological health history linking back to original evidence documents.
11. **Switch to Physician Dashboard**: Open Doctor Mode (`Dr. Arvind Sharma, MD`).
12. **30-Second Clinical Understanding Brief**:
    - Review Chief Complaint with provenance badge (`Patient Voice - 96%`).
    - Inspect HPI, drug history, and abnormal lab highlights.
13. **Unresolved Questions & Contradictions**:
    - Review alert: *⚠ Record Conflict Detected — Previous record: Penicillin allergy vs Current intake: No known allergies*.
    - Physician clicks *"Physician Verified & Clarified"*.
14. **Finalize Record**: Add clinical consultation note and click *"Finalize Record & Export ABDM FHIR"*.
15. **ABDM FHIR Bundle**: Inspect generated NRCeS-compliant FHIR R4 Bundle with Patient, Encounter, Condition, and Provenance resources.

---

## 📊 Available Views
- **`/landing`**: Venture-grade Startup Landing Page
- **`/patient`**: Multilingual Patient Kiosk (Voice/Touch Interview, OCR Scanner, Timeline)
- **`/physician`**: The 30-Second Clinical Understanding Dashboard
- **`/triage`**: Urgent Red-Flag Command Center (Red/Orange/Yellow/Green Triage)
- **`/admin`**: OPD Command Center with Department load & Kiosk analytics
- **`/ayush`**: Dedicated Ayurvedic Clinical Intake (Prakriti, Agni, Koshtha)
- **`/privacy`**: Statutory Privacy Center (Consent withdrawal, Audit trail, Data download)

---

## 🛡 Security & Statutory Compliance
- **Zero Autonomous Diagnosis**: Strictly an informational and intake structuring engine.
- **DPDP Act & ABDM Alignment**: Granular consent timestamps and patient revocation rights.
- **Audit Logging**: Every view and extraction logged with timestamp, actor ID, and IP address.
- **Offline Architecture**: Local browser storage and network synchronization queue when internet drops.
