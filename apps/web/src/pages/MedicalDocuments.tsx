import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntake } from '../context/IntakeContext';
import { ocrService } from '../services/ocrService';

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  ocrScore?: number;
  extractedData?: {
    diagnosis?: string;
    medications?: string[];
    labValues?: Record<string, string>;
  };
}

export default function MedicalDocuments() {
  const navigate = useNavigate();
  const { state, updateDocumentData, addDocument } = useIntake();
  const [selectedCategory, setSelectedCategory] = useState(state.documentData.category);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // File input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  /**
   * Handle file upload from any source (camera, PDF, gallery)
   */
  const handleFileUpload = async (files: FileList | null, source: string) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validPdfType = 'application/pdf';
    
    if (!validImageTypes.includes(file.type) && file.type !== validPdfType) {
      showToast('❌ Invalid file type. Please upload an image (JPG, PNG) or PDF.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('❌ File too large. Maximum size is 10MB.');
      return;
    }

    showToast(`📤 Uploading ${file.name}...`);

    // Create preview for images
    let preview: string | undefined;
    if (validImageTypes.includes(file.type)) {
      preview = URL.createObjectURL(file);
    }

    // Add to uploaded files
    const uploadedFile: UploadedFile = {
      file,
      preview,
      status: 'uploading',
    };
    
    setUploadedFiles(prev => [...prev, uploadedFile]);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update status to processing
      setUploadedFiles(prev => 
        prev.map(f => f.file === file ? { ...f, status: 'processing' } : f)
      );
      showToast('🔍 Processing with OCR engine...');

      // Process with OCR service
      const result = await ocrService.processClinicalDocument(file);

      // Update with results
      setUploadedFiles(prev =>
        prev.map(f =>
          f.file === file
            ? {
                ...f,
                status: 'completed',
                ocrScore: Math.round(result.ocr.confidence),
                extractedData: {
                  diagnosis: result.structuredData.diagnosis[0],
                  medications: result.structuredData.medications.map(m => 
                    `${m.name}${m.dosage ? ' ' + m.dosage : ''}${m.frequency ? ' - ' + m.frequency : ''}`
                  ),
                  labValues: result.structuredData.labValues.reduce((acc, lab) => {
                    acc[lab.test] = `${lab.value} ${lab.unit || ''} ${lab.status ? '(' + lab.status.toUpperCase() + ')' : ''}`.trim();
                    return acc;
                  }, {} as Record<string, string>),
                },
              }
            : f
        )
      );

      // Add to context
      addDocument({
        id: `DOC-${Date.now()}`,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        name: file.name,
        url: preview || '',
        uploadedAt: new Date().toISOString(),
        ocrScore: Math.round(result.ocr.confidence),
        diagnosis: result.structuredData.diagnosis[0],
        medications: result.structuredData.medications.map(m => 
          `${m.name}${m.dosage ? ' ' + m.dosage : ''}${m.frequency ? ' - ' + m.frequency : ''}`
        ),
      });

      showToast(`✅ ${file.name} processed successfully! OCR Score: ${Math.round(result.ocr.confidence)}%`);
    } catch (error) {
      console.error('OCR processing error:', error);
      setUploadedFiles(prev =>
        prev.map(f => f.file === file ? { ...f, status: 'error' } : f)
      );
      showToast('❌ Error processing document. Please try again.');
    }
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerPdfUpload = () => {
    pdfInputRef.current?.click();
  };

  const triggerGalleryUpload = () => {
    galleryInputRef.current?.click();
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
        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileUpload(e.target.files, 'camera')}
          className="hidden"
        />
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileUpload(e.target.files, 'pdf')}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files, 'gallery')}
          className="hidden"
        />
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
              onClick={triggerCamera}
              className="h-12 px-5 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center space-x-1.5 shadow-sm active:scale-95 transition-transform shrink-0"
              type="button"
            >
              <span>Scan</span>
              <span className="material-symbols-outlined text-lg">photo_camera</span>
            </button>
          </div>
        </div>

        {/* Quick Upload Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={triggerPdfUpload}
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
            onClick={triggerGalleryUpload}
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
        {uploadedFiles.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">check</span>
                </span>
                <span className="font-bold text-on-surface text-sm">
                  {uploadedFiles.filter(f => f.status === 'completed').length} Report{uploadedFiles.filter(f => f.status === 'completed').length !== 1 ? 's' : ''} Extracted
                </span>
              </div>
              {uploadedFiles.some(f => f.ocrScore) && (
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary text-xs font-bold">
                  OCR Score {Math.round(uploadedFiles.filter(f => f.ocrScore).reduce((sum, f) => sum + (f.ocrScore || 0), 0) / uploadedFiles.filter(f => f.ocrScore).length)}%
                </span>
              )}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.map((uploadedFile, idx) => (
              <div key={idx} className="flex flex-col rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden border border-surface-container">
                <div className="px-4 py-2.5 bg-surface-container-low flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-primary font-bold">
                    <span className="material-symbols-outlined text-base">
                      {uploadedFile.status === 'uploading' ? 'upload' : uploadedFile.status === 'processing' ? 'processing' : 'auto_awesome'}
                    </span>
                    <span>
                      {uploadedFile.status === 'uploading' && 'Uploading...'}
                      {uploadedFile.status === 'processing' && 'Processing OCR...'}
                      {uploadedFile.status === 'completed' && 'AI Extracted • Verified by OCR'}
                      {uploadedFile.status === 'error' && 'Error Processing'}
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-medium truncate max-w-[150px]">
                    {uploadedFile.file.name}
                  </span>
                </div>

                {uploadedFile.preview && (
                  <div className="px-4 pt-3">
                    <img 
                      src={uploadedFile.preview} 
                      alt="Uploaded document" 
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  </div>
                )}

                {uploadedFile.status === 'completed' && uploadedFile.extractedData && (
                  <div className="p-4 space-y-4">
                    {/* Diagnosis */}
                    {uploadedFile.extractedData.diagnosis && (
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xl">clinical_notes</span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs text-outline uppercase font-semibold">Identified Diagnosis / निदान</span>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="font-bold text-on-surface text-base">
                              {uploadedFile.extractedData.diagnosis}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">
                              Confirmed
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medications */}
                    {uploadedFile.extractedData.medications && uploadedFile.extractedData.medications.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xl">medication</span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs text-outline uppercase font-semibold">Current Medicine / दवाइयाँ</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {uploadedFile.extractedData.medications.map((med) => (
                              <span key={med} className="px-3 py-1 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lab Vitals */}
                    {uploadedFile.extractedData.labValues && Object.keys(uploadedFile.extractedData.labValues).length > 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xl">monitor_heart</span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs text-outline uppercase font-semibold">Recent Lab Values / जांच</span>
                          <div className="space-y-1.5 mt-1">
                            {Object.entries(uploadedFile.extractedData.labValues).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-xl text-xs">
                                <span className="font-bold text-on-surface">{key}</span>
                                <span className="font-bold text-error">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-on-surface-variant">
                        {uploadedFile.status === 'uploading' ? 'Uploading file...' : 'Processing with OCR engine...'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
