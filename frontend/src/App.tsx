import React from 'react';
import { useApp } from './store/AppContext';
import { Header } from './components/common/Header';
import { LandingPage } from './views/landing/LandingPage';
import { PatientKiosk } from './views/patient/PatientKiosk';
import { PhysicianDashboard } from './views/physician/PhysicianDashboard';
import { HospitalAdmin } from './views/admin/HospitalAdmin';
import { TriageDashboard } from './views/triage/TriageDashboard';
import { AyushIntake } from './views/ayush/AyushIntake';
import { PrivacyCenter } from './views/privacy/PrivacyCenter';
import { HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F6] text-[#111827]">
      {/* Top Universal App Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'patient-kiosk' && <PatientKiosk />}
        {currentView === 'physician-dashboard' && <PhysicianDashboard />}
        {currentView === 'triage-center' && <TriageDashboard />}
        {currentView === 'opd-admin' && <HospitalAdmin />}
        {currentView === 'ayush-intake' && <AyushIntake />}
        {currentView === 'privacy-center' && <PrivacyCenter />}
      </main>

      {/* Clean Modern Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CHIKITSABODHA</span>
            <span>(चिकित्साबोध)</span>
            <span>•</span>
            <span className="italic">"From Patient Voice to Clinical Understanding"</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ABDM / FHIR-Ready Architecture</span>
            </span>
            <span className="text-slate-400">|</span>
            <span>Zero Autonomous Diagnosis Guarantee</span>
            <span className="text-slate-400">|</span>
            <button
              onClick={() => setCurrentView('landing')}
              className="text-[#69C7DF] font-semibold hover:underline"
            >
              Overview
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
