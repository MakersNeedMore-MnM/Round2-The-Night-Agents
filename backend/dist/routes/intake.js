"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intakeRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
const provider_1 = require("../ai/provider");
const safetyEngine_1 = require("../clinical/safetyEngine");
const contradictionEngine_1 = require("../clinical/contradictionEngine");
exports.intakeRouter = (0, express_1.Router)();
// Store ongoing in-memory interview sessions by encounterId
const activeIntakeSessions = {};
/**
 * Process Chief Complaint (Voice or Text)
 */
exports.intakeRouter.post('/chief-complaint', async (req, res) => {
    const { encounterId, patientId, rawInput, language } = req.body;
    const extraction = await provider_1.aiProvider.extractClinicalEntities(rawInput || '', language || 'hi');
    let encounter = database_1.db.encounters.find((e) => e.id === encounterId);
    if (!encounter) {
        encounter = database_1.db.encounters[0];
    }
    encounter.status = 'INTAKE_IN_PROGRESS';
    encounter.chiefComplaintSummary = extraction.chiefComplaint;
    // Initialize intake session
    activeIntakeSessions[encounter.id] = {
        pathwayKey: extraction.suggestedPathway,
        answers: {
            chiefComplaint: extraction.chiefComplaint,
        },
        lastQuestionId: undefined,
    };
    // Get initial approved clinical question
    const firstQuestion = provider_1.aiProvider.getNextClinicalQuestion(extraction.suggestedPathway, {});
    res.json({
        success: true,
        extraction,
        nextQuestion: firstQuestion,
        encounter,
    });
});
/**
 * Get Next Approved Clinical Question
 */
exports.intakeRouter.post('/question/next', (req, res) => {
    const { encounterId, lastQuestionId } = req.body;
    const session = activeIntakeSessions[encounterId] || {
        pathwayKey: 'CHEST_PAIN',
        answers: {},
    };
    const nextQuestion = provider_1.aiProvider.getNextClinicalQuestion(session.pathwayKey, session.answers, lastQuestionId);
    res.json({
        success: true,
        nextQuestion,
        isComplete: !nextQuestion,
    });
});
/**
 * Submit Clinical Answer & Evaluate Red-Flags
 */
exports.intakeRouter.post('/question/answer', (req, res) => {
    const { encounterId, patientId, questionId, targetField, answerValue, skipped, unsure } = req.body;
    let session = activeIntakeSessions[encounterId];
    if (!session) {
        session = {
            pathwayKey: 'CHEST_PAIN',
            answers: {},
        };
        activeIntakeSessions[encounterId] = session;
    }
    session.lastQuestionId = questionId;
    session.answers[targetField] = skipped ? 'Skipped by patient' : unsure ? 'Patient unsure' : answerValue;
    // Evaluate Safety Red Flags
    const redFlagAssessment = (0, safetyEngine_1.evaluateRedFlags)(session.answers['chiefComplaint'] || '', session.answers);
    // If Red Flag detected, update encounter priority and dispatch triage alert if active
    const encounter = database_1.db.encounters.find((e) => e.id === encounterId) || database_1.db.encounters[0];
    if (redFlagAssessment.hasRedFlag) {
        encounter.priority = redFlagAssessment.tier === 'GREEN' ? 'ROUTINE' : redFlagAssessment.tier;
        if (redFlagAssessment.shouldHaltIntake) {
            encounter.status = 'PRIORITY_ESCALATED';
        }
        // Check if alert already exists for this encounter
        const existingAlert = database_1.db.triageAlerts.find((a) => a.encounterId === encounter.id);
        if (!existingAlert) {
            const newAlert = {
                id: `trg_${Date.now()}`,
                encounterId: encounter.id,
                patientId: encounter.patientId,
                patientName: database_1.db.patients.find((p) => p.id === encounter.patientId)?.name || 'Patient',
                age: 52,
                gender: 'Male',
                tokenNumber: encounter.tokenNumber,
                priority: redFlagAssessment.tier,
                department: encounter.department,
                detectedAt: new Date().toISOString(),
                triggerSymptoms: redFlagAssessment.detectedSymptoms,
                reason: redFlagAssessment.triageReason,
                status: 'ACTIVE',
            };
            database_1.db.triageAlerts.unshift(newAlert);
            // Create notification
            database_1.db.notifications.unshift({
                id: `notif_${Date.now()}`,
                targetRole: 'DOCTOR',
                title: `Priority Alert: Token ${encounter.tokenNumber}`,
                message: redFlagAssessment.triageReason,
                timestamp: new Date().toISOString(),
                isRead: false,
                priority: 'RED',
                link: `/physician/${encounter.id}`,
            });
        }
    }
    // Detect Contradictions against historical record
    const contradictions = (0, contradictionEngine_1.detectContradictions)(session.answers, {
        knownAllergies: ['Penicillin / Amoxicillin allergy'],
        chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    });
    // Get Next Question
    const nextQuestion = redFlagAssessment.shouldHaltIntake
        ? null
        : provider_1.aiProvider.getNextClinicalQuestion(session.pathwayKey, session.answers, questionId);
    res.json({
        success: true,
        redFlagAssessment,
        contradictions,
        nextQuestion,
        isComplete: !nextQuestion || redFlagAssessment.shouldHaltIntake,
    });
});
