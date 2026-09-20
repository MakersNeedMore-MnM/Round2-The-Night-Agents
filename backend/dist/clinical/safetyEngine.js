"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRedFlags = evaluateRedFlags;
function evaluateRedFlags(chiefComplaint, answers) {
    const comp = (chiefComplaint || '').toLowerCase();
    const detected = [];
    // 1. Acute Coronary / Cardiopulmonary Red Flag: Chest pain + (Breathlessness or Cold Sweating or Radiation to Arm/Jaw)
    const isChestPain = comp.includes('chest') || comp.includes('seene') || comp.includes('heart') || comp.includes('chhati') || answers['chiefComplaint']?.includes('Chest');
    const associated = answers['historyOfPresentIllness.associatedSymptoms'] || [];
    const radiation = answers['historyOfPresentIllness.radiation'] || [];
    const severity = Number(answers['historyOfPresentIllness.severity'] || 0);
    const hasDyspnea = associated.some((s) => s.toLowerCase().includes('breathless') || s.toLowerCase().includes('dyspnea'));
    const hasDiaphoresis = associated.some((s) => s.toLowerCase().includes('sweat') || s.toLowerCase().includes('cold'));
    const hasDangerousRadiation = radiation.some((r) => r.toLowerCase().includes('arm') || r.toLowerCase().includes('jaw'));
    if (isChestPain && (hasDyspnea || hasDiaphoresis || (hasDangerousRadiation && severity >= 7))) {
        if (hasDyspnea)
            detected.push('Chest pain with acute breathlessness (Dyspnea)');
        if (hasDiaphoresis)
            detected.push('Cold diaphoresis reported');
        if (hasDangerousRadiation)
            detected.push('Radiation to left arm / cervical dermatome');
        return {
            hasRedFlag: true,
            tier: 'RED',
            urgencyTitleEn: 'Priority Medical Evaluation Required',
            urgencyTitleHi: 'तत्काल चिकित्सकीय सहायता की आवश्यकता है',
            patientGuidanceEn: 'Potentially urgent symptoms detected. Please remain seated and seek immediate assessment from our hospital medical staff. A nursing officer has been notified to attend to you.',
            patientGuidanceHi: 'अति-महत्वपूर्ण लक्षण पाए गए हैं। कृपया शांत होकर बैठें और तुरंत हमारे अस्पताल के चिकित्सा कर्मियों से मिलें। एक नर्सिंग अधिकारी को आपकी सहायता के लिए सूचित कर दिया गया है।',
            triageReason: 'Acute chest discomfort associated with respiratory distress / autonomic signs. Requires immediate triage ECG and vital assessment.',
            detectedSymptoms: detected,
            shouldHaltIntake: true,
            staffAlertNeeded: true,
        };
    }
    // 2. High severity alone
    if (isChestPain && severity >= 8) {
        return {
            hasRedFlag: true,
            tier: 'ORANGE',
            urgencyTitleEn: 'High-Priority Clinical Review',
            urgencyTitleHi: 'प्राथमिकता के आधार पर डॉक्टर से जांच आवश्यक',
            patientGuidanceEn: 'Severe pain intensity reported. Our triage team has prioritized your queue position for rapid medical evaluation.',
            patientGuidanceHi: 'अत्यधिक दर्द की तीव्रता दर्ज की गई है। हमारे ट्राइएज स्टाफ ने आपको शीघ्र डॉक्टर से दिखाने के लिए कतार में प्राथमिकता दी है।',
            triageReason: 'Severe chest pain reported (VAS ≥ 8/10). Prioritize in OPD consultation queue.',
            detectedSymptoms: [`Severe pain reported: ${severity}/10`],
            shouldHaltIntake: false,
            staffAlertNeeded: true,
        };
    }
    // 3. Neurological acute signs
    const allText = JSON.stringify(answers).toLowerCase();
    if (allText.includes('facial weakness') || allText.includes('speech difficulty') || allText.includes('loss of consciousness') || allText.includes('behoshi')) {
        return {
            hasRedFlag: true,
            tier: 'RED',
            urgencyTitleEn: 'Immediate Neurological Evaluation Required',
            urgencyTitleHi: 'तुरंत डॉक्टर जांच की आवश्यकता',
            patientGuidanceEn: 'Potentially urgent neurological symptoms reported. Please inform hospital nursing staff immediately.',
            patientGuidanceHi: 'महत्वपूर्ण लक्षण सूचित हुए हैं। कृपया तुरंत उपस्थित अस्पताल कर्मचारियों को बताएं।',
            triageReason: 'Acute focal neurological symptoms or transient alteration in consciousness.',
            detectedSymptoms: ['Acute neurological signs reported'],
            shouldHaltIntake: true,
            staffAlertNeeded: true,
        };
    }
    return {
        hasRedFlag: false,
        tier: 'GREEN',
        urgencyTitleEn: 'Standard Intake Flow',
        urgencyTitleHi: 'सामान्य परामर्श प्रक्रिया',
        patientGuidanceEn: 'No critical red flags detected. Proceeding with pre-consultation clinical history.',
        patientGuidanceHi: 'कोई आपातकालीन लक्षण नहीं पाए गए। सामान्य परामर्श इतिहास प्रक्रिया जारी है।',
        triageReason: 'Routine outpatient presentation.',
        detectedSymptoms: [],
        shouldHaltIntake: false,
        staffAlertNeeded: false,
    };
}
