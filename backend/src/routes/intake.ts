import { Router } from 'express';
import { db } from '../models/database';
import { aiProvider } from '../ai/provider';
import { evaluateRedFlags } from '../clinical/safetyEngine';
import { detectContradictions } from '../clinical/contradictionEngine';

export const intakeRouter = Router();

// Store ongoing in-memory interview sessions by encounterId
const activeIntakeSessions: Record<string, {
  pathwayKey: string;
  answers: Record<string, any>;
  lastQuestionId?: string;
}> = {};

/**
 * Process Chief Complaint (Voice or Text)
 */
intakeRouter.post('/chief-complaint', async (req, res) => {
  const { encounterId, patientId, rawInput, language } = req.body;

  const extraction = await aiProvider.extractClinicalEntities(rawInput || '', language || 'hi');

  let encounter = db.encounters.find((e) => e.id === encounterId);
  if (!encounter) {
    encounter = db.encounters[0];
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
  const firstQuestion = aiProvider.getNextClinicalQuestion(extraction.suggestedPathway, {});

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
intakeRouter.post('/question/next', (req, res) => {
  const { encounterId, lastQuestionId } = req.body;
  const session = activeIntakeSessions[encounterId] || {
    pathwayKey: 'CHEST_PAIN',
    answers: {},
  };

  const nextQuestion = aiProvider.getNextClinicalQuestion(
    session.pathwayKey,
    session.answers,
    lastQuestionId
  );

  res.json({
    success: true,
    nextQuestion,
    isComplete: !nextQuestion,
  });
});

/**
 * Submit Clinical Answer & Evaluate Red-Flags
 */
intakeRouter.post('/question/answer', (req, res) => {
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
  const redFlagAssessment = evaluateRedFlags(session.answers['chiefComplaint'] || '', session.answers);

  // If Red Flag detected, update encounter priority and dispatch triage alert if active
  const encounter = db.encounters.find((e) => e.id === encounterId) || db.encounters[0];
  if (redFlagAssessment.hasRedFlag) {
    encounter.priority = redFlagAssessment.tier === 'GREEN' ? 'ROUTINE' : redFlagAssessment.tier;
    if (redFlagAssessment.shouldHaltIntake) {
      encounter.status = 'PRIORITY_ESCALATED';
    }

    // Check if alert already exists for this encounter
    const existingAlert = db.triageAlerts.find((a) => a.encounterId === encounter.id);
    if (!existingAlert) {
      const newAlert = {
        id: `trg_${Date.now()}`,
        encounterId: encounter.id,
        patientId: encounter.patientId,
        patientName: db.patients.find((p) => p.id === encounter.patientId)?.name || 'Patient',
        age: 52,
        gender: 'Male',
        tokenNumber: encounter.tokenNumber,
        priority: redFlagAssessment.tier,
        department: encounter.department,
        detectedAt: new Date().toISOString(),
        triggerSymptoms: redFlagAssessment.detectedSymptoms,
        reason: redFlagAssessment.triageReason,
        status: 'ACTIVE' as const,
      };
      db.triageAlerts.unshift(newAlert);

      // Create notification
      db.notifications.unshift({
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
  const contradictions = detectContradictions(session.answers, {
    knownAllergies: ['Penicillin / Amoxicillin allergy'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
  });

  // Get Next Question
  const nextQuestion = redFlagAssessment.shouldHaltIntake 
    ? null 
    : aiProvider.getNextClinicalQuestion(session.pathwayKey, session.answers, questionId);

  res.json({
    success: true,
    redFlagAssessment,
    contradictions,
    nextQuestion,
    isComplete: !nextQuestion || redFlagAssessment.shouldHaltIntake,
  });
});
