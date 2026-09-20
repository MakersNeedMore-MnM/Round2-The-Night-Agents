import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { api } from '../../services/api';
import { AyushAssessment } from '../../types';
import {
  Sparkles,
  Flame,
  Leaf,
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AyushIntake: React.FC = () => {
  const { patient, encounter, setCurrentView } = useApp();

  const [assessment, setAssessment] = useState<AyushAssessment | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedAgni, setSelectedAgni] = useState<string>('TIKSHNA');
  const [selectedKoshtha, setSelectedKoshtha] = useState<string>('MADHYAMA');
  const [selectedPrakriti, setSelectedPrakriti] = useState<string>('PITTA_VATA');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadAssessment();
  }, [patient?.id]);

  const loadAssessment = async () => {
    try {
      const res = await api.getAyushAssessment(patient?.id || 'pat_priya_4');
      if (res.success && res.assessment) {
        setAssessment(res.assessment);
        setSelectedAgni(res.assessment.agni);
        setSelectedKoshtha(res.assessment.koshtha);
      }
    } catch (e) {
      console.warn('AYUSH load error:', e);
    }
  };

  const handleSaveAssessment = async () => {
    try {
      const res = await api.submitAyushAssessment({
        patientId: patient?.id || 'pat_priya_4',
        encounterId: encounter?.id || 'enc_priya_4',
        agni: selectedAgni,
        koshtha: selectedKoshtha,
        prakriti: {
          vata: 35,
          pitta: 50,
          kapha: 15,
          dominant: selectedPrakriti,
        },
      });
      if (res.success) {
        setAssessment(res.assessment);
        setIsSaved(true);
      }
    } catch (e) {
      console.warn('Save AYUSH error:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* AYUSH Brand Accent Header */}
      <div className="clinical-card p-6 bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/60 rounded-[28px] border border-amber-200/80 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#E67E22] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">AYUSH Clinical Intake</h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  Ayurveda OPD Pathway
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dashavidha & Ashtavidha Pariksha (Prakriti, Agni, Koshtha, Ahara & Samprapti)
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('physician-dashboard')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
          >
            Switch to Modern Allopathy
          </button>
        </div>
      </div>

      {/* Main Form & Prakriti Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Clinical Pariksha Questions */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* 1. Jatharagni Pariksha */}
          <div className="clinical-card p-6 bg-white rounded-[24px]">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-[#E67E22]" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Jatharagni (Digestive & Metabolic Fire)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Determine patient's appetite rhythm, postprandial lightness, and burning sensations:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'SAMA', label: 'Samagni (Balanced)', desc: 'Regular, healthy appetite, timely digestion without discomfort' },
                { id: 'TIKSHNA', label: 'Tikshnagni (Intense / Acidic)', desc: 'Frequent intense hunger, heartburn, thirst, fast burning metabolism' },
                { id: 'MANDA', label: 'Mandagni (Sluggish)', desc: 'Low appetite, heavy postprandial fullness, slow digestion' },
                { id: 'VISHAMA', label: 'Vishamagni (Irregular)', desc: 'Fluctuating hunger, erratic digestion, gas and bloating' },
              ].map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgni(ag.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedAgni === ag.id
                      ? 'border-[#E67E22] bg-amber-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs">{ag.label}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">{ag.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Koshtha Swabhava */}
          <div className="clinical-card p-6 bg-white rounded-[24px]">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Koshtha Swabhava (Bowel Habit & Alimentary Tendency)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'MRIDU', label: 'Mridu Koshtha', desc: 'Loose bowel movements with mild milk/fruits (Pitta)' },
                { id: 'MADHYAMA', label: 'Madhyama Koshtha', desc: 'Regular, formed daily evacuation (Kapha/Balanced)' },
                { id: 'KRURA', label: 'Krura Koshtha', desc: 'Dry, hard stools, habitual constipation (Vata)' },
              ].map((ko) => (
                <button
                  key={ko.id}
                  onClick={() => setSelectedKoshtha(ko.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedKoshtha === ko.id
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs">{ko.label}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">{ko.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Ahara & Vihara Intake */}
          <div className="clinical-card p-6 bg-white rounded-[24px]">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              3. Ahara (Dietary Predominance) & Vihara (Lifestyle)
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">Predominant Rasa:</span>
                <div className="text-slate-600 mt-0.5">Katu (Pungent), Amla (Sour), Vidahi</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">Nidra & Stress:</span>
                <div className="text-slate-600 mt-0.5">Late night sleep (Ratrijagarana), High work stress</div>
              </div>
            </div>

            <button
              onClick={handleSaveAssessment}
              className="mt-6 w-full py-3 rounded-2xl bg-[#E67E22] text-white font-bold text-xs shadow-md hover:bg-[#D35400] transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaved ? 'AYUSH Intake Saved & Synchronized' : 'Save AYUSH Clinical Intake'}</span>
            </button>
          </div>

        </div>

        {/* Right 1 Column: Doshic Balance & Samprapti Summary */}
        <div className="space-y-6">
          
          {/* Prakriti Dosha Wheel / Balance */}
          <div className="clinical-card p-6 bg-white rounded-[28px] text-center border border-amber-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Estimated Prakriti Profile
            </div>

            <div className="space-y-3 text-left">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#E67E22]">Pitta (50%)</span>
                  <span className="text-slate-500">Metabolism & Heat</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-[#E67E22]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-cyan-600">Vata (35%)</span>
                  <span className="text-slate-500">Movement & Rhythm</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[35%] h-full bg-cyan-500"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-600">Kapha (15%)</span>
                  <span className="text-slate-500">Structure & Lubrication</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[15%] h-full bg-emerald-500"></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-amber-50 text-xs text-amber-900 font-semibold text-center">
              Dominant Constitution: Pitta-Vata Prakriti
            </div>
          </div>

          {/* Samprapti Summary */}
          <div className="clinical-card p-5 bg-white rounded-[24px]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Clinical Samprapti Ghataka
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
              <div><strong>Dosha:</strong> Pitta-Pradhana with Vataja Anubandha</div>
              <div><strong>Dushya:</strong> Rasa, Rakta</div>
              <div><strong>Agni:</strong> Tikshnagni / Mandagni fluctuating</div>
              <div><strong>Strotas:</strong> Annavaha, Purishavaha</div>
              <div><strong>Sadhya-Asadhyata:</strong> Krichra Sadhya (Chronic Amlapitta)</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
