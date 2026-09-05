import { useNavigate } from 'react-router-dom';
import { useIntake, Language } from '../context/IntakeContext';

const languages = [
  { code: 'Hindi', native: 'हिन्दी', english: 'Hindi' },
  { code: 'English', native: 'English', english: 'Default English' },
  { code: 'Bengali', native: 'বাংলা', english: 'Bengali' },
  { code: 'Marathi', native: 'मराठी', english: 'Marathi' },
  { code: 'Tamil', native: 'தமிழ்', english: 'Tamil' },
  { code: 'Telugu', native: 'తెలుగు', english: 'Telugu' },
  { code: 'Gujarati', native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'Kannada', native: 'ಕನ್ನಡ', english: 'Kannada' },
];

export default function LanguageSelection() {
  const navigate = useNavigate();
  const { state, setLanguage, setMode } = useIntake();

  const handleStartIntake = () => {
    navigate('/intake/voice');
  };


  return (
    <main className="flex flex-col relative w-full bg-surface min-h-screen">
      <div className="flex flex-col w-full px-4 pb-10 space-y-5 select-none">
        {/* Top Header */}
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm relative overflow-hidden">
              <span className="material-symbols-outlined text-on-primary text-2xl font-bold">add</span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container absolute top-2 right-2 ring-2 ring-primary"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-0.5">
                <span className="text-xl font-bold text-primary tracking-tight">CURE</span>
                <span className="text-xl font-black text-primary">X</span>
              </div>
              <span className="text-xs text-on-surface-variant uppercase tracking-wider">Health Intake Kiosk</span>
            </div>
          </div>
          {/* Audio Toggle */}
          <button 
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-surface-container-high text-primary active:bg-primary-container active:text-on-primary-container transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-xl animate-pulse">volume_up</span>
            <span className="text-xs font-semibold">सुनें / Listen</span>
          </button>
        </header>

        {/* Hero Card */}
        <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                Hospital Triage Station #04
              </span>
              <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">
                नमस्ते <span className="text-lg text-on-surface-variant font-normal">/ Welcome to CUREX</span>
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                medical_information
              </span>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant leading-snug">
            डॉक्टर से मिलने से पहले आपकी स्वास्थ्य जानकारी तैयार।
            <span className="block text-on-surface-variant text-xs mt-0.5">Your health story, ready before your consultation.</span>
          </p>
          
          {/* Explanation Box */}
          <div className="rounded-xl bg-surface-container-low p-3 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-lg">clinical_notes</span>
            </div>
            <p className="text-sm text-on-surface leading-normal">
              CUREX helps you easily record symptoms, previous physical prescriptions, and reports before stepping inside the doctor's chamber.
            </p>
          </div>
        </section>

        {/* Step 1: Language Selection */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">1</span>
              <h2 className="text-lg font-semibold text-on-surface">अपनी भाषा चुनें / Select Language</h2>
            </div>
            <span className="text-xs text-primary font-semibold">
              {languages.find(l => l.code === state.language)?.native} ({state.language})
            </span>
          </div>
          
          {/* Language Grid */}
          <div className="grid grid-cols-2 gap-2.5" role="radiogroup">
            {languages.map((lang) => {
              const isSelected = state.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`flex items-center justify-between p-3.5 rounded-xl shadow-sm transition-transform active:scale-[0.98] text-left ${
                    isSelected 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-surface-container-lowest text-on-surface'
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                  type="button"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">{lang.native}</span>
                    <span className={`text-xs ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                      {lang.english}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-on-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-base text-on-primary font-bold">check</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Intake Mode */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 px-1">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">2</span>
            <h2 className="text-lg font-semibold text-on-surface">तरीका चुनें / Intake Mode</h2>
          </div>
          
          {/* Mode Selector */}
          <div className="p-1.5 bg-surface-container rounded-2xl flex items-center gap-1.5">
            <button
              onClick={() => setMode('voice')}
              className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                state.mode === 'voice'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              data-mode="voice"
              type="button"
            >
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                <span className="text-sm font-bold">बोलकर + छूकर</span>
              </div>
              <span className="text-xs text-tertiary font-semibold">Voice + Touch (Rec.)</span>
            </button>
            
            <button
              onClick={() => setMode('touch')}
              className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                state.mode === 'touch'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              data-mode="touch"
              type="button"
            >
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-lg">touch_app</span>
                <span className="text-sm font-semibold">सिर्फ छूकर</span>
              </div>
              <span className="text-xs opacity-75">Touch Only</span>
            </button>
            
            <button
              onClick={() => setMode('assisted')}
              className={`flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                state.mode === 'assisted'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              data-mode="assisted"
              type="button"
            >
              <div className="flex items-center space-x-1">
                <span className="material-symbols-outlined text-lg">record_voice_over</span>
                <span className="text-sm font-semibold">सहायता मोड</span>
              </div>
              <span className="text-xs opacity-75">Assisted Mode</span>
            </button>
          </div>
        </section>

        {/* Audio Feedback Preview */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-xl animate-bounce">graphic_eq</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-on-surface font-semibold">आवाज पहचान सक्रिय / Mic Ready</span>
              <span className="text-xs text-on-surface-variant">Supported in 8 Indian regional dialects</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-primary text-xs font-semibold">ABDM v2.1</span>
        </div>

        {/* CTA Button */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleStartIntake}
            className="w-full h-14 rounded-xl bg-primary text-on-primary text-xl font-semibold flex items-center justify-center space-x-3 shadow-md active:bg-primary-container active:scale-[0.99] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
            <span>शुरू करें / START INTAKE</span>
          </button>
          <p className="text-center text-xs text-on-surface-variant">
            Tap to begin triage registration • कोई दस्तावेज़ की तुरंत ज़रूरत नहीं
          </p>
        </div>
      </div>
    </main>
  );
}
