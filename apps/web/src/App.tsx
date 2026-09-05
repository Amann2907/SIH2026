import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { IntakeProvider } from './context/IntakeContext';
import Home from './pages/Home';
import LanguageSelection from './pages/LanguageSelection';
import VoiceIntake from './pages/VoiceIntake';
import MedicalDocuments from './pages/MedicalDocuments';
import IntakeSummary from './pages/IntakeSummary';
import IntakeSuccess from './pages/IntakeSuccess';
import DoctorDashboard from './pages/DoctorDashboard';

function QuickNavHeader() {
  return (
    <div className="bg-inverse-surface text-inverse-on-surface text-xs py-1.5 px-4 flex items-center justify-between z-[100] relative">
      <div className="flex items-center space-x-2 font-bold">
        <span className="material-symbols-outlined text-primary-fixed text-base">domain</span>
        <span>CUREX Clinical Platform (Single Port Demo)</span>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-primary-fixed transition-colors font-semibold">Home</Link>
        <Link to="/language" className="hover:text-primary-fixed transition-colors font-semibold">Patient Intake</Link>
        <Link to="/doctor" className="hover:text-primary-fixed transition-colors font-semibold flex items-center space-x-1">
          <span className="material-symbols-outlined text-sm">stethoscope</span>
          <span>Doctor View</span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <IntakeProvider>
      <Router>
        <QuickNavHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/language" element={<LanguageSelection />} />
          <Route path="/intake/voice" element={<VoiceIntake />} />
          <Route path="/intake/documents" element={<MedicalDocuments />} />
          <Route path="/intake/summary" element={<IntakeSummary />} />
          <Route path="/intake/success" element={<IntakeSuccess />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Routes>
      </Router>
    </IntakeProvider>
  );
}

export default App;
