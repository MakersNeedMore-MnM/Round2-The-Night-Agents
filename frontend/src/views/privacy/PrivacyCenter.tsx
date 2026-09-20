import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Lock,
  Download,
  AlertTriangle,
  Clock,
  Eye,
  Building,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  const { patient, setPatient } = useApp();

  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isConsentWithdrawn, setIsConsentWithdrawn] = useState(false);
  const [exportedData, setExportedData] = useState<any | null>(null);

  useEffect(() => {
    loadPrivacyLogs();
  }, [patient?.id]);

  const loadPrivacyLogs = async () => {
    try {
      const res = await api.getPrivacyLogs(patient?.id || 'pat_ramesh_1');
      if (res.success) {
        setAccessLogs(res.accessLogs);
        setFacilities(res.connectedFacilities);
      }
    } catch (e) {
      console.warn('Privacy logs error:', e);
    }
  };

  const handleWithdrawConsent = async () => {
    const confirm = window.confirm(
      'Are you sure you want to withdraw pre-consultation intake consent? Your clinical information will not be processed by AI algorithms.'
    );
    if (!confirm) return;

    try {
      const res = await api.withdrawConsent(patient?.id || 'pat_ramesh_1');
      if (res.success) {
        setIsConsentWithdrawn(true);
        if (patient) setPatient({ ...patient, consentGiven: false });
        loadPrivacyLogs();
      }
    } catch (e) {
      console.warn('Withdraw consent error:', e);
    }
  };

  const handleDownloadData = async () => {
    try {
      const res = await api.exportData(patient?.id || 'pat_ramesh_1');
      if (res.success) {
        setExportedData(res.data);
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ChikitsaBodha_HealthRecord_${patient?.uhid || 'pat'}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.warn('Export error:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="clinical-card p-6 bg-white rounded-[28px] mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#5BC58A] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Privacy & Statutory Health Rights</h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ABDM DPDP Act Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent consent management, data access trails, and sovereign patient data portability.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadData}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Download My Health Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Data Access History & Connected Facilities */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Data Access Audit Log */}
          <div className="clinical-card p-6 bg-white rounded-[28px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Who Has Accessed Your Data?</h3>
                <div className="text-[11px] text-slate-400">Timestamped record of clinical and administrative access</div>
              </div>
              <Eye className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 text-xs">
              {accessLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{log.actorName}</strong>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-semibold">{log.actorRole}</span>
                    </div>
                    <div className="text-slate-600 mt-1">{log.details}</div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Hospitals & Laboratories */}
          <div className="clinical-card p-6 bg-white rounded-[28px]">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Connected Healthcare Facilities</h3>
            <div className="space-y-2 text-xs">
              {facilities.map((f, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="font-semibold text-slate-800">{f.name}</div>
                      <div className="text-[10px] text-slate-400">Linked since {f.connectedSince}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Consent Controls & Withdrawal */}
        <div className="space-y-6">
          
          {/* Active Consent Status */}
          <div className="clinical-card p-6 bg-white rounded-[28px] border border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Consent Status
            </div>

            <div className="my-3 flex items-center gap-2">
              {patient?.consentGiven ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Active & Granted</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <XCircle className="w-5 h-5" />
                  <span>Consent Withdrawn</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Granted on <strong>{patient?.consentTimestamp ? new Date(patient.consentTimestamp).toLocaleString() : 'Today'}</strong> via Kiosk Biometric/Audio agreement.
            </p>

            <button
              onClick={handleWithdrawConsent}
              className="mt-5 w-full py-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs hover:bg-red-100 transition-all"
            >
              Withdraw Pre-Intake Consent
            </button>
          </div>

          {/* Data Minimization Policy */}
          <div className="clinical-card p-5 bg-white rounded-[24px]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Statutory Protections
            </div>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>AES-256 encryption at rest</li>
              <li>TLS 1.3 encryption in transit</li>
              <li>Never shared with third-party insurers without explicit opt-in</li>
              <li>Clinical audit trail immutable for 7 years</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
