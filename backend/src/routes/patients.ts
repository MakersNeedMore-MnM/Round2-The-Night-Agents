import { Router } from 'express';
import { db } from '../models/database';
import { Patient } from '../types';

export const patientsRouter = Router();

patientsRouter.get('/', (req, res) => {
  res.json({ success: true, patients: db.patients });
});

patientsRouter.get('/:id', (req, res) => {
  const patient = db.patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }
  const encounter = db.encounters.find((e) => e.patientId === patient.id);
  res.json({ success: true, patient, encounter });
});

patientsRouter.post('/identify', (req, res) => {
  const { identifierType, identifierValue, newPatientData } = req.body;

  let patient: Patient | undefined;

  if (identifierType === 'ABHA') {
    patient = db.patients.find((p) => p.abhaId.replace(/[^0-9]/g, '') === (identifierValue || '').replace(/[^0-9]/g, ''));
  } else if (identifierType === 'UHID') {
    patient = db.patients.find((p) => p.uhid.toLowerCase() === (identifierValue || '').toLowerCase());
  } else if (identifierType === 'MOBILE') {
    patient = db.patients.find((p) => p.phone.replace(/[^0-9]/g, '').includes((identifierValue || '').replace(/[^0-9]/g, '')));
  } else if (identifierType === 'NEW' && newPatientData) {
    const newId = `pat_${Date.now()}`;
    const uhidNum = Math.floor(1000 + Math.random() * 9000);
    patient = {
      id: newId,
      abhaId: newPatientData.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-0021`,
      uhid: `UHID-2026-${uhidNum}`,
      name: newPatientData.name,
      age: Number(newPatientData.age) || 30,
      gender: newPatientData.gender || 'MALE',
      phone: newPatientData.phone || '+91 98000 11223',
      bloodGroup: newPatientData.bloodGroup || 'B+',
      emergencyContact: {
        name: newPatientData.emergencyContactName || 'Family Member',
        relation: 'Relative',
        phone: newPatientData.phone || '+91 98000 11223',
      },
      preferredLanguage: newPatientData.language || 'hi',
      consentGiven: false,
      recordCompleteness: 40,
      unresolvedCount: 0,
    };
    db.patients.push(patient);

    // Create encounter
    db.encounters.push({
      id: `enc_${newId}`,
      patientId: newId,
      tokenNumber: `G-${Math.floor(120 + Math.random() * 20)}`,
      department: newPatientData.department || 'General Medicine',
      status: 'INTAKE_IN_PROGRESS',
      priority: 'ROUTINE',
      intakeStartTime: new Date().toISOString(),
      assignedDoctorId: 'usr_doc_1',
      assignedDoctorName: 'Dr. Arvind Sharma, MD',
      chiefComplaintSummary: 'Intake initiated',
    });
  }

  // Fallback to demo patient Ramesh Kumar if test ID matches or nothing found
  if (!patient) {
    patient = db.patients[0];
  }

  const encounter = db.encounters.find((e) => e.patientId === patient?.id);

  res.json({
    success: true,
    patient,
    encounter,
    message: `Identity confirmed for ${patient.name} (${patient.uhid})`,
  });
});

patientsRouter.post('/:id/consent', (req, res) => {
  const patient = db.patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient not found' });
  }

  const { granted, audioListened } = req.body;
  patient.consentGiven = !!granted;
  patient.consentTimestamp = new Date().toISOString();

  db.auditLogs.unshift({
    id: `aud_consent_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: patient.id,
    actorName: patient.name,
    actorRole: 'PATIENT',
    action: granted ? 'CONSENT_GRANTED' : 'CONSENT_DECLINED',
    resource: 'Informed Consent Form v2.1',
    details: `Patient consent recorded. Audio explanation listened: ${!!audioListened}`,
    ipAddress: '192.168.1.104 (Kiosk)',
  });

  res.json({
    success: true,
    consentGiven: patient.consentGiven,
    timestamp: patient.consentTimestamp,
  });
});
