// Adaptive Clinical Questioning Engine
// Extracts symptoms and generates relevant follow-up questions

export interface ExtractedSymptom {
  name: string;
  category: 'chief_complaint' | 'duration' | 'location' | 'severity' | 'character' | 'associated' | 'timing';
  value: string;
  confidence: number;
}

export interface QuestionTemplate {
  id: string;
  category: string;
  questionEn: string;
  questionHi: string;
  answerType: 'text' | 'yes_no' | 'number' | 'scale' | 'multiple_choice';
  options?: string[];
  followUpRules?: Record<string, string[]>;
  priority: number;
}

// Question bank for different chief complaints
const QUESTION_BANK: Record<string, QuestionTemplate[]> = {
  CHEST_PAIN: [
    {
      id: 'chest_pain_location',
      category: 'CHEST_PAIN',
      questionEn: 'Where exactly in your chest do you feel the pain?',
      questionHi: 'सीने में दर्द किस जगह हो रहा है?',
      answerType: 'text',
      priority: 1,
    },
    {
      id: 'chest_pain_duration',
      category: 'CHEST_PAIN',
      questionEn: 'When did the chest pain start?',
      questionHi: 'सीने में दर्द कब से शुरू हुआ?',
      answerType: 'text',
      priority: 1,
    },
    {
      id: 'chest_pain_character',
      category: 'CHEST_PAIN',
      questionEn: 'How would you describe the pain? (pressing, burning, sharp, or stabbing)',
      questionHi: 'दर्द कैसा है? (दबाव, जलन, तीखा या चुभने वाला)',
      answerType: 'text',
      priority: 2,
    },
    {
      id: 'chest_pain_severity',
      category: 'CHEST_PAIN',
      questionEn: 'On a scale of 1-10, how severe is the pain?',
      questionHi: 'दर्द की तीव्रता 1 से 10 में कितनी है?',
      answerType: 'scale',
      priority: 2,
    },
    {
      id: 'chest_pain_radiation',
      category: 'CHEST_PAIN',
      questionEn: 'Does the pain spread to your arm, shoulder, neck, back, or jaw?',
      questionHi: 'क्या दर्द हाथ, कंधे, गर्दन, पीठ या जबड़े तक जाता है?',
      answerType: 'yes_no',
      priority: 3,
    },
    {
      id: 'chest_pain_breathing',
      category: 'CHEST_PAIN',
      questionEn: 'Are you having difficulty breathing?',
      questionHi: 'क्या सांस लेने में परेशानी हो रही है?',
      answerType: 'yes_no',
      priority: 1,
    },
    {
      id: 'chest_pain_sweating',
      category: 'CHEST_PAIN',
      questionEn: 'Are you experiencing sweating?',
      questionHi: 'क्या पसीना आ रहा है?',
      answerType: 'yes_no',
      priority: 2,
    },
    {
      id: 'chest_pain_nausea',
      category: 'CHEST_PAIN',
      questionEn: 'Do you feel nauseous or have you vomited?',
      questionHi: 'क्या मतली या उल्टी हो रही है?',
      answerType: 'yes_no',
      priority: 3,
    },
  ],
  FEVER: [
    {
      id: 'fever_duration',
      category: 'FEVER',
      questionEn: 'How many days have you had fever?',
      questionHi: 'बुखार कितने दिन से है?',
      answerType: 'number',
      priority: 1,
    },
    {
      id: 'fever_temperature',
      category: 'FEVER',
      questionEn: 'What is your highest recorded temperature?',
      questionHi: 'सबसे ज्यादा तापमान कितना रहा है?',
      answerType: 'number',
      priority: 1,
    },
    {
      id: 'fever_pattern',
      category: 'FEVER',
      questionEn: 'Is the fever constant or does it come and go?',
      questionHi: 'बुखार लगातार है या आता-जाता है?',
      answerType: 'text',
      priority: 2,
    },
    {
      id: 'fever_chills',
      category: 'FEVER',
      questionEn: 'Do you have chills or shivering with fever?',
      questionHi: 'क्या बुखार के साथ ठंड लगना या कंपकंपी होती है?',
      answerType: 'yes_no',
      priority: 2,
    },
    {
      id: 'fever_associated',
      category: 'FEVER',
      questionEn: 'Do you have cough, sore throat, body ache, headache, or diarrhea?',
      questionHi: 'क्या खांसी, गले में दर्द, शरीर दर्द, सिरदर्द या दस्त है?',
      answerType: 'text',
      priority: 3,
    },
  ],
  ABDOMINAL_PAIN: [
    {
      id: 'abdominal_location',
      category: 'ABDOMINAL_PAIN',
      questionEn: 'Where exactly in the abdomen is the pain?',
      questionHi: 'पेट में दर्द किस जगह है?',
      answerType: 'text',
      priority: 1,
    },
    {
      id: 'abdominal_duration',
      category: 'ABDOMINAL_PAIN',
      questionEn: 'When did the pain start?',
      questionHi: 'दर्द कब से शुरू हुआ?',
      answerType: 'text',
      priority: 1,
    },
    {
      id: 'abdominal_onset',
      category: 'ABDOMINAL_PAIN',
      questionEn: 'Did the pain start suddenly or gradually?',
      questionHi: 'दर्द अचानक शुरू हुआ या धीरे-धीरे?',
      answerType: 'text',
      priority: 2,
    },
    {
      id: 'abdominal_character',
      category: 'ABDOMINAL_PAIN',
      questionEn: 'Is the pain constant or comes and goes?',
      questionHi: 'दर्द लगातार है या आता-जाता है?',
      answerType: 'text',
      priority: 2,
    },
    {
      id: 'abdominal_vomiting',
      category: 'ABDOMINAL_PAIN',
      questionEn: 'Are you vomiting?',
      questionHi: 'क्या उल्टी हो रही है?',
      answerType: 'yes_no',
      priority: 3,
    },
    {
      id: 'abdominal_bowel',
      category: 'ABDOMINAL_PAIN',
      questionEn: 'Do you have diarrhea or constipation?',
      questionHi: 'क्या दस्त या कब्ज है?',
      answerType: 'text',
      priority: 3,
    },
  ],
  HEADACHE: [
    {
      id: 'headache_location',
      category: 'HEADACHE',
      questionEn: 'Where exactly is the headache located?',
      questionHi: 'सिरदर्द किस जगह है?',
      answerType: 'text',
      priority: 1,
    },
    {
      id: 'headache_duration',
      category: 'HEADACHE',
      questionEn: 'How long have you had this headache?',
      questionHi: 'सिरदर्द कितने समय से है?',
      answerType: 'text',
      priority: 1,
    },
    {
      id: 'headache_severity',
      category: 'HEADACHE',
      questionEn: 'On a scale of 1-10, how severe is the headache?',
      questionHi: 'सिरदर्द की तीव्रता 1 से 10 में कितनी है?',
      answerType: 'scale',
      priority: 2,
    },
    {
      id: 'headache_visual',
      category: 'HEADACHE',
      questionEn: 'Do you have any vision changes or see flashing lights?',
      questionHi: 'क्या आपकी दृष्टि में कोई बदलाव या चमकती रोशनी दिखाई दे रही है?',
      answerType: 'yes_no',
      priority: 3,
    },
  ],
  COUGH: [
    {
      id: 'cough_duration',
      category: 'COUGH',
      questionEn: 'How long have you had the cough?',
      questionHi: 'खांसी कितने दिन से है?',
      answerType: 'text',
      priority: 1,
    },
    {
      id: 'cough_sputum',
      category: 'COUGH',
      questionEn: 'Are you coughing up phlegm? What color is it?',
      questionHi: 'क्या खांसी में बलगम आ रहा है? किस रंग का है?',
      answerType: 'text',
      priority: 2,
    },
    {
      id: 'cough_blood',
      category: 'COUGH',
      questionEn: 'Is there any blood in the cough?',
      questionHi: 'क्या खांसी में खून आ रहा है?',
      answerType: 'yes_no',
      priority: 1,
    },
  ],
};

// Symptom extraction patterns (simple keyword-based for demo)
const SYMPTOM_PATTERNS: Record<string, RegExp[]> = {
  CHEST_PAIN: [
    /सीने\s*में\s*दर्द/i,
    /chest\s*pain/i,
    /सीने\s*में\s*भारीपन/i,
    /chest\s*heaviness/i,
    /हृदय\s*में\s*दर्द/i,
    /heart\s*pain/i,
  ],
  FEVER: [
    /बुखार/i,
    /fever/i,
    /ताप/i,
    /temperature/i,
  ],
  ABDOMINAL_PAIN: [
    /पेट\s*में\s*दर्द/i,
    /stomach\s*pain/i,
    /abdominal\s*pain/i,
    /पेट\s*दर्द/i,
  ],
  HEADACHE: [
    /सिर\s*दर्द/i,
    /सिर\s*में\s*दर्द/i,
    /headache/i,
    /head\s*pain/i,
  ],
  COUGH: [
    /खांसी/i,
    /cough/i,
    /कफ/i,
  ],
  BREATHING_DIFFICULTY: [
    /सांस\s*लेने\s*में\s*परेशानी/i,
    /difficulty\s*breathing/i,
    /सांस\s*फूलना/i,
    /shortness\s*of\s*breath/i,
  ],
  VOMITING: [
    /उल्टी/i,
    /vomit/i,
    /मतली/i,
    /nausea/i,
  ],
  DIARRHEA: [
    /दस्त/i,
    /diarr[h]?[o]?ea/i,
    /loose\s*motion/i,
  ],
};

class ClinicalQuestionEngine {
  /**
   * Extract symptoms from patient's chief complaint
   */
  extractSymptoms(complaint: string): ExtractedSymptom[] {
    const symptoms: ExtractedSymptom[] = [];
    const lowerComplaint = complaint.toLowerCase();

    // Check each symptom pattern
    for (const [symptomName, patterns] of Object.entries(SYMPTOM_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerComplaint)) {
          symptoms.push({
            name: symptomName,
            category: 'chief_complaint',
            value: complaint,
            confidence: 0.85,
          });
          break; // Only add once per symptom
        }
      }
    }

    // Extract duration if mentioned
    const durationPatterns = [
      /(\d+)\s*(दिन|दिनों|days?)/i,
      /(\d+)\s*(घंटे|घंटो|hours?)/i,
      /कल\s*से|since\s*yesterday/i,
      /आज\s*से|since\s*today/i,
    ];

    for (const pattern of durationPatterns) {
      const match = lowerComplaint.match(pattern);
      if (match) {
        symptoms.push({
          name: 'DURATION',
          category: 'duration',
          value: match[0],
          confidence: 0.9,
        });
        break;
      }
    }

    return symptoms;
  }

  /**
   * Identify primary chief complaint category
   */
  identifyChiefComplaint(complaint: string): string | null {
    const symptoms = this.extractSymptoms(complaint);
    
    // Priority order for chief complaints
    const priorityOrder = ['CHEST_PAIN', 'BREATHING_DIFFICULTY', 'ABDOMINAL_PAIN', 'HEADACHE', 'FEVER', 'COUGH'];
    
    for (const priority of priorityOrder) {
      if (symptoms.some(s => s.name === priority)) {
        return priority;
      }
    }

    return symptoms.length > 0 ? symptoms[0].name : null;
  }

  /**
   * Get relevant questions based on chief complaint and already answered questions
   */
  getNextQuestions(
    chiefComplaint: string,
    answeredQuestionIds: string[],
    maxQuestions: number = 3
  ): QuestionTemplate[] {
    const category = this.identifyChiefComplaint(chiefComplaint);
    
    if (!category || !QUESTION_BANK[category]) {
      return [];
    }

    // Get unanswered questions
    const availableQuestions = QUESTION_BANK[category].filter(
      q => !answeredQuestionIds.includes(q.id)
    );

    // Sort by priority and return top N
    return availableQuestions
      .sort((a, b) => a.priority - b.priority)
      .slice(0, maxQuestions);
  }

  /**
   * Get all questions for a category
   */
  getAllQuestionsForCategory(category: string): QuestionTemplate[] {
    return QUESTION_BANK[category] || [];
  }

  /**
   * Check if a question has been answered based on transcript
   */
  isQuestionAnswered(question: QuestionTemplate, transcript: string): boolean {
    // Simple heuristic: if transcript is long enough and contains relevant keywords
    return transcript.length > 10;
  }
}

// Singleton instance
export const clinicalQuestionEngine = new ClinicalQuestionEngine();
