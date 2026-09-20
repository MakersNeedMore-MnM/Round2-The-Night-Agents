import { Router } from 'express';
import { db } from '../models/database';
import { exportToAbdmFhirBundle } from '../clinical/abdmExporter';

export const physicianRouter = Router();

/**
 * Get Doctor's Patient Queue
 */
physicianRouter.get('/queue', (req, res) => {
  const encountersWithPatients = db.encounters.map((enc) => {
    const patient = db.patients.find((p) => p.id === enc.patientId);
    return {
      ...enc,
      patient,
    };
  });

  const priorityCases = encountersWithPatients.filter((e) => e.priority === 'RED' || e.priority === 'ORANGE');
  const readyCases = encountersWithPatients.filter((e) => e.status === 'READY_FOR_CONSULTATION');
  const incompleteCases = encountersWithPatients.filter((e) => e.status === 'INTAKE_IN_PROGRESS' || e.status === 'QUEUED');

  res.json({
    success: true,
    stats: {
      totalToday: encountersWithPatients.length,
      readyCount: readyCases.length,
      priorityCount: priorityCases.length,
      incompleteCount: incompleteCases.length,
    },
    queue: encountersWithPatients,
    priorityCases,
    readyCases,
    incompleteCases,
  });
});

/**
 * Get 30-Second Clinical Understanding Brief for Encounter
 */
physicianRouter.get('/summary/:encounterId', (req, res) => {
  const encounter = db.encounters.find((e) => e.id === req.params.encounterId) || db.encounters[0];
  const patient = db.patients.find((p) => p.id === encounter.patientId) || db.patients[0];
  let history = db.histories[encounter.id];

  // Fallback to seeded Ramesh Kumar history if not yet started
  if (!history) {
    history = db.histories['enc_ramesh_1'];
  }

  const documents = db.documents.filter((d) => d.patientId === patient.id);
  const timeline = db.timelineEvents.filter((t) => t.patientId === patient.id);

  // Audit Log access
  db.auditLogs.unshift({
    id: `aud_view_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: 'usr_doc_1',
    actorName: 'Dr. Arvind Sharma, MD',
    actorRole: 'DOCTOR',
    action: 'VIEW_30SEC_CLINICAL_BRIEF',
    resource: `Patient ${patient.name} (${patient.uhid})`,
    details: `Accessed pre-consultation clinical summary for Encounter ${encounter.tokenNumber}`,
    ipAddress: '192.168.1.42 (Room 12)',
  });

  res.json({
    success: true,
    patient,
    encounter,
    history,
    documents,
    timeline,
    disclaimer: 'AI-generated draft — physician verification required.',
  });
});

/**
 * Confirm / Edit / Reject Fact in History
 */
physicianRouter.put('/history/:encounterId/confirm-item', (req, res) => {
  const { encounterId } = req.params;
  const { fieldPath, action, editedValue, note } = req.body;

  let history = db.histories[encounterId];
  if (!history) {
    history = db.histories['enc_ramesh_1'];
  }

  // Update target fact
  if (fieldPath === 'chiefComplaint') {
    history.chiefComplaint.provenance.isVerified = action === 'CONFIRM';
    history.chiefComplaint.provenance.verifiedBy = 'Dr. Arvind Sharma, MD';
    if (editedValue) history.chiefComplaint.value = editedValue;
  } else if (fieldPath === 'historyOfPresentIllness') {
    history.historyOfPresentIllness.provenance.isVerified = action === 'CONFIRM';
    history.historyOfPresentIllness.provenance.verifiedBy = 'Dr. Arvind Sharma, MD';
    if (editedValue) Object.assign(history.historyOfPresentIllness.value, editedValue);
  }

  res.json({
    success: true,
    history,
    message: `Clinical fact ${action.toLowerCase()}ed by physician.`,
  });
});

/**
 * Resolve Unresolved Question or Contradiction
 */
physicianRouter.post('/history/:encounterId/resolve-item', (req, res) => {
  const { encounterId } = req.params;
  const { itemId, itemType, resolutionNote } = req.body;

  let history = db.histories[encounterId] || db.histories['enc_ramesh_1'];

  if (itemType === 'CONTRADICTION') {
    const item = history.contradictions.find((c) => c.id === itemId);
    if (item) {
      item.status = 'RESOLVED';
      item.resolutionNote = resolutionNote || 'Physician clarified with patient during clinical interview.';
    }
  } else if (itemType === 'UNRESOLVED') {
    const item = history.unresolvedQuestions.find((q) => q.id === itemId);
    if (item) {
      item.status = 'RESOLVED';
    }
  }

  res.json({
    success: true,
    history,
    message: 'Item marked as resolved by physician.',
  });
});

/**
 * Add Clinical Note & Finalize Record
 */
physicianRouter.post('/encounter/:encounterId/finalize', (req, res) => {
  const { encounterId } = req.params;
  const { physicianNote } = req.body;

  const encounter = db.encounters.find((e) => e.id === encounterId) || db.encounters[0];
  const patient = db.patients.find((p) => p.id === encounter.patientId) || db.patients[0];
  let history = db.histories[encounter.id] || db.histories['enc_ramesh_1'];

  history.isPhysicianConfirmed = true;
  history.confirmedAt = new Date().toISOString();
  history.confirmedBy = 'Dr. Arvind Sharma, MD';
  history.physicianNotes = physicianNote || 'Consultation completed. Pre-consultation clinical story validated and approved.';

  encounter.status = 'COMPLETED';

  // Export to ABDM FHIR Bundle
  const fhirBundle = exportToAbdmFhirBundle(patient, encounter, history);

  // Add final audit log
  db.auditLogs.unshift({
    id: `aud_fin_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: 'usr_doc_1',
    actorName: 'Dr. Arvind Sharma, MD',
    actorRole: 'DOCTOR',
    action: 'CLINICAL_INTAKE_FINALIZED',
    resource: `Encounter ${encounter.tokenNumber}`,
    details: `Doctor approved final intake and generated ABDM FHIR bundle: ${fhirBundle.id}`,
    ipAddress: '192.168.1.42',
  });

  res.json({
    success: true,
    encounter,
    history,
    fhirBundle,
    message: 'Encounter finalized. ABDM / FHIR-Ready Bundle generated.',
  });
});

/**
 * Get ABDM FHIR Bundle JSON
 */
physicianRouter.get('/encounter/:encounterId/fhir-bundle', (req, res) => {
  const { encounterId } = req.params;
  const encounter = db.encounters.find((e) => e.id === encounterId) || db.encounters[0];
  const patient = db.patients.find((p) => p.id === encounter.patientId) || db.patients[0];
  const history = db.histories[encounter.id] || db.histories['enc_ramesh_1'];

  const fhirBundle = exportToAbdmFhirBundle(patient, encounter, history);

  res.json({
    success: true,
    fhirBundle,
  });
});
