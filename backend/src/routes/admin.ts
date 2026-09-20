import { Router } from 'express';
import { db } from '../models/database';

export const adminRouter = Router();

adminRouter.get('/opd-command-center', (req, res) => {
  const totalEncounters = db.encounters.length;
  const completed = db.encounters.filter((e) => e.status === 'COMPLETED' || e.status === 'READY_FOR_CONSULTATION').length;
  const activeAlerts = db.triageAlerts.filter((a) => a.status === 'ACTIVE').length;
  const totalDocs = db.documents.length;

  res.json({
    success: true,
    isDemoData: true,
    dataLabel: 'Demo Data — ChikitsaBodha Hospital Pilot',
    kpis: {
      patientsToday: 48,
      completedIntakes: completed + 41,
      priorityAlerts: activeAlerts + 3,
      documentsProcessed: totalDocs + 82,
      averageIntakeTimeMinutes: 4.8,
      incompleteHistories: 4,
      historyCompletenessAvg: 88,
    },
    departmentLoad: [
      { department: 'General Medicine', activeQueue: 18, avgWaitMin: 12, readyIntakes: 14 },
      { department: 'Cardiology', activeQueue: 9, avgWaitMin: 15, readyIntakes: 8 },
      { department: 'AYUSH / Ayurveda', activeQueue: 7, avgWaitMin: 8, readyIntakes: 6 },
      { department: 'Pediatrics', activeQueue: 8, avgWaitMin: 10, readyIntakes: 7 },
      { department: 'Orthopedics', activeQueue: 6, avgWaitMin: 14, readyIntakes: 5 },
    ],
    languageDistribution: [
      { language: 'Hindi (हिन्दी)', percentage: 64, count: 31 },
      { language: 'English', percentage: 22, count: 11 },
      { language: 'Bilingual / Hinglish', percentage: 14, count: 6 },
    ],
    documentTypeBreakdown: [
      { type: 'Prescriptions', count: 46, percentage: 52 },
      { type: 'Lab Reports', count: 28, percentage: 32 },
      { type: 'Discharge Summaries', count: 10, percentage: 11 },
      { type: 'Radiology Reports', count: 4, percentage: 5 },
    ],
    kioskUtilization: [
      { kioskId: 'Kiosk #1 (OPD Main Lobby)', status: 'ACTIVE', currentToken: 'G-128', language: 'Hindi', uptime: '99.4%' },
      { kioskId: 'Kiosk #2 (Cardiology Wing)', status: 'ACTIVE', currentToken: 'C-043', language: 'Hindi', uptime: '98.8%' },
      { kioskId: 'Kiosk #3 (General Medicine Desk)', status: 'ACTIVE', currentToken: 'G-124', language: 'Hindi', uptime: '99.9%' },
      { kioskId: 'Kiosk #4 (AYUSH Center)', status: 'IDLE', currentToken: 'AY-008', language: 'English', uptime: '99.1%' },
    ],
    hourlyIntakeTrend: [
      { hour: '08:00 AM', intakes: 6, redFlags: 0 },
      { hour: '09:00 AM', intakes: 14, redFlags: 1 },
      { hour: '10:00 AM', intakes: 18, redFlags: 2 },
      { hour: '11:00 AM', intakes: 16, redFlags: 1 },
      { hour: '12:00 PM', intakes: 10, redFlags: 0 },
      { hour: '01:00 PM', intakes: 5, redFlags: 0 },
    ],
    doctorWorkload: [
      { doctorName: 'Dr. Arvind Sharma (Gen Med)', assigned: 16, completed: 12, pending: 4 },
      { doctorName: 'Dr. Meenakshi Sundaram (Cardiology)', assigned: 10, completed: 8, pending: 2 },
      { doctorName: 'Dr. Rajeshwari Vaidya (AYUSH)', assigned: 8, completed: 6, pending: 2 },
    ]
  });
});

adminRouter.get('/audit-logs', (req, res) => {
  res.json({
    success: true,
    auditLogs: db.auditLogs,
  });
});
