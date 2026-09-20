"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
const abdmExporter_1 = require("../clinical/abdmExporter");
exports.privacyRouter = (0, express_1.Router)();
exports.privacyRouter.get('/logs/:patientId', (req, res) => {
    const patient = database_1.db.patients.find((p) => p.id === req.params.patientId) || database_1.db.patients[0];
    const logs = database_1.db.auditLogs.filter((l) => l.actorId === patient.id || l.resource.includes(patient.name) || l.resource.includes(patient.uhid));
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
exports.privacyRouter.post('/withdraw-consent/:patientId', (req, res) => {
    const patient = database_1.db.patients.find((p) => p.id === req.params.patientId);
    if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    patient.consentGiven = false;
    database_1.db.auditLogs.unshift({
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
exports.privacyRouter.get('/export-data/:patientId', (req, res) => {
    const patient = database_1.db.patients.find((p) => p.id === req.params.patientId) || database_1.db.patients[0];
    const encounter = database_1.db.encounters.find((e) => e.patientId === patient.id) || database_1.db.encounters[0];
    const history = database_1.db.histories[encounter.id] || database_1.db.histories['enc_ramesh_1'];
    const documents = database_1.db.documents.filter((d) => d.patientId === patient.id);
    const timeline = database_1.db.timelineEvents.filter((t) => t.patientId === patient.id);
    const fhirBundle = (0, abdmExporter_1.exportToAbdmFhirBundle)(patient, encounter, history);
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
