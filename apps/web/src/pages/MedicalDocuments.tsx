import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntake } from '../context/IntakeContext';

export default function MedicalDocuments() {
  const navigate = useNavigate();
  const { state, updateDocumentData } = useIntake();
  const [selectedCategory, setSelectedCategory] = useState(state.documentData.category);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const categories = [
    { name: 'Prescription (पर्ची)', icon: 'receipt_long' },
    { name: 'Lab Blood Test', icon: 'biotech' },
    { name: 'Discharge Summary', icon: 'hotel' },
    { name: 'ECG / X-Ray', icon: 'radiology' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    updateDocumentData(catName);
  };

  const triggerScan = () => {
    setIsScanning(true);
    showToast('Camera Scanner triggered. OCR processing prescription...');
    setTimeout(() => {
      setIsScanning(false);
      showToast('Document processed successfully! (OCR score: 98%)');
    }, 2000);
  };

  const triggerUpload = (type: string) => {
    showToast(`Uploaded ${type}. Extracted Type 2 Diabetes & Metformin 500mg.`);
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-4 z-50 flex items-center justify-between p-4 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl animate-fade-in transition-all">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-inverse-on-surface/80 hover:text-inverse-on-surface">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl pt-safe shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/intake/voice')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="font-display font-bold text-on-surface text-lg leading-tight">
                Medical Reports
              </span>
              <span className="text-xs text-primary font-semibold">OCR Intake Station</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-primary">
            Step 3 of 4
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col w-full pt-20 px-4 pb-28 space-y-4 max-w-2xl mx-auto">
        {/* Title Section */}
        <div className="space-y-2">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Document Verification & Scan
            </span>
            <h1 className="text-2xl font-display font-bold text-on-surface">
              Do you have previous medical reports?
            </h1>
            <p className="text-lg text-primary font-bold">
              क्या आपके पास पुरानी जांच रिपोर्ट या पर्ची है?
            </p>
          </div>

          <div className="flex items-start space-x-2 p-3 rounded-xl bg-surface-container-low text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">info</span>
            <p>
              <strong className="text-on-surface font-semibold">OPTIONAL (वैकल्पिक):</strong> Uploading previous prescriptions or lab test reports helps your doctor understand your health history better.
            </p>
          </div>
        </div>

        {/* Category Chips */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">
            Select Document Type / दस्तावेज़ का प्रकार
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`flex items-center space-x-1.5 px-4 h-11 rounded-full text-sm font-semibold whitespace-nowrap active:scale-95 transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Camera Viewfinder Simulation */}
        <div className="relative flex flex-col rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden">
          <div className="relative h-48 w-full bg-inverse-surface overflow-hidden flex items-center justify-center">
            {/* Background Medical Prescription Image Mock */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <span className="material-symbols-outlined text-primary-fixed text-4xl">document_scanner</span>
                <p className="text-white text-xs font-medium">Place prescription inside viewfinder frame</p>
              </div>
            </div>

            {/* Frame Corners */}
            <div className="absolute inset-4 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between items-start">
                <div className="w-6 h-6 border-t-2 border-l-2 border-primary-fixed rounded-tl-md"></div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/80 backdrop-blur text-on-primary text-xs font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-ping"></span>
                  <span>{isScanning ? 'Scanning...' : 'OCR Ready'}</span>
                </span>
                <div className="w-6 h-6 border-t-2 border-r-2 border-primary-fixed rounded-tr-md"></div>
              </div>
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-80 animate-pulse"></div>
              <div className="flex justify-between items-end">
                <div className="w-6 h-6 border-b-2 border-l-2 border-primary-fixed rounded-bl-md"></div>
                <span className="text-white text-xs bg-black/60 px-2 py-0.5 rounded font-mono">
                  Prescription OCR • Dr. Ramesh Sharma
                </span>
                <div className="w-6 h-6 border-b-2 border-r-2 border-primary-fixed rounded-br-md"></div>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-on-surface text-base">Scan with Camera</span>
                <span className="text-xs text-primary font-semibold truncate">पर्चे की फोटो खींचें (Optical OCR)</span>
              </div>
            </div>
            <button
              onClick={triggerScan}
              className="h-12 px-5 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center space-x-1.5 shadow-sm active:scale-95 transition-transform shrink-0"
              type="button"
            >
              <span>{isScanning ? 'Scanning...' : 'Scan'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Quick Upload Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => triggerUpload('Digital Lab Report PDF')}
            className="flex items-center space-x-3 p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md active:scale-98 transition-all text-left"
            type="button"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-on-surface text-sm truncate">Upload PDF</span>
              <span className="text-xs text-secondary font-semibold">पीडीएफ फाइल चुनें</span>
            </div>
          </button>

          <button
            onClick={() => triggerUpload('Gallery Photo')}
            className="flex items-center space-x-3 p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md active:scale-98 transition-all text-left"
            type="button"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">photo_library</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-on-surface text-sm truncate">From Gallery</span>
              <span className="text-xs text-primary font-semibold">गैलरी से अपलोड</span>
            </div>
          </button>
        </div>

        {/* AI Extracted Result Preview Deck */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">check</span>
              </span>
              <span className="font-bold text-on-surface text-sm">1 Report Extracted</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary text-xs font-bold">
              OCR Score 98%
            </span>
          </div>

          {/* Structured Clinical Card */}
          <div className="flex flex-col rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden border border-surface-container">
            <div className="px-4 py-2.5 bg-surface-container-low flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-primary font-bold">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>AI Extracted • Verified by OCR</span>
              </div>
              <span className="text-on-surface-variant font-medium">Dr. Ramesh Sharma, MD</span>
            </div>

            <div className="p-4 space-y-4">
              {/* Diagnosis */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-xl">clinical_notes</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-outline uppercase font-semibold">Identified Diagnosis / निदान</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="font-bold text-on-surface text-base">
                      {state.documentData.documents[0]?.diagnosis || 'Type 2 Diabetes Mellitus'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-xl">medication</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-outline uppercase font-semibold">Current Medicine / दवाइयाँ</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(state.documentData.documents[0]?.medications || ['Tab Metformin 500mg (OD)', 'Ecosprin 75mg']).map((med) => (
                      <span key={med} className="px-3 py-1 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lab Vitals */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-xl">monitor_heart</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-outline uppercase font-semibold">Recent Lab Value / जांच</span>
                  <div className="flex items-center justify-between mt-1 bg-surface-container-low p-2.5 rounded-xl text-xs">
                    <span className="font-bold text-on-surface">Fasting Blood Sugar</span>
                    <span className="font-bold text-error">168 mg/dL (High)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md p-4 border-t border-surface-container shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/intake/summary')}
            className="w-full h-14 rounded-xl bg-primary text-on-primary font-bold text-lg flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all hover:bg-primary-container"
            type="button"
          >
            <span>आगे बढ़ें / Proceed to Summary</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
