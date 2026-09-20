"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.physicianRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
const abdmExporter_1 = require("../clinical/abdmExporter");
exports.physicianRouter = (0, express_1.Router)();
/**
 * Get Doctor's Patient Queue
 */
exports.physicianRouter.get('/queue', (req, res) => {
    const encountersWithPatients = database_1.db.encounters.map((enc) => {
        const patient = database_1.db.patients.find((p) => p.id === enc.patientId);
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
exports.physicianRouter.get('/summary/:encounterId', (req, res) => {
    const encounter = database_1.db.encounters.find((e) => e.id === req.params.encounterId) || database_1.db.encounters[0];
    const patient = database_1.db.patients.find((p) => p.id === encounter.patientId) || database_1.db.patients[0];
    let history = database_1.db.histories[encounter.id];
    // Fallback to seeded Ramesh Kumar history if not yet started
    if (!history) {
        history = database_1.db.histories['enc_ramesh_1'];
    }
    const documents = database_1.db.documents.filter((d) => d.patientId === patient.id);
    const timeline = database_1.db.timelineEvents.filter((t) => t.patientId === patient.id);
    // Audit Log access
    database_1.db.auditLogs.unshift({
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
exports.physicianRouter.put('/history/:encounterId/confirm-item', (req, res) => {
    const { encounterId } = req.params;
    const { fieldPath, action, editedValue, note } = req.body;
    let history = database_1.db.histories[encounterId];
    if (!history) {
        history = database_1.db.histories['enc_ramesh_1'];
    }
    // Update target fact
    if (fieldPath === 'chiefComplaint') {
        history.chiefComplaint.provenance.isVerified = action === 'CONFIRM';
        history.chiefComplaint.provenance.verifiedBy = 'Dr. Arvind Sharma, MD';
        if (editedValue)
            history.chiefComplaint.value = editedValue;
    }
    else if (fieldPath === 'historyOfPresentIllness') {
        history.historyOfPresentIllness.provenance.isVerified = action === 'CONFIRM';
        history.historyOfPresentIllness.provenance.verifiedBy = 'Dr. Arvind Sharma, MD';
        if (editedValue)
            Object.assign(history.historyOfPresentIllness.value, editedValue);
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
exports.physicianRouter.post('/history/:encounterId/resolve-item', (req, res) => {
    const { encounterId } = req.params;
    const { itemId, itemType, resolutionNote } = req.body;
    let history = database_1.db.histories[encounterId] || database_1.db.histories['enc_ramesh_1'];
    if (itemType === 'CONTRADICTION') {
        const item = history.contradictions.find((c) => c.id === itemId);
        if (item) {
            item.status = 'RESOLVED';
            item.resolutionNote = resolutionNote || 'Physician clarified with patient during clinical interview.';
        }
    }
    else if (itemType === 'UNRESOLVED') {
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
exports.physicianRouter.post('/encounter/:encounterId/finalize', (req, res) => {
    const { encounterId } = req.params;
    const { physicianNote } = req.body;
    const encounter = database_1.db.encounters.find((e) => e.id === encounterId) || database_1.db.encounters[0];
    const patient = database_1.db.patients.find((p) => p.id === encounter.patientId) || database_1.db.patients[0];
    let history = database_1.db.histories[encounter.id] || database_1.db.histories['enc_ramesh_1'];
    history.isPhysicianConfirmed = true;
    history.confirmedAt = new Date().toISOString();
    history.confirmedBy = 'Dr. Arvind Sharma, MD';
    history.physicianNotes = physicianNote || 'Consultation completed. Pre-consultation clinical story validated and approved.';
    encounter.status = 'COMPLETED';
    // Export to ABDM FHIR Bundle
    const fhirBundle = (0, abdmExporter_1.exportToAbdmFhirBundle)(patient, encounter, history);
    // Add final audit log
    database_1.db.auditLogs.unshift({
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
exports.physicianRouter.get('/encounter/:encounterId/fhir-bundle', (req, res) => {
    const { encounterId } = req.params;
    const encounter = database_1.db.encounters.find((e) => e.id === encounterId) || database_1.db.encounters[0];
    const patient = database_1.db.patients.find((p) => p.id === encounter.patientId) || database_1.db.patients[0];
    const history = database_1.db.histories[encounter.id] || database_1.db.histories['enc_ramesh_1'];
    const fhirBundle = (0, abdmExporter_1.exportToAbdmFhirBundle)(patient, encounter, history);
    res.json({
        success: true,
        fhirBundle,
    });
});
