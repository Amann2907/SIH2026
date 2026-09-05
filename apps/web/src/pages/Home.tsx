import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="bg-surface-container-lowest shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-3xl font-bold">add</span>
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-display font-bold text-primary tracking-tight">CURE</span>
                <span className="text-3xl font-display font-black text-primary">X</span>
              </div>
              <p className="text-sm text-on-surface-variant uppercase tracking-wider">Clinical Intake Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Hero Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="text-center space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-4xl sm:text-5xl font-display font-bold text-on-surface mb-2">
                  नमस्ते / Welcome to CUREX
                </h1>
                <p className="text-xl text-on-surface-variant">
                  Smarter Clinical Intake. Better Prepared Care.
                </p>
              </div>

              {/* Description */}
              <div className="bg-surface-container-low rounded-2xl p-6">
                <p className="text-lg text-on-surface leading-relaxed">
                  CUREX helps you easily record your health history, upload previous medical documents,
                  and prepare structured information before meeting your doctor.
                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4 text-left">
                <div className="bg-surface-container rounded-xl p-4">
                  <span className="material-symbols-outlined text-primary text-3xl mb-2">mic</span>
                  <h3 className="font-semibold text-on-surface mb-1">Voice Input</h3>
                  <p className="text-sm text-on-surface-variant">Speak naturally in your language</p>
                </div>
                <div className="bg-surface-container rounded-xl p-4">
                  <span className="material-symbols-outlined text-secondary text-3xl mb-2">document_scanner</span>
                  <h3 className="font-semibold text-on-surface mb-1">OCR Scanning</h3>
                  <p className="text-sm text-on-surface-variant">Digitize medical documents</p>
                </div>
                <div className="bg-surface-container rounded-xl p-4">
                  <span className="material-symbols-outlined text-tertiary text-3xl mb-2">auto_awesome</span>
                  <h3 className="font-semibold text-on-surface mb-1">AI Summary</h3>
                  <p className="text-sm text-on-surface-variant">Structured clinical history</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  to="/language"
                  className="inline-flex items-center space-x-3 bg-primary hover:bg-primary-container text-on-primary font-display font-bold text-xl px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
                >
                  <span>शुरू करें / START INTAKE</span>
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </Link>
              </div>

              {/* Demo Notice */}
              <div className="pt-4">
                <div className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-lg">info</span>
                  <span className="text-sm font-medium">DEMO MODE - For Demonstration Purposes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-6">
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">For Patients</h3>
              <p className="text-on-surface-variant">
                Complete your health history before consultation. Upload previous reports. Save time.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6">
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">For Doctors</h3>
              <p className="text-on-surface-variant">
                Review structured patient history, uploaded documents, and AI-generated summaries.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-surface-container py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              © 2026 CUREX - Smart Healthcare India
            </p>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-tertiary text-sm">verified_user</span>
              <span className="text-sm text-on-surface-variant">ABDM Compatible</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
