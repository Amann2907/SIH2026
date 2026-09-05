import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'Hindi' | 'English' | 'Bengali' | 'Marathi' | 'Tamil' | 'Telugu' | 'Gujarati' | 'Kannada';
export type Mode = 'voice' | 'touch' | 'assisted';

export interface ExtractedDocument {
  id: string;
  type: string;
  name: string;
  extractedAt: string;
  ocrConfidence: number;
  diagnosis: string;
  medications: string[];
  labValue: { name: string; value: string; status: 'Normal' | 'High' | 'Low' };
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
  };
  documentData: {
    category: string;
    documents: ExtractedDocument[];
  };
  summaryConfirmed: boolean;
  encounterId: string | null;
  status: 'draft' | 'submitted' | 'verified';
}

interface IntakeContextType {
  state: IntakeState;
  setLanguage: (lang: Language) => void;
  setMode: (mode: Mode) => void;
  updateVoiceData: (data: Partial<IntakeState['voiceData']>) => void;
  updateDocumentData: (category: string, docs?: ExtractedDocument[]) => void;
  submitEncounter: () => Promise<string>;
  resetIntake: () => void;
}

const defaultState: IntakeState = {
  language: 'Hindi',
  mode: 'voice',
  patient: {
    id: 'CUREX-10428',
    name: 'Ramesh Kumar Sharma',
    age: 54,
    gender: 'M',
    abhaId: '91-4821-9032-11',
  },
  voiceData: {
    chiefComplaint: 'कल शाम से सीने में भारीपन और हल्का दर्द महसूस हो रहा है।',
    englishTranslation: 'Chest heaviness and mild pain since yesterday evening.',
    painSeverity: 6,
    onset: '~24 hrs (Yesterday Evening)',
    calculatedSeverity: '6 / 10 (Moderate to Severe)',
  },
  documentData: {
    category: 'Prescription (पर्ची)',
    documents: [
      {
        id: 'doc-1',
        type: 'Prescription',
        name: 'Dr. Ramesh Sharma Rx',
        extractedAt: 'Aug 2024',
        ocrConfidence: 98,
        diagnosis: 'Type 2 Diabetes Mellitus',
        medications: ['Tab Metformin 500mg (OD)', 'Ecosprin 75mg'],
        labValue: { name: 'Fasting Blood Sugar', value: '168 mg/dL', status: 'High' },
      },
    ],
  },
  summaryConfirmed: false,
  encounterId: null,
  status: 'draft',
};

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

export const IntakeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IntakeState>(() => {
    const saved = localStorage.getItem('curex_intake_state');
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
    localStorage.setItem('curex_intake_state', JSON.stringify(state));
  }, [state]);

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

  const updateDocumentData = (category: string, docs?: ExtractedDocument[]) => {
    setState((prev) => ({
      ...prev,
      documentData: {
        category,
        documents: docs || prev.documentData.documents,
      },
    }));
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
    setState(defaultState);
    localStorage.removeItem('curex_intake_state');
  };

  return (
    <IntakeContext.Provider
      value={{
        state,
        setLanguage,
        setMode,
        updateVoiceData,
        updateDocumentData,
        submitEncounter,
        resetIntake,
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
