// Red Flag Detection and Triage Logic
// Identifies life-threatening symptoms requiring immediate attention

export type TriagePriority = 'EMERGENCY' | 'URGENT' | 'ROUTINE';

export interface RedFlag {
  id: string;
  category: string;
  description: string;
  descriptionHi: string;
  severity: TriagePriority;
  recommendation: string;
  recommendationHi: string;
  detectedAt: string;
  acknowledged: boolean;
}

export interface TriageResult {
  priority: TriagePriority;
  redFlags: RedFlag[];
  requiresImmediateAttention: boolean;
  estimatedWaitTime: string;
  recommendedAction: string;
  recommendedActionHi: string;
}

interface RedFlagRule {
  id: string;
  patterns: RegExp[];
  conditions?: (symptoms: string[], answers: Record<string, any>) => boolean;
  severity: TriagePriority;
  category: string;
  description: string;
  descriptionHi: string;
  recommendation: string;
  recommendationHi: string;
}

// Red flag detection rules
const RED_FLAG_RULES: RedFlagRule[] = [
  // EMERGENCY - Cardiac
  {
    id: 'chest_pain_cardiac',
    patterns: [
      /सीने\s*में\s*दर्द.*सांस/i,
      /chest\s*pain.*breath/i,
      /सीने\s*में\s*दर्द.*पसीना/i,
      /chest\s*pain.*sweat/i,
    ],
    conditions: (symptoms, answers) => {
      const hasChestPain = symptoms.some(s => /chest.*pain|सीने.*दर्द/i.test(s));
      const hasBreathingDifficulty = symptoms.some(s => /breath|सांस/i.test(s)) || answers.chest_pain_breathing === 'yes';
      const hasSweating = symptoms.some(s => /sweat|पसीना/i.test(s)) || answers.chest_pain_sweating === 'yes';
      return hasChestPain && (hasBreathingDifficulty || hasSweating);
    },
    severity: 'EMERGENCY',
    category: 'CARDIAC',
    description: 'Possible cardiac emergency: Chest pain with breathing difficulty or sweating',
    descriptionHi: 'संभावित हृदय आपात स्थिति: सांस लेने में कठिनाई या पसीने के साथ सीने में दर्द',
    recommendation: 'IMMEDIATE medical attention required. Call emergency services or go to nearest emergency room.',
    recommendationHi: 'तत्काल चिकित्सा ध्यान आवश्यक है। आपातकालीन सेवाओं को कॉल करें या निकटतम आपातकालीन कक्ष में जाएं।',
  },
  {
    id: 'chest_pain_radiating',
    patterns: [
      /दर्द.*हाथ|दर्द.*कंधे|दर्द.*जबड़े/i,
      /pain.*arm|pain.*shoulder|pain.*jaw/i,
    ],
    conditions: (symptoms, answers) => {
      const hasChestPain = symptoms.some(s => /chest.*pain|सीने.*दर्द/i.test(s));
      const hasRadiation = answers.chest_pain_radiation === 'yes';
      return hasChestPain && hasRadiation;
    },
    severity: 'EMERGENCY',
    category: 'CARDIAC',
    description: 'Possible cardiac emergency: Chest pain radiating to arm, shoulder, or jaw',
    descriptionHi: 'संभावित हृदय आपात स्थिति: हाथ, कंधे या जबड़े में फैलने वाला सीने में दर्द',
    recommendation: 'IMMEDIATE medical attention required. This could be a heart attack.',
    recommendationHi: 'तत्काल चिकित्सा ध्यान आवश्यक है। यह हार्ट अटैक हो सकता है।',
  },

  // EMERGENCY - Neurological
  {
    id: 'severe_headache_sudden',
    patterns: [
      /अचानक.*सिरदर्द|अचानक.*सिर.*दर्द/i,
      /sudden.*headache|sudden.*head.*pain/i,
      /worst.*headache|सबसे.*बुरा.*सिरदर्द/i,
    ],
    severity: 'EMERGENCY',
    category: 'NEUROLOGICAL',
    description: 'Sudden severe headache - possible brain hemorrhage or stroke',
    descriptionHi: 'अचानक गंभीर सिरदर्द - संभावित मस्तिष्क रक्तस्राव या स्ट्रोक',
    recommendation: 'IMMEDIATE emergency care required. Could indicate stroke or brain hemorrhage.',
    recommendationHi: 'तत्काल आपातकालीन देखभाल आवश्यक है। स्ट्रोक या मस्तिष्क रक्तस्राव का संकेत हो सकता है।',
  },
  {
    id: 'altered_consciousness',
    patterns: [
      /बेहोश|चक्कर.*गिर.*गया/i,
      /unconscious|faint|collapsed/i,
      /confusion|भ्रम/i,
    ],
    severity: 'EMERGENCY',
    category: 'NEUROLOGICAL',
    description: 'Altered consciousness or loss of consciousness',
    descriptionHi: 'चेतना में परिवर्तन या बेहोशी',
    recommendation: 'IMMEDIATE emergency care required.',
    recommendationHi: 'तत्काल आपातकालीन देखभाल आवश्यक है।',
  },

  // URGENT - Respiratory
  {
    id: 'severe_breathing_difficulty',
    patterns: [
      /सांस.*नहीं.*आ.*रहा/i,
      /cannot.*breathe|can't.*breathe/i,
      /सांस.*फूल.*रहा|सांस.*लेने.*मुश्किल/i,
      /difficulty.*breathing|shortness.*breath/i,
    ],
    severity: 'URGENT',
    category: 'RESPIRATORY',
    description: 'Severe breathing difficulty',
    descriptionHi: 'गंभीर सांस लेने में कठिनाई',
    recommendation: 'URGENT medical attention needed within 1 hour.',
    recommendationHi: '1 घंटे के भीतर तत्काल चिकित्सा ध्यान आवश्यक है।',
  },
  {
    id: 'coughing_blood',
    patterns: [
      /खांसी.*खून|खून.*खांसी/i,
      /cough.*blood|blood.*cough|hemoptysis/i,
    ],
    conditions: (symptoms, answers) => {
      return answers.cough_blood === 'yes' || symptoms.some(s => /खून.*खांसी|cough.*blood/i.test(s));
    },
    severity: 'URGENT',
    category: 'RESPIRATORY',
    description: 'Coughing up blood (hemoptysis)',
    descriptionHi: 'खांसी में खून आना',
    recommendation: 'URGENT medical evaluation needed. Go to emergency room.',
    recommendationHi: 'तत्काल चिकित्सा मूल्यांकन आवश्यक है। आपातकालीन कक्ष में जाएं।',
  },

  // URGENT - High Fever
  {
    id: 'high_fever',
    patterns: [
      /तेज़.*बुखार|बहुत.*बुखार/i,
      /high.*fever|very.*high.*fever/i,
    ],
    conditions: (_symptoms, answers) => {
      const temp = parseFloat(answers.fever_temperature);
      return !isNaN(temp) && temp >= 103;
    },
    severity: 'URGENT',
    category: 'INFECTION',
    description: 'Very high fever (≥103°F / 39.4°C)',
    descriptionHi: 'बहुत तेज बुखार (≥103°F / 39.4°C)',
    recommendation: 'URGENT medical attention needed. High fever can indicate serious infection.',
    recommendationHi: 'तत्काल चिकित्सा ध्यान आवश्यक है। तेज बुखार गंभीर संक्रमण का संकेत हो सकता है।',
  },

  // URGENT - Severe Abdominal
  {
    id: 'severe_abdominal_pain',
    patterns: [
      /बहुत.*दर्द.*पेट|असहनीय.*दर्द/i,
      /severe.*abdominal.*pain|unbearable.*pain/i,
    ],
    conditions: (_symptoms, answers) => {
      const severity = parseInt(answers.abdominal_severity);
      return !isNaN(severity) && severity >= 8;
    },
    severity: 'URGENT',
    category: 'ABDOMINAL',
    description: 'Severe abdominal pain (8-10/10)',
    descriptionHi: 'गंभीर पेट दर्द (8-10/10)',
    recommendation: 'URGENT evaluation needed. Could indicate appendicitis, perforation, or other emergency.',
    recommendationHi: 'तत्काल मूल्यांकन आवश्यक है। अपेंडिसाइटिस, छिद्र या अन्य आपात स्थिति का संकेत हो सकता है।',
  },
  {
    id: 'abdominal_pain_rigid',
    patterns: [
      /पेट.*कठोर|पेट.*सख्त/i,
      /rigid.*abdomen|board.*like/i,
    ],
    severity: 'EMERGENCY',
    category: 'ABDOMINAL',
    description: 'Rigid abdomen - possible peritonitis',
    descriptionHi: 'कठोर पेट - संभावित पेरिटोनाइटिस',
    recommendation: 'EMERGENCY care required immediately.',
    recommendationHi: 'तुरंत आपातकालीन देखभाल आवश्यक है।',
  },

  // URGENT - Pregnancy-related
  {
    id: 'pregnant_bleeding',
    patterns: [
      /गर्भवती.*खून|pregnant.*bleeding/i,
      /गर्भावस्था.*रक्तस्राव/i,
    ],
    severity: 'URGENT',
    category: 'OBSTETRIC',
    description: 'Bleeding during pregnancy',
    descriptionHi: 'गर्भावस्था के दौरान रक्तस्राव',
    recommendation: 'URGENT obstetric evaluation needed immediately.',
    recommendationHi: 'तुरंत प्रसूति मूल्यांकन आवश्यक है।',
  },
];

class RedFlagDetector {
  /**
   * Detect red flags from symptoms and clinical answers
   */
  detectRedFlags(
    chiefComplaint: string,
    symptoms: string[],
    clinicalAnswers: Record<string, any>
  ): RedFlag[] {
    const detectedFlags: RedFlag[] = [];
    const combinedText = [chiefComplaint, ...symptoms].join(' ').toLowerCase();

    for (const rule of RED_FLAG_RULES) {
      let isTriggered = false;

      // Check patterns
      for (const pattern of rule.patterns) {
        if (pattern.test(combinedText)) {
          isTriggered = true;
          break;
        }
      }

      // Check conditions if provided
      if (rule.conditions) {
        const conditionMet = rule.conditions(symptoms, clinicalAnswers);
        if (conditionMet) {
          isTriggered = true;
        }
      }

      if (isTriggered) {
        detectedFlags.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          descriptionHi: rule.descriptionHi,
          severity: rule.severity,
          recommendation: rule.recommendation,
          recommendationHi: rule.recommendationHi,
          detectedAt: new Date().toISOString(),
          acknowledged: false,
        });
      }
    }

    return detectedFlags;
  }

  /**
   * Perform triage based on detected red flags
   */
  performTriage(redFlags: RedFlag[]): TriageResult {
    // Determine priority based on highest severity
    let priority: TriagePriority = 'ROUTINE';
    let requiresImmediateAttention = false;
    let estimatedWaitTime = '30-60 minutes';
    let recommendedAction = 'Please wait for your turn. A doctor will see you soon.';
    let recommendedActionHi = 'कृपया अपनी बारी का इंतजार करें। एक डॉक्टर जल्द ही आपको देखेगा।';

    if (redFlags.some(f => f.severity === 'EMERGENCY')) {
      priority = 'EMERGENCY';
      requiresImmediateAttention = true;
      estimatedWaitTime = 'IMMEDIATE';
      recommendedAction = 'EMERGENCY: You will be seen immediately. A doctor is being notified now.';
      recommendedActionHi = 'आपातकाल: आपको तुरंत देखा जाएगा। एक डॉक्टर को अभी सूचित किया जा रहा है।';
    } else if (redFlags.some(f => f.severity === 'URGENT')) {
      priority = 'URGENT';
      requiresImmediateAttention = true;
      estimatedWaitTime = '10-15 minutes';
      recommendedAction = 'URGENT: You will be prioritized. Please inform staff if symptoms worsen.';
      recommendedActionHi = 'जरूरी: आपको प्राथमिकता दी जाएगी। यदि लक्षण बिगड़ते हैं तो कृपया स्टाफ को सूचित करें।';
    }

    return {
      priority,
      redFlags,
      requiresImmediateAttention,
      estimatedWaitTime,
      recommendedAction,
      recommendedActionHi,
    };
  }

  /**
   * Quick check for immediate emergency conditions
   */
  hasEmergencySymptoms(complaint: string): boolean {
    const emergencyPatterns = [
      /सीने.*दर्द.*सांस/i,
      /chest.*pain.*breath/i,
      /बेहोश|unconscious/i,
      /खून.*खांसी|cough.*blood/i,
      /अचानक.*सिरदर्द/i,
      /sudden.*severe.*headache/i,
    ];

    return emergencyPatterns.some(pattern => pattern.test(complaint));
  }
}

// Singleton instance
export const redFlagDetector = new RedFlagDetector();
