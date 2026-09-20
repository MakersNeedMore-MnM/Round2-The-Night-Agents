"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ayushRouter = void 0;
const express_1 = require("express");
const database_1 = require("../models/database");
const ontology_1 = require("../clinical/ontology");
exports.ayushRouter = (0, express_1.Router)();
exports.ayushRouter.get('/pathway', (req, res) => {
    res.json({
        success: true,
        pathway: ontology_1.AYUSH_AYURVEDA_PATHWAY,
    });
});
exports.ayushRouter.get('/assessment/:patientId', (req, res) => {
    const assessment = database_1.db.ayushAssessments.find((a) => a.patientId === req.params.patientId) || database_1.db.ayushAssessments[0];
    res.json({
        success: true,
        assessment,
    });
});
exports.ayushRouter.post('/assessment', (req, res) => {
    const { patientId, encounterId, prakriti, agni, koshtha, ahara, vihara, nidana, sampraptiSummary } = req.body;
    const newAssessment = {
        id: `ay_${Date.now()}`,
        patientId: patientId || 'pat_priya_4',
        encounterId: encounterId || 'enc_priya_4',
        prakriti: prakriti || {
            vata: 30,
            pitta: 45,
            kapha: 25,
            dominant: 'PITTA',
        },
        vikriti: 'Pitta-Vata imbalance',
        agni: agni || 'MANDA',
        koshtha: koshtha || 'MADHYAMA',
        aharaShakti: 'MADHYAMA',
        vyayamaShakti: 'AVARA',
        satmya: 'Mixed Satmya',
        sattva: 'MADHYAMA',
        vaya: 'Madhyama Vaya',
        ahara: ahara || {
            rasaDominance: ['Katu', 'Amla'],
            regularity: 'Irregular lunch times',
        },
        vihara: vihara || {
            sleepPattern: 'Interrupted sleep',
            stressLevel: 'Moderate',
        },
        nidana: nidana || ['Irregular meals', 'Late sleeping'],
        sampraptiSummary: sampraptiSummary || 'Agni Manda leading to Ama formation and Amlapitta symptoms.',
    };
    database_1.db.ayushAssessments.push(newAssessment);
    res.json({
        success: true,
        assessment: newAssessment,
        message: 'AYUSH intake assessment recorded successfully',
    });
});
