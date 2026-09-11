import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntake } from '../context/IntakeContext';
import { speechService, mapLanguageToSpeechLang } from '../services/speechService';
import { redFlagDetector, type RedFlag } from '../services/redFlagDetector';

export default function VoiceIntake() {
  const navigate = useNavigate();
  const { state, updateVoiceData } = useIntake();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isSpeechSupported] = useState(speechService.isSupported());
  const [detectedRedFlags, setDetectedRedFlags] = useState<RedFlag[]>([]);
  const [triagePriority, setTriagePriority] = useState<'EMERGENCY' | 'URGENT' | 'ROUTINE'>('ROUTINE');

  useEffect(() => {
    const speechLang = mapLanguageToSpeechLang(state.language);
    speechService.setLanguage(speechLang);
  }, [state.language]);

  // Auto-detect red flags whenever chief complaint changes
  useEffect(() => {
    if (state.voiceData.chiefComplaint) {
      const flags = redFlagDetector.detectRedFlags(
        state.voiceData.chiefComplaint,
        [],
        {}
      );
      setDetectedRedFlags(flags);
      
      if (flags.length > 0) {
        const triage = redFlagDetector.performTriage(flags);
        setTriagePriority(triage.priority);
        
        // Add to context for persistence
        flags.forEach(flag => {
          if (!state.redFlags.some(rf => rf.id === flag.id)) {
            // Will be added via context action if needed
          }
        });
      }
    }
  }, [state.voiceData.chiefComplaint]);

  const questionHindi = "आपको सबसे ज्यादा परेशानी किस चीज़ की हो रही है और कब से है?";
  const questionEng = "What is bothering you the most right now, and when did it start?";

  const handleReplayVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questionHindi);
      utterance.lang = 'hi-IN';
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  const toggleMic = () => {
    if (!isSpeechSupported) {
      setErrorMessage('आपका ब्राउज़र वॉइस रिकग्निशन सपोर्ट नहीं करता। / Speech recognition not supported. Please type instead.');
      setShowTypeInput(true);
      return;
    }

    if (isRecording) {
      speechService.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      setErrorMessage('');
      setPermissionDenied(false);
      
      const success = speechService.start(
        (result) => {
          if (result.isFinal) {
            const finalText = result.transcript.trim();
            if (finalText) {
              updateVoiceData({ chiefComplaint: finalText });
              setInterimTranscript('');
            }
          } else {
            setInterimTranscript(result.transcript);
          }
        },
        (error) => {
          setIsRecording(false);
          setInterimTranscript('');
          setErrorMessage(error.message);
          
          if (error.error === 'not-allowed') {
            setPermissionDenied(true);
          }
        },
        () => {
          setIsRecording(false);
          setInterimTranscript('');
        }
      );

      if (success) {
        setIsRecording(true);
      }
    }
  };

  const handleSeverityChange = (level: number) => {
    let label = `${level} / 10 (${level <= 3 ? 'Mild' : level <= 7 ? 'Moderate' : 'Severe'})`;
    updateVoiceData({ painSeverity: level, calculatedSeverity: label });
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      {/* Top Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/language')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="font-display font-bold text-on-surface text-lg leading-tight">
                Voice Symptom Intake
              </span>
              <span className="text-xs text-primary font-semibold">MediKiosk Care Assistant</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReplayVoice}
              className={`h-10 px-3 rounded-full bg-surface-container text-on-surface flex items-center space-x-1 active:scale-95 transition-all ${isPlayingAudio ? 'ring-2 ring-primary animate-pulse' : ''}`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg text-primary">volume_up</span>
              <span className="text-xs font-semibold">{isPlayingAudio ? 'Playing...' : 'Listen'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col w-full pt-20 px-4 pb-28 space-y-4 max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-primary">Step 2 of 4</span>
            <span className="text-on-surface-variant">Main Health Problem • मुख्य समस्या</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden flex">
            <div className="w-2/4 h-full bg-primary rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Patient Badge */}
        <div className="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold text-xs">
              RS
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-on-surface text-sm">{state.patient.name}</span>
              <span className="text-outline text-xs">•</span>
              <span className="text-xs text-on-surface-variant">{state.patient.age} {state.patient.gender}</span>
            </div>
          </div>
          <span className="text-xs bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant font-medium">
            {state.patient.id}
          </span>
        </div>

        {/* Red Flag Alert Banner */}
        {detectedRedFlags.length > 0 && (
          <div className={`rounded-2xl p-5 shadow-lg border-2 animate-pulse ${
            triagePriority === 'EMERGENCY' 
              ? 'bg-error/10 border-error' 
              : triagePriority === 'URGENT'
              ? 'bg-tertiary/10 border-tertiary'
              : 'bg-surface-container-low border-outline-variant'
          }`}>
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                triagePriority === 'EMERGENCY' ? 'bg-error/20' : 'bg-tertiary/20'
              }`}>
                <span className={`material-symbols-outlined text-2xl ${
                  triagePriority === 'EMERGENCY' ? 'text-error' : 'text-tertiary'
                }`}>
                  {triagePriority === 'EMERGENCY' ? 'emergency' : 'warning'}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className={`font-bold text-base ${
                    triagePriority === 'EMERGENCY' ? 'text-error' : 'text-tertiary'
                  }`}>
                    {triagePriority === 'EMERGENCY' ? '🚨 EMERGENCY ALERT / आपातकालीन चेतावनी' : '⚠️ URGENT ATTENTION / तत्काल ध्यान'}
                  </h4>
                  <p className="text-sm text-on-surface mt-1">
                    {state.language === 'Hindi' ? detectedRedFlags[0].descriptionHi : detectedRedFlags[0].description}
                  </p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-3">
                  <p className="text-xs font-semibold text-on-surface">
                    {state.language === 'Hindi' ? detectedRedFlags[0].recommendationHi : detectedRedFlags[0].recommendation}
                  </p>
                </div>
                {detectedRedFlags.length > 1 && (
                  <p className="text-xs text-on-surface-variant">
                    +{detectedRedFlags.length - 1} more warning{detectedRedFlags.length > 2 ? 's' : ''} detected
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Doctor Triage Question Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-sm">clinical_notes</span>
              </span>
              <span className="text-xs font-bold text-primary">Triage Question 1</span>
            </div>
            <button
              onClick={handleReplayVoice}
              className="flex items-center space-x-1 px-3 py-1 bg-surface-container text-primary rounded-full text-xs font-semibold active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">volume_up</span>
              <span>Replay Voice</span>
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-display font-bold text-on-surface leading-snug">
              "{questionHindi}"
            </p>
            <p className="text-sm text-on-surface-variant">
              {questionEng}
            </p>
          </div>
        </div>

        {/* Central Voice Interaction Console */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md flex flex-col items-center text-center space-y-4 relative overflow-hidden">
          {/* Audio Waves */}
          <div className="w-full flex items-center justify-center space-x-1.5 h-10 px-4 bg-surface-container-low rounded-xl">
            <span className={`w-1.5 rounded-full bg-primary ${isRecording ? 'h-8 animate-bounce' : 'h-4'}`}></span>
            <span className={`w-1.5 rounded-full bg-primary ${isRecording ? 'h-10 animate-bounce' : 'h-7'}`}></span>
            <span className={`w-1.5 rounded-full bg-primary ${isRecording ? 'h-6 animate-bounce' : 'h-3'}`}></span>
            <span className={`w-1.5 rounded-full bg-primary ${isRecording ? 'h-9 animate-bounce' : 'h-8'}`}></span>
            <span className="text-xs font-bold text-primary ml-2">
              {isRecording ? 'Listening... बोलिए' : `Audio synced (${state.language})`}
            </span>
          </div>

          {/* Mic Button */}
          <div className="relative flex items-center justify-center my-2">
            {isRecording && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-primary-fixed/40 animate-ping"></div>
                <div className="absolute w-24 h-24 rounded-full bg-secondary-fixed/50"></div>
              </>
            )}
            <button
              onClick={toggleMic}
              className={`relative z-10 w-20 h-20 rounded-full text-on-primary shadow-xl flex items-center justify-center transition-all active:scale-95 ${
                isRecording ? 'bg-error animate-pulse' : 'bg-primary hover:bg-primary-container'
              }`}
              type="button"
              disabled={permissionDenied && !isSpeechSupported}
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isRecording ? 'mic' : 'mic'}
              </span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-on-surface">
              {isRecording ? 'Recording Live... बोल रहे हैं' : 'Tap to Speak / बोलने के लिए टैप करें'}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {isRecording ? 'Listening...' : 'Speak in your native dialect naturally'}
            </p>
            
            {/* Error Message Display */}
            {errorMessage && (
              <div className="mt-2 p-3 rounded-xl bg-error/10 border border-error/20">
                <div className="flex items-start space-x-2">
                  <span className="material-symbols-outlined text-error text-lg mt-0.5">error</span>
                  <p className="text-sm text-error flex-1">{errorMessage}</p>
                </div>
              </div>
            )}
            
            {/* Permission Denied Help */}
            {permissionDenied && (
              <div className="mt-2 p-3 rounded-xl bg-surface-container-low">
                <p className="text-xs text-on-surface-variant">
                  To enable microphone: Settings → Site Settings → Microphone → Allow
                </p>
              </div>
            )}
          </div>

          {/* Mode switch button */}
          <button
            onClick={() => setShowTypeInput(!showTypeInput)}
            className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-base">keyboard</span>
            <span>{showTypeInput ? 'Use Mic / बोलकर बताएं' : 'I prefer to type / लिखकर बताएं'}</span>
          </button>

          {showTypeInput && (
            <div className="w-full pt-2">
              <textarea
                value={state.voiceData.chiefComplaint}
                onChange={(e) => updateVoiceData({ chiefComplaint: e.target.value })}
                className="w-full p-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="अपनी समस्या यहाँ लिखें..."
              />
            </div>
          )}
        </div>

        {/* Live Speech Transcription Feed */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Live Transcription</span>
            </div>
            <button
              onClick={() => setIsEditingTranscript(!isEditingTranscript)}
              className="text-primary text-xs font-semibold flex items-center space-x-1 hover:underline"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>{isEditingTranscript ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 space-y-1">
            {isEditingTranscript ? (
              <textarea
                value={state.voiceData.chiefComplaint}
                onChange={(e) => updateVoiceData({ chiefComplaint: e.target.value })}
                className="w-full p-2 rounded-lg bg-surface-container-lowest text-on-surface text-base focus:outline-none"
                rows={3}
                placeholder="अपनी समस्या यहाँ लिखें..."
              />
            ) : (
              <>
                {isRecording && interimTranscript && (
                  <p className="text-base text-on-surface-variant italic animate-pulse">
                    "{interimTranscript}"
                  </p>
                )}
                {state.voiceData.chiefComplaint ? (
                  <>
                    <p className="text-lg font-semibold text-on-surface leading-relaxed">
                      "{state.voiceData.chiefComplaint}"
                    </p>
                    {state.voiceData.englishTranslation && (
                      <p className="text-xs text-on-surface-variant italic">
                        ({state.voiceData.englishTranslation})
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base text-on-surface-variant text-center py-4">
                    {isRecording
                      ? 'सुन रहे हैं... / Listening...'
                      : 'कोई ट्रांसक्रिप्ट नहीं / No transcript yet. Tap microphone to speak.'}
                  </p>
                )}
              </>
            )}
          </div>

          {/* AI Extracted Signals */}
          <div className="space-y-2 pt-1">
            <span className="text-xs text-outline font-semibold">Auto-Extracted Clinical Signals</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-surface-container p-3 rounded-xl text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-lg shrink-0">check_circle</span>
                  <span className="font-bold text-on-surface">Chief Complaint:</span>
                  <span className="text-on-surface truncate">Chest Heaviness & Pain</span>
                </div>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-bold shrink-0">
                  High Conf.
                </span>
              </div>
              <div className="flex items-center justify-between bg-surface-container p-3 rounded-xl text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="material-symbols-outlined text-primary text-lg shrink-0">schedule</span>
                  <span className="font-bold text-on-surface">Duration / Onset:</span>
                  <span className="text-on-surface truncate">{state.voiceData.onset}</span>
                </div>
                <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded font-bold shrink-0">
                  Detected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Tile Rating Scale */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-on-surface text-base">Pain & Severity Level</h4>
              <p className="text-xs text-on-surface-variant">दर्द का स्तर चुनें (1-10)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              {state.voiceData.calculatedSeverity}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = state.voiceData.painSeverity === num;
              return (
                <button
                  key={num}
                  onClick={() => handleSeverityChange(num)}
                  className={`h-12 rounded-xl text-lg font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-md scale-105'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  {num}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant px-1 pt-1">
            <span>1: Mild (हल्का)</span>
            <span>5: Moderate (मध्यम)</span>
            <span>10: Severe (असहनीय)</span>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md p-4 border-t border-surface-container shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center space-x-3">
          <button
            onClick={() => toggleMic()}
            className="h-14 px-5 rounded-xl bg-surface-container text-on-surface font-bold text-sm flex items-center justify-center space-x-2 active:scale-95 transition-all shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">refresh</span>
            <span>Speak Again</span>
          </button>
          <button
            onClick={() => navigate('/intake/documents')}
            className="h-14 flex-1 rounded-xl bg-primary text-on-primary font-bold text-lg flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all hover:bg-primary-container"
            type="button"
          >
            <span>अगला सवाल / Continue</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
