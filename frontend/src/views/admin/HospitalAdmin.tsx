import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import {
  Building2,
  Users,
  Activity,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  BarChart3,
  Globe,
  Radio
} from 'lucide-react';

export const HospitalAdmin: React.FC = () => {
  const { user } = useApp();

  const [metrics, setMetrics] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'COMMAND' | 'KIOSKS' | 'WORKLOAD' | 'AUDIT' | 'SETTINGS'>('COMMAND');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resMetrics, resAudit] = await Promise.all([
        api.getOpdCommandCenterMetrics(),
        api.getAuditLogs(),
      ]);
      if (resMetrics.success) setMetrics(resMetrics);
      if (resAudit.success) setAuditLogs(resAudit.auditLogs);
    } catch (e) {
      console.warn('Admin load error:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner & Demo Data Disclaimer */}
      <div className="flex flex-wrap items-center justify-between pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">OPD Command Center</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
              Live Monitoring
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            District Civil Hospital • Real-time clinical intake analytics & kiosk management
          </p>
        </div>

        {/* Demo Data Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
            📊 Demo Data (Pilot Sandbox)
          </span>

          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('COMMAND')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'COMMAND' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('KIOSKS')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'KIOSKS' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              Kiosks
            </button>
            <button
              onClick={() => setActiveTab('WORKLOAD')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'WORKLOAD' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              Doctors
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeTab === 'AUDIT' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS (Inspired by the calm, clean design reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="clinical-card p-4 rounded-[22px] bg-white">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Patients Today</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{metrics?.kpis.patientsToday || 48}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">↑ 14% vs yesterday</div>
        </div>

        <div className="clinical-card p-4 rounded-[22px] bg-white">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Completed Intakes</div>
          <div className="text-2xl font-black text-[#5BC58A] mt-1">{metrics?.kpis.completedIntakes || 42}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">88% completion rate</div>
        </div>

        <div className="clinical-card p-4 rounded-[22px] bg-white">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Priority Alerts</div>
          <div className="text-2xl font-black text-red-600 mt-1">{metrics?.kpis.priorityAlerts || 4}</div>
          <div className="text-[10px] text-red-600 font-semibold mt-1">Immediate attention</div>
        </div>

        <div className="clinical-card p-4 rounded-[22px] bg-white">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Documents OCR'd</div>
          <div className="text-2xl font-black text-[#69C7DF] mt-1">{metrics?.kpis.documentsProcessed || 85}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">96% avg confidence</div>
        </div>

        <div className="clinical-card p-4 rounded-[22px] bg-white">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Avg Intake Time</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{metrics?.kpis.averageIntakeTimeMinutes || 4.8}m</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">↓ 3.2m saved per patient</div>
        </div>

        <div className="clinical-card p-4 rounded-[22px] bg-white">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Record Quality</div>
          <div className="text-2xl font-black text-[#7867C8] mt-1">{metrics?.kpis.historyCompletenessAvg || 88}%</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">ABDM-Ready</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMMAND CENTER OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'COMMAND' && (
        <div className="space-y-6">
          
          {/* Main Visuals Row: Hourly Trend & Department Load */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Hourly Ingestion Trend Bar Chart (SVG-based Clean Design) */}
            <div className="clinical-card p-6 bg-white rounded-[28px] lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Hourly Intake Volume & Priority Flags</h3>
                  <div className="text-[11px] text-slate-400">Real-time OPD inflow profile</div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#69C7DF]"></span> Intakes
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span> Red-Flags
                  </span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-56 flex items-end justify-between gap-4 pt-6 px-2">
                {(metrics?.hourlyIntakeTrend || [
                  { hour: '08 AM', intakes: 6, redFlags: 0 },
                  { hour: '09 AM', intakes: 14, redFlags: 1 },
                  { hour: '10 AM', intakes: 18, redFlags: 2 },
                  { hour: '11 AM', intakes: 16, redFlags: 1 },
                  { hour: '12 PM', intakes: 10, redFlags: 0 },
                  { hour: '01 PM', intakes: 5, redFlags: 0 },
                ]).map((slot: any, idx: number) => {
                  const barHeight = (slot.intakes / 20) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-700 mb-1 group-hover:text-[#69C7DF]">
                        {slot.intakes}
                      </div>
                      <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-40">
                        {slot.redFlags > 0 && (
                          <div
                            style={{ height: `${slot.redFlags * 20}%` }}
                            className="w-full bg-red-500"
                            title={`${slot.redFlags} Red Flags`}
                          ></div>
                        )}
                        <div
                          style={{ height: `${barHeight}%` }}
                          className="w-full bg-gradient-to-t from-[#55C8B5] to-[#69C7DF]"
                        ></div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-medium">{slot.hour}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Language & Document Distributions */}
            <div className="space-y-6">
              
              {/* Language Breakdown */}
              <div className="clinical-card p-5 bg-white rounded-[24px]">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Language Ingestion Breakdown
                </div>
                <div className="space-y-3 text-xs">
                  {(metrics?.languageDistribution || [
                    { language: 'Hindi (हिन्दी)', percentage: 64 },
                    { language: 'English', percentage: 22 },
                    { language: 'Bilingual / Hinglish', percentage: 14 },
                  ]).map((lang: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span>{lang.language}</span>
                        <span>{lang.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${lang.percentage}%` }}
                          className={`h-full ${idx === 0 ? 'bg-[#69C7DF]' : idx === 1 ? 'bg-[#55C8B5]' : 'bg-[#7867C8]'}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Breakdown */}
              <div className="clinical-card p-5 bg-white rounded-[24px]">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Scanned Document Types
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(metrics?.documentTypeBreakdown || [
                    { type: 'Prescriptions', count: 46 },
                    { type: 'Lab Reports', count: 28 },
                    { type: 'Discharge Summaries', count: 10 },
                    { type: 'Radiology', count: 4 },
                  ]).map((dt: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400">{dt.type}</div>
                      <div className="text-base font-black text-slate-900 mt-0.5">{dt.count}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Department Load Table */}
          <div className="clinical-card p-6 bg-white rounded-[28px]">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Department Intake & Queue Load</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Active In Queue</th>
                    <th className="pb-3">Pre-Consult Ready</th>
                    <th className="pb-3">Avg Wait Time</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(metrics?.departmentLoad || [
                    { department: 'General Medicine', activeQueue: 18, readyIntakes: 14, avgWaitMin: 12 },
                    { department: 'Cardiology', activeQueue: 9, readyIntakes: 8, avgWaitMin: 15 },
                    { department: 'AYUSH / Ayurveda', activeQueue: 7, readyIntakes: 6, avgWaitMin: 8 },
                    { department: 'Pediatrics', activeQueue: 8, readyIntakes: 7, avgWaitMin: 10 },
                    { department: 'Orthopedics', activeQueue: 6, readyIntakes: 5, avgWaitMin: 14 },
                  ]).map((d: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800">{d.department}</td>
                      <td className="py-3.5 font-semibold text-slate-700">{d.activeQueue} patients</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {d.readyIntakes} Story Ready
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600">{d.avgWaitMin} minutes</td>
                      <td className="py-3.5">
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Smooth
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KIOSKS */}
      {/* ========================================================================= */}
      {activeTab === 'KIOSKS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(metrics?.kioskUtilization || [
            { kioskId: 'Kiosk #1 (OPD Main Lobby)', status: 'ACTIVE', currentToken: 'G-128', language: 'Hindi', uptime: '99.4%' },
            { kioskId: 'Kiosk #2 (Cardiology Wing)', status: 'ACTIVE', currentToken: 'C-043', language: 'Hindi', uptime: '98.8%' },
            { kioskId: 'Kiosk #3 (General Medicine Desk)', status: 'ACTIVE', currentToken: 'G-124', language: 'Hindi', uptime: '99.9%' },
            { kioskId: 'Kiosk #4 (AYUSH Center)', status: 'IDLE', currentToken: 'AY-008', language: 'English', uptime: '99.1%' },
          ]).map((k: any, idx: number) => (
            <div key={idx} className="clinical-card p-5 bg-white rounded-[24px] border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{k.kioskId}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${k.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {k.status}
                </span>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Current Patient Token:</span>
                  <strong className="text-slate-900">{k.currentToken}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Language:</span>
                  <strong className="text-slate-900">{k.language}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Device Hardware Uptime:</span>
                  <strong className="text-emerald-600">{k.uptime}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DOCTOR WORKLOAD */}
      {/* ========================================================================= */}
      {activeTab === 'WORKLOAD' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(metrics?.doctorWorkload || [
            { doctorName: 'Dr. Arvind Sharma (Gen Med)', assigned: 16, completed: 12, pending: 4 },
            { doctorName: 'Dr. Meenakshi Sundaram (Cardiology)', assigned: 10, completed: 8, pending: 2 },
            { doctorName: 'Dr. Rajeshwari Vaidya (AYUSH)', assigned: 8, completed: 6, pending: 2 },
          ]).map((doc: any, idx: number) => (
            <div key={idx} className="clinical-card p-5 bg-white rounded-[24px]">
              <div className="font-bold text-slate-900 text-sm">{doc.doctorName}</div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patients Assigned:</span>
                  <strong className="text-slate-900">{doc.assigned}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consultations Completed:</span>
                  <strong className="text-emerald-600">{doc.completed}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending in Queue:</span>
                  <strong className="text-cyan-600">{doc.pending}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT TRAIL */}
      {/* ========================================================================= */}
      {activeTab === 'AUDIT' && (
        <div className="clinical-card p-6 bg-white rounded-[28px]">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Statutory Clinical Audit Trail</h3>
          <div className="space-y-3 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-bold text-slate-600">{log.actorRole}</span>
                    <span className="text-[11px] font-mono text-[#69C7DF] font-semibold">{log.action}</span>
                  </div>
                  <div className="text-slate-600 mt-1">{log.details}</div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div className="font-mono">{log.ipAddress}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
