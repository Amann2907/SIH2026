import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntake } from '../context/IntakeContext';

export default function IntakeSummary() {
  const navigate = useNavigate();
  const { state, submitEncounter } = useIntake();
  const [isPlayingSummary, setIsPlayingSummary] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('item-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const summaryTextHindi = `पेशेंट रमेश कुमार शर्मा, उम्र 54 वर्ष। मुख्य शिकायत: सीने में भारीपन और हल्का दर्द, 1 दिन से। दर्द स्कोर 6/10। पिछला मेडिकल इतिहास: टाइप 2 डायबिटीज। दवाइयाँ: मेटफॉर्मिन 500mg और इकोस्प्रिन 75mg।`;

  const handlePlayReadout = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(summaryTextHindi);
      utterance.lang = 'hi-IN';
      utterance.onstart = () => setIsPlayingSummary(true);
      utterance.onend = () => setIsPlayingSummary(false);
      utterance.onerror = () => setIsPlayingSummary(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingSummary(true);
      setTimeout(() => setIsPlayingSummary(false), 3000);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  const handleConfirmAndSubmit = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    try {
      await submitEncounter();
      navigate('/intake/success');
    } catch (e) {
      console.error(e);
      navigate('/intake/success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      {/* Fixed Top Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/intake/documents')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="font-display font-bold text-on-surface text-lg leading-tight">
                Intake Summary
              </span>
              <span className="text-xs text-primary font-semibold">Final Review & Confirmation</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold">
            Step 4 of 4
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col w-full pt-20 px-4 pb-28 space-y-4 max-w-2xl mx-auto">
        {/* Patient Identity */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
              <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Verified Patient Record</span>
            </div>
            <span className="bg-surface-container-high text-on-surface-variant text-xs px-2.5 py-0.5 rounded-full font-bold">
              OPD Card
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
              RS
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-display font-bold text-on-surface text-lg truncate">{state.patient.name}</h2>
              <p className="text-xs text-on-surface-variant">
                {state.patient.age} Yrs • Male • ID: <span className="font-bold text-primary">{state.patient.id}</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-lg">badge</span>
              <div className="flex flex-col">
                <span className="text-on-surface-variant">ABHA Linked Health ID</span>
                <span className="font-semibold text-on-surface font-mono">{state.patient.abhaId}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-tertiary text-lg">verified</span>
          </div>
        </div>

        {/* Priority Triage & Routing Banner */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border-l-4 border-primary-container space-y-2">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-xl">health_and_safety</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-primary text-base">Calm Priority Check</span>
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                No acute emergency detected. Triaged for cardiology consultation.
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-3 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
              DR
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-primary font-bold uppercase tracking-wider">Routed Specialist</span>
              <span className="font-bold text-on-surface text-sm truncate">Dr. Ramesh Sharma</span>
              <span className="text-xs text-on-surface-variant truncate">Sr. Consultant Cardiologist • OPD Room 12</span>
            </div>
          </div>
        </div>

        {/* Audio Readout Feature Card */}
        <div
          onClick={handlePlayReadout}
          className="bg-secondary-fixed text-on-secondary-fixed rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
              <span className={`material-symbols-outlined text-xl ${isPlayingSummary ? 'animate-bounce' : ''}`}>
                volume_up
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-on-secondary-fixed text-sm truncate">
                पूरी जानकारी सुनें (Hindi Voice)
              </span>
              <span className="text-xs text-on-secondary-fixed-variant truncate">
                Listen to AI summary readout
              </span>
            </div>
          </div>
          <span className="text-xs font-bold bg-secondary text-on-secondary px-3 py-1.5 rounded-full shrink-0">
            {isPlayingSummary ? 'Playing...' : 'Play / सुनें'}
          </span>
        </div>

        {/* Medical Journey Timeline */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-xl">timeline</span>
              <h3 className="font-bold text-on-surface text-base">Medical Journey Timeline</h3>
            </div>
            <span className="text-xs bg-surface-container-low text-primary px-2.5 py-0.5 rounded-md font-bold">
              3 Recorded Events
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-3 before:w-0.5 before:bg-surface-variant">
            {/* Today */}
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center ring-4 ring-surface-container-lowest">
                <span className="w-2 h-2 rounded-full bg-surface-container-lowest"></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary text-sm">Today (Present Visit)</span>
                <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-bold">
                  Active Intake
                </span>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 text-xs space-y-1">
                <p className="font-bold text-on-surface">Chief Complaint: {state.voiceData.chiefComplaint}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded font-semibold">
                    Pain: {state.voiceData.painSeverity}/10
                  </span>
                  <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded font-semibold">
                    Duration: {state.voiceData.onset}
                  </span>
                </div>
              </div>
            </div>

            {/* 6 Mos Ago */}
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center ring-4 ring-surface-container-lowest">
                <span className="material-symbols-outlined text-xs">science</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">Feb 2025 (Lab Test)</span>
                <span className="text-on-surface-variant">6 Mos Ago</span>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 text-xs space-y-1">
                <p className="font-semibold text-on-surface">Routine Diagnostic Panel (Dr. Lal PathLabs)</p>
                <div className="flex items-center space-x-4 pt-1">
                  <div>
                    <span className="text-on-surface-variant block">Fasting Sugar</span>
                    <span className="font-bold text-error">168 mg/dL</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">HbA1c</span>
                    <span className="font-bold text-error">7.2 %</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Oct 2024 */}
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center ring-4 ring-surface-container-lowest">
                <span className="material-symbols-outlined text-xs">history_edu</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">Oct 2024</span>
                <span className="text-on-surface-variant">Initial Diagnosis</span>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3 text-xs">
                <p className="font-semibold text-on-surface">Type 2 Diabetes Mellitus Confirmed</p>
                <p className="text-on-surface-variant mt-0.5">Metformin 500mg OD prescribed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Accordions */}
        <div className="space-y-3">
          <h3 className="font-bold text-on-surface text-base px-1">Clinical Intake Breakdown</h3>

          {/* Accordion 1 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('item-1')}
              className="w-full p-4 flex items-center justify-between text-left active:bg-surface-container-low transition-colors"
              type="button"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">ecg_heart</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-on-surface text-sm truncate">1. Chief Complaint & Present Illness</span>
                  <span className="text-xs text-on-surface-variant truncate">सीने में दबाव और दर्द</span>
                </div>
              </div>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${openAccordion === 'item-1' ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {openAccordion === 'item-1' && (
              <div className="px-4 pb-4 space-y-2 text-xs">
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <span className="text-outline uppercase font-semibold">Reported Symptoms</span>
                  <p className="text-on-surface font-medium mt-1 leading-relaxed">
                    Patient reports chest pressure and mild discomfort radiating towards the left arm. Symptoms started yesterday.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface-container-low p-2.5 rounded-xl">
                    <span className="text-on-surface-variant">Pain Score</span>
                    <span className="font-bold text-on-surface block mt-0.5">{state.voiceData.calculatedSeverity}</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-xl">
                    <span className="text-on-surface-variant">Duration</span>
                    <span className="font-bold text-on-surface block mt-0.5">{state.voiceData.onset}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('item-2')}
              className="w-full p-4 flex items-center justify-between text-left active:bg-surface-container-low transition-colors"
              type="button"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">medical_information</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-on-surface text-sm truncate">2. Past Medical History & Rx</span>
                  <span className="text-xs text-on-surface-variant truncate">टाइप 2 डायबिटीज • दवाइयाँ</span>
                </div>
              </div>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${openAccordion === 'item-2' ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {openAccordion === 'item-2' && (
              <div className="px-4 pb-4 space-y-2 text-xs">
                <div className="bg-surface-container-low p-3 rounded-xl space-y-1">
                  <span className="font-bold text-on-surface block">Type 2 Diabetes Mellitus</span>
                  <span className="text-on-surface-variant block">Active Medications: Tab Metformin 500mg (OD), Ecosprin 75mg</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Digital Confirmation Checkbox */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-start space-x-3">
          <input
            type="checkbox"
            id="confirmCheck"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-primary rounded cursor-pointer"
          />
          <label htmlFor="confirmCheck" className="text-xs text-on-surface leading-normal cursor-pointer select-none">
            I confirm that the above health information provided is accurate to the best of my knowledge and can be shared with Dr. Ramesh Sharma for consultation.
          </label>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md p-4 border-t border-surface-container shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleConfirmAndSubmit}
            disabled={!agreed || isSubmitting}
            className={`w-full h-14 rounded-xl text-on-primary font-bold text-lg flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all ${
              agreed && !isSubmitting ? 'bg-primary hover:bg-primary-container' : 'bg-outline-variant cursor-not-allowed'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            <span>{isSubmitting ? 'Submitting...' : 'पुष्टि करें और डॉक्टर को भेजें / Submit to Doctor'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
