import React from 'react';
import { useApp } from '../../store/AppContext';
import {
  Mic,
  FileText,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HeartPulse,
  Brain,
  Building,
  Lock,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, switchUserRole } = useApp();

  return (
    <div className="min-h-screen bg-[#EEF3F6] text-[#111827]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#69C7DF] animate-ping"></span>
              <span className="text-xs font-semibold text-slate-700">
                AI-Powered Multilingual Clinical Intake & Health Intelligence
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              From Patient Voice to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69C7DF] via-[#55C8B5] to-[#7867C8]">
                Clinical Understanding
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Turn a patient's voice, answers and medical documents into a structured clinical story 
              <strong className="text-slate-800 font-semibold"> before the consultation begins</strong>.
            </p>

            {/* Startup Positioning quote */}
            <div className="mt-4 text-xs font-medium text-slate-500 italic">
              "We don't replace the doctor. We prepare the patient for the doctor."
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView('patient-kiosk')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-slate-950" />
                <span>Start Patient Intake (Kiosk)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => setCurrentView('physician-dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-[#69C7DF]" />
                <span>Physician 30-Sec Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('opd-admin')}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200/80 transition-all flex items-center gap-2"
              >
                <Building className="w-4 h-4 text-slate-500" />
                <span>Explore for Hospitals</span>
              </button>
            </div>
          </div>

          {/* Hero Visual: 5-Stage Patient to Doctor Flow */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="clinical-card p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-[28px] border border-slate-200/90 shadow-soft">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
                The ChikitsaBodha Pre-Consultation Pipeline
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/70 border border-slate-100 text-center hover:bg-white hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">1. Patient Voice</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Multilingual audio & touch in Hindi, English & Indian languages
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/70 border border-slate-100 text-center hover:bg-white hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">2. Clinical Engine</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Adaptive question ontology & safety red-flag screening
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/70 border border-slate-100 text-center hover:bg-white hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">3. Document OCR</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Prescriptions & lab reports extracted with confidence scores
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-[#EEF3F6]/70 border border-slate-100 text-center hover:bg-white hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">4. Structured Story</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Evidence-linked timeline & contradiction detection
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-emerald-50 border border-cyan-200 text-center hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#69C7DF] text-slate-950 flex items-center justify-center mx-auto mb-2 font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">5. Doctor Brief</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    30-second understanding & 1-click confirmation
                  </div>
                </div>
              </div>

              {/* Safety Guarantee Footnote */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#5BC58A]" />
                  Clinical Rule: AI organizes and summarizes. Physician remains the final decision maker.
                </span>
                <span className="hidden sm:inline text-slate-400 font-mono">ABDM-Ready FHIR R4 Compliant</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM & WHY NOW */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="text-xs font-bold text-health-danger uppercase tracking-wider mb-2">The Problem</div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                In Indian OPDs, Doctors Meet the Patient Before the Story is Organized.
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                With outpatient volumes exceeding 80–120 patients per shift, physicians are forced to spend 
                70% of a 3-minute consultation eliciting basic timelines, deciphering illegible old prescriptions, 
                and translating colloquial symptoms.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50/70 border border-red-100 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-slate-900">Crucial details get missed:</strong> Allergies, contradictory previous prescriptions, and symptom onset timelines are lost in the rush.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-slate-900">Delayed Red-Flag Escalation:</strong> Patients with acute coronary distress or respiratory compromise sit in general queues without timely triage.
                  </div>
                </div>
              </div>
            </div>

            {/* Why Now & The ChikitsaBodha Shift */}
            <div className="clinical-card p-8 bg-[#EEF3F6]/50 rounded-[28px]">
              <div className="text-xs font-bold text-[#69C7DF] uppercase tracking-wider mb-2">The Solution</div>
              <h3 className="text-2xl font-bold text-slate-900">The Pre-Consultation Revolution</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                ChikitsaBodha engages the patient in their native tongue at the hospital kiosk or waiting area. 
                When the doctor clicks the patient record, the full medical history is already synthesized with 
                clear provenance links.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="text-3xl font-extrabold text-[#69C7DF]">30 sec</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Doctor Understanding</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="text-3xl font-extrabold text-[#5BC58A]">100%</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Traceable Evidence</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="text-3xl font-extrabold text-[#7867C8]">8+</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Indian Languages</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="text-3xl font-extrabold text-health-danger">Zero</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Autonomous Diagnosis</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PRODUCT SUITES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#69C7DF] uppercase tracking-wider">Product Suite</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            One Unified Platform. Four Specialized Experiences.
          </h2>
          <p className="mt-3 text-slate-600 text-sm">
            Powered by a unified clinical intelligence engine and interoperable database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Suite 1: Patient Kiosk */}
          <div 
            onClick={() => setCurrentView('patient-kiosk')}
            className="clinical-card p-6 rounded-[24px] cursor-pointer group hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-[#69C7DF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Patient App & Kiosk</h3>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              Multilingual conversational voice interface, informed audio consent, adaptive symptom inquiry, and document scanner.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#69C7DF]">
              <span>Launch Kiosk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Suite 2: Physician 30-Sec Dashboard */}
          <div 
            onClick={() => setCurrentView('physician-dashboard')}
            className="clinical-card p-6 rounded-[24px] cursor-pointer group hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Physician Dashboard</h3>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              The 30-Second Clinical Understanding brief, provenance verification, contradiction alerts, and ABDM FHIR bundle export.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
              <span>View Doctor Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Suite 3: OPD Command Center */}
          <div 
            onClick={() => setCurrentView('opd-admin')}
            className="clinical-card p-6 rounded-[24px] cursor-pointer group hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7867C8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">OPD Command Center</h3>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              Hospital administrator overview with live department queues, kiosk utilization, doctor workload, and audit logs.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7867C8]">
              <span>Open Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Suite 4: Triage Dashboard */}
          <div 
            onClick={() => setCurrentView('triage-center')}
            className="clinical-card p-6 rounded-[24px] cursor-pointer group hover:-translate-y-1 transition-all border-red-100"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Triage Center</h3>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              Real-time safety red-flag escalation, color-coded tiers (Red/Orange/Yellow/Green), and immediate nursing alerts.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
              <span>Inspect Triage Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. AYUSH MODE SHOWCASE */}
      <section className="py-16 bg-gradient-to-b from-[#FEF5E7]/50 to-white border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dedicated AYUSH Mode</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Ayurvedic Clinical Intake: <br />
                <span className="text-[#E67E22]">Prakriti, Agni & Samprapti</span>
              </h2>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                Modern clinical intake often ignores traditional frameworks. ChikitsaBodha includes dedicated pathways 
                for Ayurveda and AYUSH institutions, structuring Dashavidha & Ashtavidha Pariksha seamlessly.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-amber-200">
                  <strong className="text-amber-900">Prakriti Assessment</strong>
                  <div className="text-slate-500 mt-0.5">Vata, Pitta, Kapha proportion</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-amber-200">
                  <strong className="text-amber-900">Jatharagni Pariksha</strong>
                  <div className="text-slate-500 mt-0.5">Sama, Vishama, Tikshna, Manda</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-amber-200">
                  <strong className="text-amber-900">Koshtha Swabhava</strong>
                  <div className="text-slate-500 mt-0.5">Mridu, Madhyama, Krura</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-amber-200">
                  <strong className="text-amber-900">Ahara & Vihara</strong>
                  <div className="text-slate-500 mt-0.5">Rasa dominance & sleep patterns</div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setCurrentView('ayush-intake')}
                  className="px-5 py-2.5 rounded-2xl bg-[#E67E22] text-white font-bold text-xs hover:bg-[#D35400] transition-all flex items-center gap-2"
                >
                  <span>Open AYUSH Intake Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="clinical-card p-6 bg-white border-amber-200 rounded-[28px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="font-bold text-slate-900 text-sm">Sample AYUSH Intake Profile</div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">Ayurveda OPD</span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FEF5E7]/60">
                  <div className="font-semibold text-amber-900">Prakriti Analysis:</div>
                  <div className="text-slate-700 mt-1">Pitta 50% | Vata 35% | Kapha 15% (Pitta-Vata Dominant)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="font-semibold text-slate-900">Agni (Digestive Fire):</div>
                  <div className="text-slate-600 mt-1">Tikshnagni (Acidity, fast thirst, burning epigastric sensation)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="font-semibold text-slate-900">Nidana & Samprapti:</div>
                  <div className="text-slate-600 mt-1">Ati-katu ahara, Ratrijagarana leading to Vidagdhajirna (Amlapitta).</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRODUCT ROADMAP */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#69C7DF] uppercase tracking-wider">Future Trajectory</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Platform Roadmap</h2>
          <p className="mt-3 text-slate-600 text-sm">From initial OPD pilot to national health intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="clinical-card p-6 rounded-[24px] bg-white border-t-4 border-t-[#69C7DF]">
            <div className="text-xs font-bold text-[#69C7DF]">PHASE 1 (Live Now)</div>
            <h4 className="font-bold text-slate-900 mt-1 text-sm">Core Clinical Intake</h4>
            <ul className="text-xs text-slate-600 mt-3 space-y-1.5 list-disc list-inside">
              <li>Hindi + English voice & touch</li>
              <li>Chief complaint pathways</li>
              <li>Document OCR & entity extraction</li>
              <li>Physician 30-sec brief</li>
            </ul>
          </div>

          <div className="clinical-card p-6 rounded-[24px] bg-white border-t-4 border-t-[#55C8B5]">
            <div className="text-xs font-bold text-[#55C8B5]">PHASE 2 (Current)</div>
            <h4 className="font-bold text-slate-900 mt-1 text-sm">AYUSH & Regional Scale</h4>
            <ul className="text-xs text-slate-600 mt-3 space-y-1.5 list-disc list-inside">
              <li>Ayurveda Prakriti/Agni engine</li>
              <li>8 Indian languages expansion</li>
              <li>Offline-first local syncing</li>
              <li>Bedside nursing triage</li>
            </ul>
          </div>

          <div className="clinical-card p-6 rounded-[24px] bg-white border-t-4 border-t-[#7867C8]">
            <div className="text-xs font-bold text-[#7867C8]">PHASE 3</div>
            <h4 className="font-bold text-slate-900 mt-1 text-sm">ABDM Ecosystem Integration</h4>
            <ul className="text-xs text-slate-600 mt-3 space-y-1.5 list-disc list-inside">
              <li>ABHA M1/M2/M3 certification path</li>
              <li>FHIR R4 live hospital HIE</li>
              <li>Specialty oncology & pediatric pathways</li>
              <li>Multi-hospital tenant federation</li>
            </ul>
          </div>

          <div className="clinical-card p-6 rounded-[24px] bg-white border-t-4 border-t-slate-800">
            <div className="text-xs font-bold text-slate-800">PHASE 4</div>
            <h4 className="font-bold text-slate-900 mt-1 text-sm">Longitudinal Intelligence</h4>
            <ul className="text-xs text-slate-600 mt-3 space-y-1.5 list-disc list-inside">
              <li>Home WhatsApp pre-intake bot</li>
              <li>Predictive chronic disease progression</li>
              <li>Automated follow-up adherence check</li>
              <li>Epidemiological OPD surveillance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. TEAM & STATEMENTS */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
            <HeartPulse className="w-6 h-6 text-[#69C7DF]" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            "Let AI Collect the Story. <br />
            Let Doctors Understand the Patient."
          </h2>
          <p className="mt-4 text-slate-400 text-sm max-w-xl mx-auto">
            Built by a dedicated clinical-engineering team in New Delhi & Bengaluru committed to dignified, 
            efficient healthcare for every Indian citizen.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('patient-kiosk')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#69C7DF] to-[#55C8B5] text-slate-950 font-bold text-sm hover:scale-105 transition-all"
            >
              Test Patient Kiosk Now
            </button>
            <button
              onClick={() => setCurrentView('physician-dashboard')}
              className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            >
              Review Ramesh Kumar's 30s Record
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
