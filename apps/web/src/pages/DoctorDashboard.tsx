import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntake } from '../context/IntakeContext';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { state } = useIntake();
  const [activeTab, setActiveTab] = useState<'queue' | 'review'>('review');
  const [doctorNotes, setDoctorNotes] = useState('Patient reviewed. Symptoms consistent with non-acute chest discomfort. Continue Metformin 500mg. Ordered ECG and Trop-I test.');
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      {/* Doctor Navigation Bar */}
      <header className="bg-surface-container-lowest border-b border-surface-container shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">medical_services</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-on-surface text-lg">Dr. Ramesh Sharma</span>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">Sr. Cardiologist</span>
              </div>
              <p className="text-xs text-on-surface-variant">OPD Station #12 • CUREX Triage Queue</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/language')}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high active:scale-95 transition-all flex items-center space-x-1"
              type="button"
            >
              <span className="material-symbols-outlined text-base">kiosk</span>
              <span>Kiosk Mode</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 grid lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Patient Queue */}
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-on-surface text-base">Active Patient Queue</h2>
              <span className="bg-primary text-on-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                2 Waiting
              </span>
            </div>

            {/* Queue Items */}
            <div className="space-y-2">
              {/* Item 1 - Active Patient from Intake */}
              <div
                onClick={() => setActiveTab('review')}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  activeTab === 'review'
                    ? 'bg-surface-container-low border-primary shadow-sm'
                    : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Token #04</span>
                  <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded">
                    Calm Priority
                  </span>
                </div>
                <div className="font-bold text-on-surface text-sm mt-1">{state.patient.name}</div>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  Chief Complaint: {state.voiceData.chiefComplaint}
                </p>
                <div className="flex items-center justify-between text-[11px] text-outline mt-2 pt-1 border-t border-surface-container/60">
                  <span>54M • ABHA Linked</span>
                  <span className="text-tertiary font-bold">Intake Complete</span>
                </div>
              </div>

              {/* Item 2 - Sample Urgent Patient */}
              <div className="p-3.5 rounded-xl border border-surface-container bg-surface-container-lowest opacity-75">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface-variant">Token #03</span>
                  <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded">
                    Urgent Escalation
                  </span>
                </div>
                <div className="font-bold text-on-surface text-sm mt-1">Suresh Patel</div>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  High BP (170/110) & Dizziness
                </p>
                <div className="flex items-center justify-between text-[11px] text-outline mt-2 pt-1 border-t border-surface-container/60">
                  <span>62M • Triage #02</span>
                  <span className="text-secondary font-bold">With Nurse</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Clinical Case Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status Alert if Verified */}
          {isVerified && (
            <div className="p-4 rounded-2xl bg-tertiary-container text-on-tertiary-container shadow-md flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-2xl font-bold">verified</span>
                <div>
                  <h4 className="font-bold text-sm">Encounter Verified & Clinical Summary Signed</h4>
                  <p className="text-xs opacity-90">Prescription and summary pushed to patient ABHA record.</p>
                </div>
              </div>
              <button
                onClick={() => setIsVerified(false)}
                className="text-xs underline font-bold"
              >
                Edit
              </button>
            </div>
          )}

          {/* Patient Overview Header Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-display font-bold text-xl flex items-center justify-center">
                  RS
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-display font-bold text-on-surface">{state.patient.name}</h1>
                    <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Token #04
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {state.patient.age} Yrs • Male • ABHA ID: <span className="font-mono text-primary font-bold">{state.patient.abhaId}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-surface-container-high text-primary font-bold text-xs px-3 py-1.5 rounded-full">
                  Language: {state.language}
                </span>
                <span className="bg-surface-container-high text-secondary font-bold text-xs px-3 py-1.5 rounded-full">
                  Mode: {state.mode}
                </span>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="bg-surface-container-low rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary flex items-center space-x-1">
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  <span>AI Generated Clinical History Summary</span>
                </span>
                <span className="text-on-surface-variant font-semibold">Triage Confidence: 96%</span>
              </div>
              <p className="text-sm font-medium text-on-surface leading-relaxed">
                Patient reports 24-hour history of retrosternal chest heaviness and pain (Pain Score {state.voiceData.painSeverity}/10). Known history of Type 2 Diabetes Mellitus (diagnosed Oct 2024), currently taking Metformin 500mg. Recent lab blood test shows Fasting Blood Sugar 168 mg/dL.
              </p>
            </div>

            {/* Structured Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              {/* Voice Transcript Card */}
              <div className="bg-surface-container rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-outline font-bold">
                  <span className="flex items-center space-x-1">
                    <span className="material-symbols-outlined text-base text-primary">mic</span>
                    <span>Voice Recording Transcript</span>
                  </span>
                  <span>{state.language}</span>
                </div>
                <p className="text-on-surface font-semibold italic">"{state.voiceData.chiefComplaint}"</p>
                <p className="text-on-surface-variant">({state.voiceData.englishTranslation})</p>
              </div>

              {/* Extracted Medical OCR Card */}
              <div className="bg-surface-container rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-outline font-bold">
                  <span className="flex items-center space-x-1">
                    <span className="material-symbols-outlined text-base text-secondary">document_scanner</span>
                    <span>OCR Extracted Documents</span>
                  </span>
                  <span>1 File</span>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-on-surface">Diagnosis: Type 2 Diabetes</div>
                  <div className="text-on-surface-variant">Active Rx: Metformin 500mg (OD), Ecosprin 75mg</div>
                  <div className="text-error font-semibold">Lab: Fasting Sugar 168 mg/dL (High)</div>
                </div>
              </div>
            </div>

            {/* Doctor Notes & Verification Action */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Doctor Assessment & Prescribed Actions
              </label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Enter clinical notes, diagnosis verification, or updated treatment plan..."
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => navigate('/intake/summary')}
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-all"
                  type="button"
                >
                  View Full Patient Timeline
                </button>

                <button
                  onClick={() => setIsVerified(true)}
                  className="px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-bold flex items-center space-x-2 shadow-md hover:bg-primary-container active:scale-95 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span>Confirm & Sign Encounter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
