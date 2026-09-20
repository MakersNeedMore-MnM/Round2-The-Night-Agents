"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AYUSH_AYURVEDA_PATHWAY = exports.CHEST_PAIN_PATHWAY = void 0;
exports.CHEST_PAIN_PATHWAY = {
    complaintKey: 'CHEST_PAIN',
    complaintNameEn: 'Chest Pain / Discomfort',
    complaintNameHi: 'सीने में दर्द या भारीपन',
    keywordsEn: ['chest pain', 'heart pain', 'pressure in chest', 'chest tightness', 'heaviness in chest'],
    keywordsHi: ['seene mein dard', 'chhati mein dard', 'seene pe dabav', 'dil mein dard', 'seene mein jalan'],
    initialQuestionId: 'cp_onset',
    questions: {
        cp_onset: {
            id: 'cp_onset',
            category: 'HPI',
            questionEn: 'When did this chest discomfort first start?',
            questionHi: 'यह सीने का दर्द पहली बार कब शुरू हुआ था?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'historyOfPresentIllness.onset',
            required: true,
            canSkip: false,
            options: [
                { id: 'onset_today', labelEn: 'Within the last few hours today', labelHi: 'आज पिछले कुछ घंटों में', value: 'Today, within 2-4 hours' },
                { id: 'onset_yesterday', labelEn: '1 to 2 days ago', labelHi: '1 से 2 दिन पहले', value: '1-2 days ago' },
                { id: 'onset_week', labelEn: 'More than a week ago', labelHi: 'एक हफ्ते से अधिक समय से', value: 'More than 7 days' },
                { id: 'onset_months', labelEn: 'Occurs on and off for months', labelHi: 'महीनों से रुक-रुक कर हो रहा है', value: 'Chronic episodic (>1 month)' },
            ]
        },
        cp_character: {
            id: 'cp_character',
            category: 'HPI',
            questionEn: 'How does the pain feel like?',
            questionHi: 'यह दर्द कैसा महसूस हो रहा है?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'historyOfPresentIllness.character',
            required: true,
            canSkip: false,
            options: [
                { id: 'char_pressure', labelEn: 'Heavy pressure or squeezing tightness', labelHi: 'भारी दबाव या जकड़न जैसा', value: 'Crushing / Heavy pressure', icon: 'ShieldAlert' },
                { id: 'char_burning', labelEn: 'Burning sensation (like acidity / heart burn)', labelHi: 'सीने में तेज जलन (एसिडिटी जैसी)', value: 'Burning retrosternal discomfort' },
                { id: 'char_sharp', labelEn: 'Sharp, stabbing or pricking pain with breathing', labelHi: 'सांस लेने पर तेज चुभने वाला दर्द', value: 'Sharp pleuritic pain' },
                { id: 'char_aching', labelEn: 'Dull muscular ache', labelHi: 'हल्का मांसपेशियों का खिंचाव या दर्द', value: 'Dull muscular ache' },
            ]
        },
        cp_severity: {
            id: 'cp_severity',
            category: 'HPI',
            questionEn: 'On a scale from 0 to 10, how severe is the pain right now?',
            questionHi: '0 से 10 के पैमाने पर, अभी दर्द कितना तेज है?',
            inputType: 'NUMERIC_SCALE',
            scaleMin: 0,
            scaleMax: 10,
            scaleMinLabelEn: '0 = No pain',
            scaleMinLabelHi: '0 = बिल्कुल दर्द नहीं',
            scaleMaxLabelEn: '10 = Worst imaginable pain',
            scaleMaxLabelHi: '10 = असहनीय दर्द',
            clinicalTargetField: 'historyOfPresentIllness.severity',
            required: true,
            canSkip: false,
        },
        cp_radiation: {
            id: 'cp_radiation',
            category: 'HPI',
            questionEn: 'Does the pain spread or radiate to other parts?',
            questionHi: 'क्या यह दर्द शरीर के किसी अन्य हिस्से में फैलता है?',
            inputType: 'MULTIPLE_CHOICE',
            clinicalTargetField: 'historyOfPresentIllness.radiation',
            required: true,
            canSkip: false,
            options: [
                { id: 'rad_left_arm', labelEn: 'Left arm or shoulder', labelHi: 'बाएं हाथ या कंधे में', value: 'Left arm/shoulder', triggersRedFlag: true },
                { id: 'rad_jaw', labelEn: 'Jaw or neck', labelHi: 'जबड़े या गर्दन में', value: 'Jaw / Neck', triggersRedFlag: true },
                { id: 'rad_back', labelEn: 'Upper back between shoulder blades', labelHi: 'पीठ के ऊपरी हिस्से में', value: 'Upper back' },
                { id: 'rad_none', labelEn: 'Stays localized in the center of the chest', labelHi: 'केवल सीने के बीच में ही रहता है', value: 'Localized central' },
            ]
        },
        cp_associated: {
            id: 'cp_associated',
            category: 'ASSOCIATED',
            questionEn: 'Are you experiencing any of these associated symptoms?',
            questionHi: 'क्या आपको इनमें से कोई अन्य लक्षण भी महसूस हो रहे हैं?',
            inputType: 'MULTIPLE_CHOICE',
            clinicalTargetField: 'historyOfPresentIllness.associatedSymptoms',
            required: true,
            canSkip: false,
            options: [
                { id: 'assoc_sob', labelEn: 'Difficulty breathing / Shortness of breath', labelHi: 'सांस लेने में तकलीफ या घबराहट', value: 'Breathlessness / Dyspnea', triggersRedFlag: true, icon: 'Wind' },
                { id: 'assoc_sweat', labelEn: 'Cold sweating / Diaphoresis', labelHi: 'ठंडा पसीना आना', value: 'Cold Sweating', triggersRedFlag: true, icon: 'Droplets' },
                { id: 'assoc_nausea', labelEn: 'Nausea or vomiting', labelHi: 'उल्टी या जी मिचलाना', value: 'Nausea' },
                { id: 'assoc_dizzy', labelEn: 'Dizziness or feeling faint', labelHi: 'चक्कर आना या बेहोशी जैसा लगना', value: 'Dizziness / Presyncope', triggersRedFlag: true },
                { id: 'assoc_none', labelEn: 'None of these', labelHi: 'इनमें से कोई नहीं', value: 'None' },
            ]
        },
        cp_aggravating: {
            id: 'cp_aggravating',
            category: 'HPI',
            questionEn: 'What makes the pain worse or better?',
            questionHi: 'किस चीज़ से दर्द बढ़ता या घटता है?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'historyOfPresentIllness.aggravatingFactors',
            required: false,
            canSkip: true,
            options: [
                { id: 'agg_exertion', labelEn: 'Increases during walking / physical exertion, relieved by rest', labelHi: 'चलने या मेहनत करने पर बढ़ता है, आराम करने पर घटता है', value: 'Worse on exertion, better on rest' },
                { id: 'agg_posture', labelEn: 'Worse when lying flat, better leaning forward', labelHi: 'लेटने पर बढ़ता है, आगे झुकने पर कम होता है', value: 'Postural variation' },
                { id: 'agg_food', labelEn: 'Related to spicy food / empty stomach', labelHi: 'खाने के बाद या खाली पेट होने पर असर पड़ता है', value: 'Related to meals / fasting' },
                { id: 'agg_constant', labelEn: 'Constant irrespective of activity', labelHi: 'लगातार एक जैसा बना रहता है', value: 'Constant unvarying' },
            ]
        },
        cp_past_conditions: {
            id: 'cp_past_conditions',
            category: 'PAST_HISTORY',
            questionEn: 'Do you have any known medical conditions diagnosed earlier?',
            questionHi: 'क्या आपको पहले से कोई पुरानी बीमारी या स्वास्थ्य समस्या है?',
            inputType: 'MULTIPLE_CHOICE',
            clinicalTargetField: 'pastMedicalHistory',
            required: true,
            canSkip: false,
            options: [
                { id: 'cond_htn', labelEn: 'High Blood Pressure (Hypertension)', labelHi: 'हाई ब्लड प्रेशर (उच्च रक्तचाप)', value: 'Hypertension' },
                { id: 'cond_dm', labelEn: 'Diabetes Mellitus', labelHi: 'डायबिटीज (मधुमेह / शुगर)', value: 'Diabetes Mellitus Type 2' },
                { id: 'cond_cad', labelEn: 'Previous Heart Disease / Stent', labelHi: 'हार्ट की पुरानी बीमारी / स्टेंट', value: 'Known Ischemic Heart Disease' },
                { id: 'cond_asthma', labelEn: 'Asthma or respiratory issue', labelHi: 'अस्थमा या सांस की समस्या', value: 'Bronchial Asthma' },
                { id: 'cond_none', labelEn: 'No known previous conditions', labelHi: 'कोई पुरानी बीमारी नहीं', value: 'No known chronic conditions' },
            ]
        },
        cp_current_meds: {
            id: 'cp_current_meds',
            category: 'MEDICATION',
            questionEn: 'Are you currently taking regular daily medications?',
            questionHi: 'क्या आप अभी कोई नियमित दवाइयां ले रहे हैं?',
            inputType: 'VOICE_AND_TEXT',
            clinicalTargetField: 'drugHistory',
            required: false,
            canSkip: true,
            options: [
                { id: 'med_metformin', labelEn: 'Taking BP or Diabetes tablets (e.g. Metformin, Amlodipine)', labelHi: 'बीपी या शुगर की दवाएं (जैसे मेटफॉर्मिन, एमलोडिपिन)', value: 'Metformin 500mg, Amlodipine 5mg' },
                { id: 'med_none', labelEn: 'No regular medications', labelHi: 'कोई दवा नहीं ले रहे हैं', value: 'No regular medications' },
                { id: 'med_docs', labelEn: 'I have my prescription to scan', labelHi: 'मेरे पास डॉक्टर का पर्चा है, जिसे मैं स्कैन करूँगा', value: 'Prescription document available' }
            ]
        },
        cp_allergies: {
            id: 'cp_allergies',
            category: 'ALLERGY',
            questionEn: 'Do you have any known allergy to medicines (e.g. Penicillin, Sulfa) or foods?',
            questionHi: 'क्या आपको किसी दवा (जैसे पेनिसिलिन, सल्फा) या खाने से कोई एलर्जी है?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'allergyHistory',
            required: true,
            canSkip: false,
            options: [
                { id: 'alg_none', labelEn: 'No known allergies', labelHi: 'कोई ज्ञात एलर्जी नहीं है', value: 'No known allergies' },
                { id: 'alg_penicillin', labelEn: 'Allergic to Penicillin / Antibiotics', labelHi: 'पेनिसिलिन या एंटीबायोटिक से एलर्जी है', value: 'Penicillin allergy' },
                { id: 'alg_unsure', labelEn: 'Not sure / Never checked', labelHi: 'पक्का मालूम नहीं / कभी जांच नहीं हुई', value: 'Patient unsure' },
            ]
        }
    },
    nextQuestionLogic: (answersSoFar, lastAnsweredId) => {
        const sequence = [
            'cp_onset',
            'cp_character',
            'cp_severity',
            'cp_radiation',
            'cp_associated',
            'cp_aggravating',
            'cp_past_conditions',
            'cp_current_meds',
            'cp_allergies'
        ];
        const currentIndex = sequence.indexOf(lastAnsweredId);
        if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
            return sequence[currentIndex + 1];
        }
        return null; // Intake questions complete
    }
};
exports.AYUSH_AYURVEDA_PATHWAY = {
    complaintKey: 'AYUSH_AYURVEDA',
    complaintNameEn: 'Ayurvedic Clinical Intake (Prakriti & Agni)',
    complaintNameHi: 'आयुर्वेदिक क्लिनिकल परीक्षा (प्रकृति एवं अग्नि)',
    keywordsEn: ['ayurveda', 'ayush', 'prakriti', 'vata', 'pitta', 'kapha', 'indigestion', 'amlapitta'],
    keywordsHi: ['ayurveda', 'prakriti', 'vaat', 'pitt', 'kaf', 'paachan', 'gas', 'amlapitta'],
    initialQuestionId: 'ayush_agni',
    questions: {
        ayush_agni: {
            id: 'ayush_agni',
            category: 'AYUSH',
            questionEn: 'How is your hunger and digestive capacity (Jatharagni)?',
            questionHi: 'आपकी भूख और पाचन शक्ति (जाठराग्नि) कैसी रहती है?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'ayushAssessment.agni',
            required: true,
            canSkip: false,
            options: [
                { id: 'agni_sama', labelEn: 'Sama Agni (Healthy, timely, balanced hunger and digestion)', labelHi: 'समाग्नि (समय पर अच्छी भूख, सामान्य व संतुलित पाचन)', value: 'SAMA' },
                { id: 'agni_manda', labelEn: 'Manda Agni (Sluggish appetite, heaviness, slow digestion)', labelHi: 'मन्दाग्नि (कम भूख, खाने के बाद भारीपन, सुस्त पाचन)', value: 'MANDA' },
                { id: 'agni_tikshna', labelEn: 'Tikshna Agni (Intense burning hunger, acidity, quick thirst)', labelHi: 'तीक्ष्णाग्नि (अत्यधिक तेज भूख, जलन, बार-बार प्यास)', value: 'TIKSHNA' },
                { id: 'agni_vishama', labelEn: 'Vishama Agni (Irregular, unpredictable appetite and bloating)', labelHi: 'विषमाग्नि (अनियमित कभी तेज कभी गायब भूख, गैस व अफरा)', value: 'VISHAMA' },
            ]
        },
        ayush_koshtha: {
            id: 'ayush_koshtha',
            category: 'AYUSH',
            questionEn: 'What is your bowel movement pattern (Koshtha)?',
            questionHi: 'आपकी मल प्रवृत्ति (कोष्ठ) का स्वभाव कैसा है?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'ayushAssessment.koshtha',
            required: true,
            canSkip: false,
            options: [
                { id: 'kosh_mridu', labelEn: 'Mridu (Soft stools easily with mild laxatives/milk)', labelHi: 'मृदु कोष्ठ (दूध या हल्के आहार से भी आसानी से पेट साफ हो जाता है)', value: 'MRIDU' },
                { id: 'kosh_madhyama', labelEn: 'Madhyama (Regular, normal formed bowel habit)', labelHi: 'मध्यम कोष्ठ (नियमित, सामान्य रूप से प्रतिदिन साफ होता है)', value: 'MADHYAMA' },
                { id: 'kosh_krura', labelEn: 'Krura (Hard, dry stools, prone to constipation)', labelHi: 'क्रूर कोष्ठ (कड़ा मल, शुष्कता, कब्ज की पुरानी शिकायत)', value: 'KRURA' },
            ]
        },
        ayush_prakriti_thermal: {
            id: 'ayush_prakriti_thermal',
            category: 'AYUSH',
            questionEn: 'How do you tolerate seasonal climate and temperature?',
            questionHi: 'मौसम और तापमान के प्रति आपका शरीर कैसा महसूस करता है?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'ayushAssessment.prakritiThermal',
            required: true,
            canSkip: false,
            options: [
                { id: 'tol_cold', labelEn: 'Dislike cold, feel chilly easily (Vata/Kapha tendency)', labelHi: 'ठंड बिल्कुल सहन नहीं होती, जल्दी ठंड लगती है (वात/कफ)', value: 'COLD_INTOLERANT' },
                { id: 'tol_heat', labelEn: 'Dislike heat, sweat excessively, love cooling foods (Pitta tendency)', labelHi: 'गर्मी सहन नहीं होती, ज्यादा पसीना आता है, ठंडा पसंद है (पित्त)', value: 'HEAT_INTOLERANT' },
                { id: 'tol_adapt', labelEn: 'Comfortable in most moderate conditions (Balanced)', labelHi: 'सामान्य रूप से सभी मौसम में सहज रहते हैं (सम)', value: 'ADAPTIVE' },
            ]
        },
        ayush_ahara: {
            id: 'ayush_ahara',
            category: 'AYUSH',
            questionEn: 'Which dietary tastes (Rasa) and meal habits do you consume predominantly?',
            questionHi: 'आप आमतौर पर कैसा आहार और स्वाद (रस) अधिक लेते हैं?',
            inputType: 'MULTIPLE_CHOICE',
            clinicalTargetField: 'ayushAssessment.ahara',
            required: true,
            canSkip: false,
            options: [
                { id: 'rasa_katu', labelEn: 'Spicy / Pungent / Fried snacks (Katu / Vidahi)', labelHi: 'तीखा, चटपटा, मिर्च-मसालेदार या तला हुआ (कटु / विदाही)', value: 'SPICY_FRIED' },
                { id: 'rasa_madhura', labelEn: 'Sweet, dairy, heavy meals (Madhura / Guru)', labelHi: 'मीठा, दूध-दही, भारी और गरिष्ठ भोजन (मधुर / गुरु)', value: 'SWEET_HEAVY' },
                { id: 'rasa_amla', labelEn: 'Sour, fermented, pickles (Amla)', labelHi: 'खट्टा, सिरका, अचार या फर्मेंटेड खाना (अम्ल)', value: 'SOUR_FERMENTED' },
                { id: 'rasa_laghu', labelEn: 'Light, home-cooked dal-roti-sabzi (Laghu / Satvik)', labelHi: 'सादा, सुपाच्य घर का दाल-रोटी-सब्जी (लघु / सात्विक)', value: 'LIGHT_BALANCED' },
            ]
        },
        ayush_sleep: {
            id: 'ayush_sleep',
            category: 'AYUSH',
            questionEn: 'How is your sleep (Nidra) and mental state (Sattva)?',
            questionHi: 'आपकी नींद (निद्रा) और मानसिक स्थिति कैसी है?',
            inputType: 'SINGLE_CHOICE',
            clinicalTargetField: 'ayushAssessment.nidra',
            required: true,
            canSkip: false,
            options: [
                { id: 'slp_disturbed', labelEn: 'Light, interrupted sleep, racing thoughts (Vata)', labelHi: 'हल्की, बार-बार टूटने वाली नींद, चिंता व विचार (वात)', value: 'DISTURBED_LIGHT' },
                { id: 'slp_moderate', labelEn: 'Moderate 6-7 hours, wake up alert (Pitta)', labelHi: 'मध्यम 6-7 घंटे, तेज और सतर्क जागना (पित्त)', value: 'MODERATE_ALERT' },
                { id: 'slp_heavy', labelEn: 'Deep, heavy, difficulty waking up in morning (Kapha)', labelHi: 'गहरी, भारी नींद, सुबह उठने में सुस्ती और भारीपन (कफ)', value: 'HEAVY_DROWSY' },
            ]
        }
    },
    nextQuestionLogic: (answersSoFar, lastAnsweredId) => {
        const seq = ['ayush_agni', 'ayush_koshtha', 'ayush_prakriti_thermal', 'ayush_ahara', 'ayush_sleep'];
        const idx = seq.indexOf(lastAnsweredId);
        if (idx >= 0 && idx < seq.length - 1) {
            return seq[idx + 1];
        }
        return null;
    }
};
