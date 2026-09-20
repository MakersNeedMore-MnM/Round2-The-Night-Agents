import { Router } from 'express';
import { db } from '../models/database';
import { AYUSH_AYURVEDA_PATHWAY } from '../clinical/ontology';

export const ayushRouter = Router();

ayushRouter.get('/pathway', (req, res) => {
  res.json({
    success: true,
    pathway: AYUSH_AYURVEDA_PATHWAY,
  });
});

ayushRouter.get('/assessment/:patientId', (req, res) => {
  const assessment = db.ayushAssessments.find((a) => a.patientId === req.params.patientId) || db.ayushAssessments[0];
  res.json({
    success: true,
    assessment,
  });
});

ayushRouter.post('/assessment', (req, res) => {
  const { patientId, encounterId, prakriti, agni, koshtha, ahara, vihara, nidana, sampraptiSummary } = req.body;

  const newAssessment = {
    id: `ay_${Date.now()}`,
    patientId: patientId || 'pat_priya_4',
    encounterId: encounterId || 'enc_priya_4',
    prakriti: prakriti || {
      vata: 30,
      pitta: 45,
      kapha: 25,
      dominant: 'PITTA' as const,
    },
    vikriti: 'Pitta-Vata imbalance',
    agni: agni || 'MANDA',
    koshtha: koshtha || 'MADHYAMA',
    aharaShakti: 'MADHYAMA' as const,
    vyayamaShakti: 'AVARA' as const,
    satmya: 'Mixed Satmya',
    sattva: 'MADHYAMA' as const,
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

  db.ayushAssessments.push(newAssessment);

  res.json({
    success: true,
    assessment: newAssessment,
    message: 'AYUSH intake assessment recorded successfully',
  });
});
