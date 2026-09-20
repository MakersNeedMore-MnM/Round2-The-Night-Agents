import { Router } from 'express';
import { db } from '../models/database';
import { exportToAbdmFhirBundle } from '../clinical/abdmExporter';

export const privacyRouter = Router();

privacyRouter.get('/logs/:patientId', (req, res) => {
  const patient = db.patients.find((p) => p.id === req.params.patientId) || db.patients[0];
  const logs = db.auditLogs.filter(
    (l) => l.actorId === patient.id || l.resource.includes(patient.name) || l.resource.includes(patient.uhid)
  );

  res.json({
    success: true,
    patient,
    accessLogs: logs,
    connectedFacilities: [
      { name: 'District Civil Hospital OPD', status: 'ACTIVE', connectedSince: '12 Aug 2026' },
      { name: 'Apollo Diagnostics Laboratory', status: 'ACTIVE', connectedSince: '14 Aug 2026' },
      { name: 'City General Hospital Archive', status: 'HISTORICAL', connectedSince: '15 Jul 2025' },
    ],
  });
});

privacyRouter.post('/withdraw-consent/:patientId', (req, res) => {
  const patient = db.patients.find((p) => p.id === req.params.patientId);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  patient.consentGiven = false;

  db.auditLogs.unshift({
    id: `aud_with_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: patient.id,
    actorName: patient.name,
    actorRole: 'PATIENT',
    action: 'CONSENT_WITHDRAWN',
    resource: 'Patient Health Record & Biometric Data',
    details: 'Patient exercised statutory right to withdraw pre-consultation intake consent.',
    ipAddress: '192.168.1.104',
  });

  res.json({
    success: true,
    consentGiven: false,
    message: 'Consent withdrawn successfully. Further AI processing paused for this patient.',
  });
});

privacyRouter.get('/export-data/:patientId', (req, res) => {
  const patient = db.patients.find((p) => p.id === req.params.patientId) || db.patients[0];
  const encounter = db.encounters.find((e) => e.patientId === patient.id) || db.encounters[0];
  const history = db.histories[encounter.id] || db.histories['enc_ramesh_1'];
  const documents = db.documents.filter((d) => d.patientId === patient.id);
  const timeline = db.timelineEvents.filter((t) => t.patientId === patient.id);

  const fhirBundle = exportToAbdmFhirBundle(patient, encounter, history);

  res.json({
    success: true,
    exportTimestamp: new Date().toISOString(),
    format: 'ABDM-FHIR-R4-JSON',
    data: {
      patient,
      history,
      documents,
      timeline,
      fhirBundle,
    }
  });
});
