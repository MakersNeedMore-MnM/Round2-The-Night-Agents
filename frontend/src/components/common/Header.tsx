import React, { useState } from 'react';
import { useApp, AppView } from '../../store/AppContext';
import { UserRole } from '../../types';
import {
  Activity,
  ShieldAlert,
  Stethoscope,
  User,
  Building2,
  Sparkles,
  ShieldCheck,
  WifiOff,
  ChevronDown,
  Globe,
  HelpCircle,
  Home
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, currentView, setCurrentView, switchUserRole, isOffline, selectedLanguage, setSelectedLanguage } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'patient-kiosk', label: 'Patient Kiosk', icon: <User className="w-4 h-4" /> },
    { id: 'physician-dashboard', label: 'Physician 30s View', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'triage-center', label: 'Triage Center', icon: <ShieldAlert className="w-4 h-4 text-health-danger" />, badge: '1 RED' },
    { id: 'opd-admin', label: 'OPD Command', icon: <Building2 className="w-4 h-4" /> },
    { id: 'ayush-intake', label: 'AYUSH Intake', icon: <Sparkles className="w-4 h-4 text-ayush-saffron" /> },
    { id: 'privacy-center', label: 'Privacy & Audit', icon: <ShieldCheck className="w-4 h-4 text-health-success" /> },
  ];

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'DOCTOR', label: 'Doctor / Physician', desc: 'Dr. Arvind Sharma (Gen Med)' },
    { role: 'PATIENT', label: 'Patient / Kiosk User', desc: 'Ramesh Kumar (52/M)' },
    { role: 'NURSE', label: 'Triage Nurse', desc: 'Sister Deepa Verma' },
    { role: 'ADMIN', label: 'Hospital Admin', desc: 'Rajesh Nair (OPD Lead)' },
  ];

  const languages = [
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'en', label: 'English (Indian)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('landing')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#69C7DF] via-[#55C8B5] to-[#7867C8] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                <img src="/logo.svg" alt="ChikitsaBodha Logo" className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">CHIKITSA<span className="text-[#69C7DF]">BODHA</span></span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-500">चिकित्साबोध</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                From Patient Voice to Clinical Understanding
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Offline Indicator, Language Selector, Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Offline Status Pill */}
            {isOffline ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline (Saved)</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>ABDM-Ready Live</span>
              </div>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
                title="Select Clinical Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedLanguage === 'hi' ? 'हिन्दी' : 'English'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setSelectedLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        selectedLanguage === l.code ? 'font-bold text-[#69C7DF]' : 'text-slate-700'
                      }`}
                    >
                      {l.label}
                      {selectedLanguage === l.code && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Seeded Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/80 hover:border-slate-300 transition-all text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#69C7DF] to-[#7867C8] flex items-center justify-center text-white text-[10px] font-bold">
                  {user.role[0]}
                </div>
                <div className="text-left hidden xl:block">
                  <div className="font-semibold text-slate-800 leading-tight">{user.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 leading-none">{user.role}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 border-b border-slate-100 mb-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase">Demo Quick Switcher</div>
                    <div className="text-xs text-slate-600">Simulate hospital role experience</div>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchUserRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        user.role === r.role ? 'bg-cyan-50/60 font-bold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{r.desc}</div>
                      </div>
                      {user.role === r.role && <span className="text-[#69C7DF] font-bold">Active</span>}
                    </button>
                  ))}
                  <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    Seeded accounts with instant role-based permissions.
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/90 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-lg ${
              currentView === item.id ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
