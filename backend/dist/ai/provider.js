"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiProvider = exports.AiProviderService = void 0;
const ontology_1 = require("../clinical/ontology");
class AiProviderService {
    config;
    constructor() {
        this.config = {
            useMock: !process.env.AI_API_KEY,
            apiKey: process.env.AI_API_KEY,
            asrEndpoint: process.env.ASR_ENDPOINT,
            ttsEndpoint: process.env.TTS_ENDPOINT,
        };
    }
    /**
     * Speech-To-Text (ASR)
     */
    async transcribeSpeech(audioData, language = 'hi') {
        // If running in demo mode or without external ASR, provide realistic transcript
        if (this.config.useMock) {
            if (language === 'hi') {
                return {
                    transcript: 'मेरे सीने में दर्द है और सांस लेने में तकलीफ हो रही है।',
                    detectedLanguage: 'hi',
                    confidence: 0.94,
                };
            }
            return {
                transcript: 'I have severe chest pain and breathlessness since 2 days.',
                detectedLanguage: 'en',
                confidence: 0.96,
            };
        }
        // Extensible hook for Bhashini / Whisper / Cloud Speech API
        return {
            transcript: 'Transcribed text from live provider',
            detectedLanguage: language,
            confidence: 0.9,
        };
    }
    /**
     * Text-To-Speech (TTS)
     */
    async synthesizeSpeech(text, language = 'hi') {
        // In demo / browser mode, Web Speech API or base64 audio handles playback seamlessly
        return {
            audioUrl: '', // Client-side Web Speech Synthesis is used for instant zero-latency speech
            format: 'speechSynthesis-compatible',
        };
    }
    /**
     * Language Detection & Normalization
     */
    async detectLanguage(text) {
        const hindiPattern = /[\u0900-\u097F]/;
        const tamilPattern = /[\u0B80-\u0BFF]/;
        const teluguPattern = /[\u0C00-\u0C7F]/;
        const bengaliPattern = /[\u0980-\u09FF]/;
        if (hindiPattern.test(text))
            return 'hi';
        if (tamilPattern.test(text))
            return 'ta';
        if (teluguPattern.test(text))
            return 'te';
        if (bengaliPattern.test(text))
            return 'bn';
        return 'en';
    }
    /**
     * Clinical Entity Extraction from Patient Free-form Voice/Text
     */
    async extractClinicalEntities(rawInput, language = 'en') {
        const lower = rawInput.toLowerCase();
        // Check for chest pain
        if (lower.includes('chest') ||
            lower.includes('seene') ||
            lower.includes('chhati') ||
            lower.includes('seena') ||
            lower.includes('heart') ||
            lower.includes('dard')) {
            return {
                chiefComplaint: 'Chest Pain / Discomfort (सीने में दर्द)',
                complaintKey: 'CHEST_PAIN',
                entities: {
                    symptom: 'Retrosternal Chest Pain',
                    duration: lower.includes('2') || lower.includes('do din') ? '2 days' : 'Acute',
                    urgencyIndicator: lower.includes('saans') || lower.includes('breath') ? 'Associated Dyspnea' : 'Uncomplicated',
                },
                suggestedPathway: 'CHEST_PAIN',
            };
        }
        // Check for AYUSH / digestion
        if (lower.includes('ayurveda') ||
            lower.includes('paachan') ||
            lower.includes('gas') ||
            lower.includes('pitta') ||
            lower.includes('acidity') ||
            lower.includes('indigestion')) {
            return {
                chiefComplaint: 'Chronic Indigestion & Acidity (Amlapitta / अग्नि विकार)',
                complaintKey: 'AYUSH_AYURVEDA',
                entities: {
                    symptom: 'Amlapitta / Acidity',
                    duration: 'Chronic',
                },
                suggestedPathway: 'AYUSH_AYURVEDA',
            };
        }
        // Default general medicine intake
        return {
            chiefComplaint: rawInput.trim() || 'General Health Consultation',
            complaintKey: 'CHEST_PAIN',
            entities: {
                raw: rawInput,
            },
            suggestedPathway: 'CHEST_PAIN',
        };
    }
    /**
     * Document Classification (Prescription, Lab Report, Discharge Summary, etc.)
     */
    async classifyDocument(fileContentOrName) {
        const lower = fileContentOrName.toLowerCase();
        if (lower.includes('lab') || lower.includes('blood') || lower.includes('hba1c') || lower.includes('report')) {
            return {
                docType: 'LAB_REPORT',
                confidence: 97,
                facilityGuess: 'Apollo Diagnostics / City Central Pathology',
            };
        }
        if (lower.includes('discharge') || lower.includes('summary')) {
            return {
                docType: 'DISCHARGE_SUMMARY',
                confidence: 94,
                facilityGuess: 'Civil Hospital / AIIMS OPD',
            };
        }
        // Default prescription
        return {
            docType: 'PRESCRIPTION',
            confidence: 96,
            facilityGuess: 'District Hospital OPD Clinic',
        };
    }
    /**
     * OCR & Clinical Extraction
     * Structured extraction with confidence metrics & human-in-the-loop validation
     */
    async ocrDocument(fileName, fileType) {
        const isLab = fileName.toLowerCase().includes('lab') || fileName.toLowerCase().includes('blood') || fileName.toLowerCase().includes('report');
        if (isLab) {
            return {
                ocrConfidence: 94,
                qualityAssessment: 'GOOD',
                extractions: {
                    medications: [],
                    labValues: [
                        {
                            testName: 'HbA1c (Glycosylated Hemoglobin)',
                            result: '7.8',
                            unit: '%',
                            referenceRange: '< 5.7 Normal, 5.7 - 6.4 Prediabetes, ≥ 6.5 Diabetes',
                            isAbnormal: true,
                            confidence: 98,
                            status: 'PENDING',
                        },
                        {
                            testName: 'Serum Creatinine',
                            result: '1.4',
                            unit: 'mg/dL',
                            referenceRange: '0.7 - 1.2 mg/dL',
                            isAbnormal: true,
                            confidence: 92,
                            status: 'PENDING',
                        },
                        {
                            testName: 'Hemoglobin (Hb)',
                            result: '9.8',
                            unit: 'g/dL',
                            referenceRange: '13.0 - 17.0 g/dL',
                            isAbnormal: true,
                            confidence: 96,
                            status: 'PENDING',
                        },
                        {
                            testName: 'Fasting Blood Sugar (FBS)',
                            result: '142',
                            unit: 'mg/dL',
                            referenceRange: '70 - 99 mg/dL',
                            isAbnormal: true,
                            confidence: 95,
                            status: 'PENDING',
                        }
                    ],
                    diagnoses: ['Uncontrolled Diabetes Mellitus Type 2', 'Mild Renal Impairment', 'Mild Anemia'],
                },
                rawOcrSnippet: `PATIENT REPORT: Ramesh Kumar, 52/M
TEST RESULTS:
- HbA1c: 7.8 % [HIGH] Ref: 4.0-5.6
- Serum Creatinine: 1.4 mg/dL [BORDERLINE HIGH] Ref: 0.7-1.2
- Hemoglobin: 9.8 g/dL [LOW] Ref: 13.0-17.0
- Fasting Blood Sugar: 142 mg/dL [HIGH] Ref: 70-99`,
            };
        }
        // Prescription OCR extraction
        return {
            ocrConfidence: 96,
            qualityAssessment: 'GOOD',
            extractions: {
                medications: [
                    {
                        name: 'Tab. Metformin Hydrochloride',
                        dosage: '500 mg',
                        frequency: 'Twice daily (BD), after meals',
                        confidence: 97,
                        status: 'PENDING',
                    },
                    {
                        name: 'Tab. Amlodipine Besylate',
                        dosage: '5 mg',
                        frequency: 'Once daily (OD), morning',
                        confidence: 94,
                        status: 'PENDING',
                    },
                    {
                        name: 'Tab. Atorvastatin',
                        dosage: '10 mg',
                        frequency: 'Once daily (OD), at bedtime',
                        confidence: 89,
                        status: 'PENDING',
                    }
                ],
                labValues: [],
                diagnoses: ['Essential Hypertension', 'Type 2 Diabetes Mellitus'],
            },
            rawOcrSnippet: `DISTRICT HOSPITAL OPD
Rx
1. Tab. Metformin 500mg - 1 Tab BD x 1 month
2. Tab. Amlodipine 5mg - 1 Tab OD Morning x 1 month
3. Tab. Atorvastatin 10mg - 1 Tab HS x 1 month
Advice: Monitor BP and blood glucose weekly.`,
        };
    }
    /**
     * Adaptive Question Generator from JSON Ontology
     */
    getNextClinicalQuestion(pathwayKey, answersSoFar, lastQuestionId) {
        const pathway = pathwayKey === 'AYUSH_AYURVEDA' ? ontology_1.AYUSH_AYURVEDA_PATHWAY : ontology_1.CHEST_PAIN_PATHWAY;
        if (!lastQuestionId) {
            return pathway.questions[pathway.initialQuestionId] || null;
        }
        const nextId = pathway.nextQuestionLogic(answersSoFar, lastQuestionId);
        if (!nextId || !pathway.questions[nextId]) {
            return null; // All structured questions completed
        }
        return pathway.questions[nextId];
    }
}
exports.AiProviderService = AiProviderService;
exports.aiProvider = new AiProviderService();
