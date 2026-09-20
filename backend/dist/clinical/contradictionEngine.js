"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectContradictions = detectContradictions;
function detectContradictions(currentAnswers, patientHistoricalSummary) {
    const contradictions = [];
    // 1. Allergy Contradiction Check
    const currentAllergies = currentAnswers['allergyHistory'] || currentAnswers['cp_allergies'] || [];
    const reportedNoAllergy = (typeof currentAllergies === 'string' && currentAllergies.toLowerCase().includes('no known')) ||
        (Array.isArray(currentAllergies) && currentAllergies.some((a) => typeof a === 'string' && a.toLowerCase().includes('no known')));
    if (reportedNoAllergy && patientHistoricalSummary.knownAllergies && patientHistoricalSummary.knownAllergies.length > 0) {
        contradictions.push({
            id: `conflict_allergy_${Date.now()}`,
            topic: 'Allergy Record Mismatch',
            pastRecordValue: patientHistoricalSummary.knownAllergies.join(', '),
            currentInputValue: 'Patient reported "No known allergies" today',
            sourceDescription: 'EMR Archive / Discharge Summary (dated 14-Aug-2025)',
            severity: 'HIGH',
            status: 'PENDING_PHYSICIAN_REVIEW',
        });
    }
    // 2. Medication / Chronic Disease Check
    const currentConditions = currentAnswers['pastMedicalHistory'] || currentAnswers['cp_past_conditions'] || [];
    const reportedNoChronic = (typeof currentConditions === 'string' && currentConditions.toLowerCase().includes('no known')) ||
        (Array.isArray(currentConditions) && currentConditions.some((c) => typeof c === 'string' && c.toLowerCase().includes('no known')));
    if (reportedNoChronic && patientHistoricalSummary.chronicConditions && patientHistoricalSummary.chronicConditions.length > 0) {
        contradictions.push({
            id: `conflict_condition_${Date.now()}`,
            topic: 'Chronic Condition Disclosure Mismatch',
            pastRecordValue: patientHistoricalSummary.chronicConditions.join(', '),
            currentInputValue: 'Patient indicated no chronic diseases',
            sourceDescription: 'Hospital Lab Records & Previous OPD prescription',
            severity: 'MEDIUM',
            status: 'PENDING_PHYSICIAN_REVIEW',
        });
    }
    return contradictions;
}
