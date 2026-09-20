import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import { TriageAlert } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ArrowUpRight,
  Stethoscope,
  ChevronRight,
  Activity,
  HeartCrack
} from 'lucide-react';

export const TriageDashboard: React.FC = () => {
  const { setCurrentView } = useApp();
  const [alerts, setAlerts] = useState<TriageAlert[]>([]);
  const [stats, setStats] = useState<any>({ redCount: 1, orangeCount: 0, yellowCount: 1, totalActive: 2 });
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RED' | 'ORANGE' | 'YELLOW'>('ALL');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await api.getTriageAlerts();
      if (res.success) {
        setAlerts(res.alerts);
        setStats(res.stats);
      }
    } catch (e) {
      console.warn('Triage load error:', e);
    }
  };

  const handleAction = async (alertId: string, action: 'ACKNOWLEDGE' | 'ASSIGN' | 'ESCALATE' | 'RESOLVE') => {
    try {
      const res = await api.actionTriageAlert(alertId, { action });
      if (res.success) {
        loadAlerts();
      }
    } catch (e) {
      console.warn('Action alert error:', e);
    }
  };

  const filteredAlerts = activeFilter === 'ALL' ? alerts : alerts.filter((a) => a.priority === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Triage Command Center</h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold border border-red-200 animate-alert-pulse">
              {stats.redCount} Urgent Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time automated red-flag detection & bedside staff escalation
          </p>
        </div>

        {/* Triage Urgency Tiers Filter */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeFilter === 'ALL' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setActiveFilter('RED')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeFilter === 'RED' ? 'bg-red-500 text-white font-bold' : 'text-red-700'}`}
          >
            🔴 Red Tier ({stats.redCount})
          </button>
          <button
            onClick={() => setActiveFilter('YELLOW')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeFilter === 'YELLOW' ? 'bg-amber-500 text-white font-bold' : 'text-amber-700'}`}
          >
            🟡 Yellow Tier ({stats.yellowCount})
          </button>
        </div>
      </div>

      {/* Triage Alert Stream Cards */}
      <div className="mt-6 space-y-4">
        {filteredAlerts.map((alert) => {
          const isRed = alert.priority === 'RED';
          const isResolved = alert.status === 'RESOLVED';
          return (
            <div
              key={alert.id}
              className={`clinical-card p-6 rounded-[28px] border-2 transition-all ${
                isRed
                  ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isRed ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {isRed ? <HeartCrack className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-lg">{alert.patientName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 font-bold text-slate-700">
                        {alert.age} Y / {alert.gender}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                        Token: {alert.tokenNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(alert.detectedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      Department: <strong>{alert.department}</strong> • Status: <strong className={isRed ? 'text-red-700' : 'text-slate-800'}>{alert.status}</strong>
                    </div>

                    {/* Detected Symptoms & Clinical Reason */}
                    <div className="mt-3 p-3 rounded-2xl bg-white border border-slate-200/80 text-xs">
                      <div className="font-bold text-slate-900">Clinical Reason:</div>
                      <div className="text-slate-700 mt-0.5">{alert.reason}</div>
                      
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {alert.triggerSymptoms.map((sym, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-semibold">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions: Acknowledge, Assign, Escalate, Resolve */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleAction(alert.id, 'ACKNOWLEDGE')}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs hover:bg-slate-50 shadow-xs"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() => handleAction(alert.id, 'ASSIGN')}
                    className="px-4 py-2 rounded-xl bg-[#69C7DF] text-slate-950 font-bold text-xs shadow-xs hover:bg-[#5bc0d8]"
                  >
                    Assign Staff Nurse
                  </button>

                  <button
                    onClick={() => handleAction(alert.id, 'RESOLVE')}
                    className="px-4 py-2 rounded-xl bg-[#5BC58A] text-white font-bold text-xs shadow-xs hover:bg-[#4eb37a]"
                  >
                    Mark Resolved
                  </button>

                  <button
                    onClick={() => setCurrentView('physician-dashboard')}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>Doctor View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
