import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'Hindi' | 'English' | 'Bengali' | 'Marathi' | 'Tamil' | 'Telugu' | 'Gujarati' | 'Kannada';
export type Mode = 'voice' | 'touch' | 'assisted';

export interface ExtractedDocument {
  id: string;
  type: string;
  name: string;
  extractedAt: string;
  ocrConfidence: number;
  diagnosis?: string;
  medications?: string[];
  labValue?: { name: string; value: string; status: 'Normal' | 'High' | 'Low' };
  rawText?: string;
}

export interface ClinicalQuestion {
  id: string;
  question: string;
  questionHindi: string;
  answer?: string;
  answeredAt?: string;
  category: string;
}

export interface RedFlag {
  id: string;
  name: string;
  severity: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  description: string;
  triggeredAt: string;
  acknowledged: boolean;
}

export interface IntakeState {
  language: Language;
  mode: Mode;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    abhaId: string;
  };
  voiceData: {
    chiefComplaint: string;
    englishTranslation: string;
    painSeverity: number;
    onset: string;
    calculatedSeverity: string;
    symptoms: string[];
    associatedSymptoms: string[];
  };
  clinicalQuestions: ClinicalQuestion[];
  redFlags: RedFlag[];
  documentData: {
    category: string;
    documents: ExtractedDocument[];
  };
  summaryConfirmed: boolean;
  encounterId: string | null;
  status: 'draft' | 'submitted' | 'verified';
  sessionStarted: string | null;
}

interface IntakeContextType {
  state: IntakeState;
  setLanguage: (lang: Language) => void;
  setMode: (mode: Mode) => void;
  setPatientData: (data: Partial<IntakeState['patient']>) => void;
  updateVoiceData: (data: Partial<IntakeState['voiceData']>) => void;
  addClinicalQuestion: (question: ClinicalQuestion) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  addRedFlag: (redFlag: RedFlag) => void;
  acknowledgeRedFlag: (redFlagId: string) => void;
  updateDocumentData: (category: string, docs?: ExtractedDocument[]) => void;
  addDocument: (doc: ExtractedDocument) => void;
  submitEncounter: () => Promise<string>;
  resetIntake: () => void;
  startNewSession: () => void;
}

const defaultState: IntakeState = {
  language: 'Hindi',
  mode: 'voice',
  patient: {
    id: '',
    name: '',
    age: 0,
    gender: '',
    abhaId: '',
  },
  voiceData: {
    chiefComplaint: '',
    englishTranslation: '',
    painSeverity: 0,
    onset: '',
    calculatedSeverity: '',
    symptoms: [],
    associatedSymptoms: [],
  },
  clinicalQuestions: [],
  redFlags: [],
  documentData: {
    category: '',
    documents: [],
  },
  summaryConfirmed: false,
  encounterId: null,
  status: 'draft',
  sessionStarted: null,
};

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

export const IntakeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IntakeState>(() => {
    const saved = localStorage.getItem('medikiosk_intake_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved intake state', e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('medikiosk_intake_state', JSON.stringify(state));
  }, [state]);

  const setPatientData = (data: Partial<IntakeState['patient']>) => {
    setState((prev) => ({
      ...prev,
      patient: { ...prev.patient, ...data },
    }));
  };

  const setLanguage = (language: Language) => {
    setState((prev) => ({ ...prev, language }));
  };

  const setMode = (mode: Mode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const updateVoiceData = (data: Partial<IntakeState['voiceData']>) => {
    setState((prev) => ({
      ...prev,
      voiceData: { ...prev.voiceData, ...data },
    }));
  };

  const addClinicalQuestion = (question: ClinicalQuestion) => {
    setState((prev) => ({
      ...prev,
      clinicalQuestions: [...prev.clinicalQuestions, question],
    }));
  };

  const answerQuestion = (questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      clinicalQuestions: prev.clinicalQuestions.map((q) =>
        q.id === questionId ? { ...q, answer, answeredAt: new Date().toISOString() } : q
      ),
    }));
  };

  const addRedFlag = (redFlag: RedFlag) => {
    setState((prev) => ({
      ...prev,
      redFlags: [...prev.redFlags, redFlag],
    }));
  };

  const acknowledgeRedFlag = (redFlagId: string) => {
    setState((prev) => ({
      ...prev,
      redFlags: prev.redFlags.map((rf) =>
        rf.id === redFlagId ? { ...rf, acknowledged: true } : rf
      ),
    }));
  };

  const updateDocumentData = (category: string, docs?: ExtractedDocument[]) => {
    setState((prev) => ({
      ...prev,
      documentData: {
        category,
        documents: docs || prev.documentData.documents,
      },
    }));
  };

  const addDocument = (doc: ExtractedDocument) => {
    setState((prev) => ({
      ...prev,
      documentData: {
        ...prev.documentData,
        documents: [...prev.documentData.documents, doc],
      },
    }));
  };

  const startNewSession = () => {
    const newState = {
      ...defaultState,
      language: state.language, // Preserve language preference
      sessionStarted: new Date().toISOString(),
    };
    setState(newState);
    localStorage.setItem('medikiosk_intake_state', JSON.stringify(newState));
  };

  const submitEncounter = async (): Promise<string> => {
    const encounterId = 'ENC-' + Math.floor(100000 + Math.random() * 900000);
    try {
      await fetch('/api/encounters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encounterId,
          patientId: state.patient.id,
          patientName: state.patient.name,
          language: state.language,
          mode: state.mode,
          chiefComplaint: state.voiceData.chiefComplaint,
          painSeverity: state.voiceData.painSeverity,
          documents: state.documentData.documents,
          status: 'IN_QUEUE',
        }),
      });
    } catch (e) {
      console.warn('API endpoint submission offline, storing locally', e);
    }

    setState((prev) => ({
      ...prev,
      encounterId,
      summaryConfirmed: true,
      status: 'submitted',
    }));

    return encounterId;
  };

  const resetIntake = () => {
    const newState = { ...defaultState, sessionStarted: null };
    setState(newState);
    localStorage.removeItem('medikiosk_intake_state');
  };

  return (
    <IntakeContext.Provider
      value={{
        state,
        setLanguage,
        setMode,
        setPatientData,
        updateVoiceData,
        addClinicalQuestion,
        answerQuestion,
        addRedFlag,
        acknowledgeRedFlag,
        updateDocumentData,
        addDocument,
        submitEncounter,
        resetIntake,
        startNewSession,
      }}
    >
      {children}
    </IntakeContext.Provider>
  );
};

export const useIntake = () => {
  const context = useContext(IntakeContext);
  if (!context) {
    throw new Error('useIntake must be used within an IntakeProvider');
  }
  return context;
};
