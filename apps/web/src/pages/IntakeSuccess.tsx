import { useNavigate } from 'react-router-dom';
import { useIntake } from '../context/IntakeContext';

export default function IntakeSuccess() {
  const navigate = useNavigate();
  const { startNewSession } = useIntake();

  const handleNewPatient = () => {
    startNewSession();
    navigate('/');
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl p-8 shadow-xl text-center space-y-6">
        {/* Success Icon */}
        <div className="relative flex items-center justify-center mx-auto">
          <div className="w-24 h-24 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-lg animate-bounce">
            <span className="material-symbols-outlined text-5xl font-bold">check_circle</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-on-surface">
            Intake Completed!
          </h1>
          <p className="text-lg text-tertiary font-bold">
            आपकी जानकारी सफलतापूर्वक जमा हो गई है
          </p>
        </div>

        {/* Token Box */}
        <div className="bg-surface-container-low rounded-2xl p-6 space-y-3">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Triage Token Number</span>
          <div className="text-5xl font-display font-black text-primary">
            #04
          </div>
          <div className="pt-2 flex items-center justify-center space-x-2 text-xs font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-base text-secondary">schedule</span>
            <span>Est. Wait Time: <strong className="text-on-surface">8 Minutes</strong></span>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="bg-surface-container rounded-xl p-4 text-left flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">
            DR
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-primary font-bold">Assigned Specialist</span>
            <span className="font-bold text-on-surface text-sm truncate">Dr. Ramesh Sharma</span>
            <span className="text-xs text-on-surface-variant truncate">Cardiology OPD • Room 12</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate('/doctor')}
            className="w-full h-14 rounded-xl bg-primary text-on-primary font-bold text-base flex items-center justify-center space-x-2 shadow-lg hover:bg-primary-container transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">medical_services</span>
            <span>Doctor View / डॉक्टर क्यू देखें</span>
          </button>

          <button
            onClick={handleNewPatient}
            className="w-full h-12 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-all active:scale-95"
            type="button"
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="material-symbols-outlined text-lg">person_add</span>
              <span>नया मरीज / Start New Patient Intake</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
