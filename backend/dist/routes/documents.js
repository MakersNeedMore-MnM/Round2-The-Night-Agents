"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
const provider_1 = require("../ai/provider");
exports.documentsRouter = (0, express_1.Router)();
exports.documentsRouter.get('/patient/:patientId', (req, res) => {
    const docs = database_1.db.documents.filter((d) => d.patientId === req.params.patientId);
    res.json({ success: true, documents: docs });
});
/**
 * Upload & Process Document with OCR Extraction
 */
exports.documentsRouter.post('/upload-and-ocr', async (req, res) => {
    const { patientId, fileName, fileType, simulationType } = req.body;
    const resolvedFileName = fileName || (simulationType === 'LAB' ? 'Apollo_Blood_Report_Aug2026.pdf' : 'Hospital_OPD_Prescription.pdf');
    const resolvedType = fileType || (simulationType === 'LAB' ? 'LAB_REPORT' : 'PRESCRIPTION');
    // 1. Classification & OCR
    const classification = await provider_1.aiProvider.classifyDocument(resolvedFileName);
    const ocrResult = await provider_1.aiProvider.ocrDocument(resolvedFileName, resolvedType);
    const newDocId = `doc_${Date.now()}`;
    const newDoc = {
        id: newDocId,
        patientId: patientId || 'pat_ramesh_1',
        title: resolvedType === 'LAB_REPORT' ? 'Complete Metabolic & Blood Test Report' : 'Physician OPD Prescription',
        docType: resolvedType,
        uploadedAt: new Date().toISOString(),
        facilityName: classification.facilityGuess,
        documentDate: '14 Aug 2026',
        fileUrl: `/sample-docs/${resolvedFileName}`,
        status: 'NEEDS_REVIEW',
        ocrConfidence: ocrResult.ocrConfidence,
        extractions: ocrResult.extractions,
    };
    database_1.db.documents.unshift(newDoc);
    // Add timeline event
    const newTimelineEvent = {
        id: `tl_${Date.now()}`,
        patientId: newDoc.patientId,
        date: newDoc.documentDate,
        type: newDoc.docType === 'LAB_REPORT' ? 'LAB_REPORT' : 'MEDICATION',
        title: newDoc.title,
        subtitle: `${classification.facilityGuess} (Confidence: ${newDoc.ocrConfidence}%)`,
        facility: classification.facilityGuess,
        tags: ['OCR Extracted', 'Requires Review'],
        sourceDocumentId: newDocId,
    };
    database_1.db.timelineEvents.unshift(newTimelineEvent);
    // Audit Log
    database_1.db.auditLogs.unshift({
        id: `aud_doc_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: newDoc.patientId,
        actorName: 'Patient / Kiosk Scanner',
        actorRole: 'PATIENT',
        action: 'DOCUMENT_SCANNED_OCR',
        resource: newDoc.title,
        details: `Processed ${resolvedFileName}. Extracted ${newDoc.extractions.medications?.length || 0} medications, ${newDoc.extractions.labValues?.length || 0} lab values.`,
        ipAddress: '192.168.1.104 (Kiosk #3)',
    });
    res.json({
        success: true,
        document: newDoc,
        ocrSnippet: ocrResult.rawOcrSnippet,
        message: 'Document analyzed and entities extracted with confidence metrics',
    });
});
/**
 * Confirm / Edit / Reject Extracted Entity
 */
exports.documentsRouter.post('/:docId/extraction-action', (req, res) => {
    const { docId } = req.params;
    const { itemType, itemIndex, action, editedValue } = req.body;
    const doc = database_1.db.documents.find((d) => d.id === docId);
    if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found' });
    }
    if (itemType === 'MEDICATION' && doc.extractions.medications && doc.extractions.medications[itemIndex]) {
        const med = doc.extractions.medications[itemIndex];
        if (action === 'CONFIRM') {
            med.status = 'CONFIRMED';
        }
        else if (action === 'REJECT') {
            med.status = 'REJECTED';
        }
        else if (action === 'EDIT' && editedValue) {
            med.name = editedValue.name || med.name;
            med.dosage = editedValue.dosage || med.dosage;
            med.frequency = editedValue.frequency || med.frequency;
            med.status = 'CONFIRMED';
        }
    }
    else if (itemType === 'LAB' && doc.extractions.labValues && doc.extractions.labValues[itemIndex]) {
        const lab = doc.extractions.labValues[itemIndex];
        if (action === 'CONFIRM') {
            lab.status = 'CONFIRMED';
        }
        else if (action === 'REJECT') {
            lab.status = 'REJECTED';
        }
        else if (action === 'EDIT' && editedValue) {
            lab.result = editedValue.result || lab.result;
            lab.unit = editedValue.unit || lab.unit;
            lab.status = 'CONFIRMED';
        }
    }
    // If all extractions confirmed, set status to PROCESSED
    const allMedsOk = (doc.extractions.medications || []).every((m) => m.status !== 'PENDING');
    const allLabsOk = (doc.extractions.labValues || []).every((l) => l.status !== 'PENDING');
    if (allMedsOk && allLabsOk) {
        doc.status = 'PROCESSED';
    }
    res.json({
        success: true,
        document: doc,
        message: `Extraction ${action.toLowerCase()}ed successfully.`,
    });
});
