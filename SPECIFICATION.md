# CUREX - Clinical Intake Platform Specification

**Version:** 1.0.0  
**Last Updated:** September 5, 2026  
**Status:** Analysis Phase

---

## Executive Summary

CUREX is an AI-assisted clinical intake and medical-document digitization platform designed for high-volume Indian and AYUSH hospitals. The platform enables patients to complete their clinical history before meeting the doctor through multilingual voice/touch interfaces, document scanning with OCR, and intelligent red-flag detection.

**Tagline:** "Smarter Clinical Intake. Better Prepared Care."

---

## 1. Product Vision & Purpose

### 1.1 Core Mission
CUREX transforms the clinical intake process by:
- Enabling patients to self-register and provide medical history
- Supporting multilingual voice and touch interactions
- Digitizing physical medical documents using OCR
- Detecting potential emergency symptoms (red flags)
- Generating structured clinical summaries for doctors
- Streamlining hospital workflows and reducing wait times

### 1.2 Target Users

#### Primary Users
1. **Patients** - Hospital visitors completing intake at kiosks or tablets
2. **Doctors** - Healthcare professionals reviewing patient cases
3. **Nurses/Triage Staff** - Managing patient queues and alerts
4. **Hospital Administrators** - Monitoring system operations and analytics

#### Use Context
- Hospital kiosks (1024px-1366px touch displays)
- Shared tablets (iPad-sized devices)
- Mobile devices (patient-owned smartphones)
- Desktop computers (doctor workstations)

---

## 2. Critical Safety Principles

### 2.1 Medical AI Boundaries
**CUREX IS NOT AN AI DOCTOR**

The system MUST:
- ✅ Assist with history collection
- ✅ Structure information
- ✅ Detect potential red flags
- ✅ Generate draft summaries

The system MUST NOT:
- ❌ Make autonomous diagnoses
- ❌ Provide treatment recommendations
- ❌ Replace qualified healthcare professionals
- ❌ Make definitive clinical claims

### 2.2 Safety Communication
Instead of: "You have a heart attack."  
System says: "Potential emergency symptoms detected. Medical staff have been notified."

### 2.3 Clinical Summary Disclaimer
Every AI-generated clinical summary MUST display:
```
⚠️ AI-GENERATED DRAFT — REQUIRES CLINICIAN REVIEW
```

Doctors MUST be able to:
- **EDIT** - Modify any generated content
- **CONFIRM** - Verify and accept the summary
- **REJECT** - Discard and create manual entry

---

## 3. User Workflows

### 3.1 Patient Workflow
```
1. WELCOME SCREEN
   ↓
2. LANGUAGE SELECTION (Hindi, English, Bengali, Marathi, Tamil, Telugu, Gujarati, Kannada)
   ↓
3. INTAKE MODE SELECTION (Voice + Touch / Touch Only / Assisted)
   ↓
4. PATIENT IDENTIFICATION
   - New patient registration
   - Existing patient (UHID/QR scan)
   - ABHA health ID linking
   ↓
5. CONSENT
   - Data collection consent
   - ABDM integration consent
   - Document digitization consent
   ↓
6. CHIEF COMPLAINT
   - Voice or text input
   - Symptom description
   - Duration and severity
   ↓
7. ADAPTIVE CLINICAL HISTORY
   - Deterministic question engine
   - Context-aware follow-ups
   - Structured data capture
   ↓
8. RED-FLAG CHECK (Real-time)
   - Emergency symptom detection
   - Priority queue insertion
   - Staff notification
   ↓
9. DOCUMENT UPLOAD
   - Camera scan (live OCR)
   - PDF upload
   - Gallery photo selection
   ↓
10. DOCUMENT PROCESSING
    - OCR extraction
    - Medical entity recognition
    - Confidence scoring
    ↓
11. MEDICAL TIMELINE REVIEW
    - Chronological view
    - Event verification
    - Information confirmation
    ↓
12. AI SUMMARY GENERATION
    - Structured clinical summary
    - Multi-language support
    - Audio readout option
    ↓
13. REVIEW & CONFIRM
    - Patient verification
    - Edit capabilities
    - Final submission
    ↓
14. QUEUE SUBMISSION
    - Token generation
    - Doctor routing
    - Wait time estimation
```

### 3.2 Doctor Workflow
```
1. SECURE LOGIN
   ↓
2. DASHBOARD VIEW
   - Patient queue
   - Priority alerts
   - Today's schedule
   - Completed cases
   ↓
3. PATIENT CASE SELECTION
   ↓
4. COMPREHENSIVE CASE REVIEW
   - Demographics
   - Chief complaint
   - History of present illness
   - Past medical history
   - Medications & allergies
   - Family history
   - Personal/social history
   - Review of systems
   - Uploaded documents
   - Lab results
   - Medical timeline
   - AYUSH information (if applicable)
   - Red flag alerts
   - AI-generated summary
   ↓
5. SUMMARY VERIFICATION
   - Edit content
   - Add notes
   - Confirm accuracy
   ↓
6. CONSULTATION
   - Physical examination
   - Clinical assessment
   - Treatment planning
   ↓
7. CASE COMPLETION
   - Finalize records
   - Generate prescriptions
   - Schedule follow-ups
```

### 3.3 Admin Workflow
```
1. SECURE LOGIN
   ↓
2. SYSTEM DASHBOARD
   - Active kiosks monitoring
   - Patient flow analytics
   - Doctor availability
   - Queue statistics
   - System health
   ↓
3. USER MANAGEMENT
   - Doctor accounts
   - Staff accounts
   - Role assignments
   - Permissions
   ↓
4. KIOSK MANAGEMENT
   - Location tracking
   - Status monitoring
   - Configuration
   ↓
5. AUDIT & COMPLIANCE
   - Access logs
   - Clinical activity logs
   - Security events
   - ABDM sync status
   ↓
6. ANALYTICS & REPORTS
   - Daily statistics
   - Wait time analysis
   - Document processing metrics
   - Red flag incidence
```

---

## 4. Functional Requirements

### 4.1 Patient Features

#### 4.1.1 Language Support
- Initial support: English, Hindi, Bengali, Marathi, Tamil, Telugu, Gujarati, Kannada
- Dynamic language switching
- Bilingual display (native script + English transliteration)
- Audio prompts in selected language
- Text-to-speech readouts

#### 4.1.2 Voice Input
- Browser-compatible speech recognition (initial)
- Abstraction layer for future providers (Bhashini, AI4Bharat)
- Real-time transcription display
- Confidence scoring
- Text fallback when unavailable

#### 4.1.3 Clinical History Capture
- Chief complaint
- History of present illness (HPI)
- Past medical history
- Past surgical history
- Medication history with dosages
- Allergy history
- Family history
- Personal history (smoking, alcohol, lifestyle)
- Review of systems (ROS)
- AYUSH history (for Ayurveda/Homeopathy patients)

#### 4.1.4 Document Management
- Camera scanning with live viewfinder
- PDF upload
- Gallery photo selection
- Document categorization:
  - Prescription
  - Lab report
  - Discharge summary
  - Imaging report (X-ray, ECG, MRI, CT)
  - Surgery record
  - Other
- File validation (size, format, quality)
- Preview and confirmation

#### 4.1.5 OCR & Extraction
- Text extraction from scanned documents
- Medical entity recognition:
  - Diagnoses
  - Medications (name, dosage, frequency)
  - Lab tests and values
  - Procedures
  - Dates
- Confidence scoring (0-100%)
- Human verification workflow
- Side-by-side original vs. extracted view

### 4.2 Clinical Engine Features

#### 4.2.1 Question Engine
**Deterministic, not LLM-controlled**

Architecture:
```
Clinical Ontology
↓
Question Bank
↓
Decision Tree/Rules
↓
Patient Answer
↓
Next Question Logic
```

Example for Chest Pain:
- Onset (sudden, gradual)
- Location (central, left, right)
- Character (burning, pressure, sharp)
- Severity (1-10 scale)
- Radiation (arm, jaw, back)
- Aggravating factors (exertion, breathing)
- Relieving factors (rest, medication)
- Associated symptoms (sweating, nausea, shortness of breath)

#### 4.2.2 Red-Flag Detection
**Rules-based safety system**

Example Rules:
```javascript
IF (chief_complaint === "CHEST_PAIN") 
   AND (difficulty_breathing === true) 
   AND (sweating === true)
THEN create_red_flag("HIGH_PRIORITY_CARDIAC")

IF (age > 60) 
   AND (chest_pain_severity >= 7)
   AND (duration > 20_minutes)
THEN create_red_flag("POSSIBLE_MI")
```

Actions on Red Flag:
1. Create `RedFlag` database record
2. Create `TriageAlert` for staff
3. Send real-time notification
4. Move patient to priority queue
5. Display safe patient message
6. Log event for audit

#### 4.2.3 Medical Timeline
Chronological aggregation of:
- Current complaint
- Historical diagnoses
- Medication history
- Lab results with dates
- Procedures and surgeries
- Document upload dates
- Previous hospital visits

Features:
- Sortable by date
- Filterable by category
- Searchable
- Expandable event details
- Visual timeline UI

### 4.3 AI/ML Features

#### 4.3.1 AI Provider Abstraction
```typescript
interface AIProvider {
  generateSummary(data: ClinicalData): Promise<ClinicalSummary>;
  extractEntities(text: string): Promise<MedicalEntity[]>;
  transcribeSpeech(audio: Blob): Promise<Transcription>;
  translateText(text: string, targetLang: string): Promise<string>;
}
```

#### 4.3.2 Summary Generation
Input: Structured clinical data from intake  
Output: JSON structured summary

```json
{
  "chiefComplaint": "Chest pain and tightness for 1 day",
  "hpi": "Patient reports retrosternal chest pressure...",
  "pastMedicalHistory": ["Type 2 Diabetes Mellitus (2024)"],
  "medications": [
    {
      "name": "Metformin HCl",
      "dosage": "500mg",
      "frequency": "Once daily",
      "timing": "Post dinner"
    }
  ],
  "allergies": [],
  "familyHistory": "Father had cardiac disease",
  "personalHistory": "Non-smoker, occasional alcohol",
  "reviewOfSystems": {
    "cardiovascular": "Mild shortness of breath",
    "respiratory": "No chronic cough",
    "gastrointestinal": "No complaints"
  },
  "investigations": [
    {
      "test": "Fasting Blood Sugar",
      "value": "168 mg/dL",
      "date": "2025-02-12",
      "status": "Elevated"
    }
  ],
  "ayushHistory": null,
  "redFlags": ["CHEST_PAIN_WITH_SOB"],
  "priority": "HIGH"
}
```

Status Workflow:
1. Generated → `status: AI_DRAFT`
2. Doctor reviews → `status: UNDER_REVIEW`
3. Doctor edits → `status: EDITED`
4. Doctor confirms → `status: CLINICIAN_VERIFIED`
5. Store: `verifiedBy`, `verifiedAt`, `editHistory`

### 4.4 Doctor Dashboard Features

#### 4.4.1 Queue Management
- Real-time patient queue
- Priority alerts (red flags highlighted)
- Token numbers
- Patient basic info
- Chief complaint preview
- Document count
- History completion status
- Estimated time in queue
- Filter by priority/specialty

#### 4.4.2 Case View
Sections:
- Patient demographics
- ABHA/UHID information
- Chief complaint
- HPI narrative
- Past history (medical, surgical)
- Current medications
- Allergies (prominently displayed)
- Family history
- Social/personal history
- Review of systems
- Uploaded documents (with viewer)
- Lab results
- Medical timeline
- AYUSH information (if applicable)
- Red flags/alerts
- AI summary (with edit capability)

#### 4.4.3 Summary Actions
- **Edit Mode**: Inline editing of all fields
- **Add Notes**: Doctor's additional observations
- **Confirm**: Mark as verified (permanent action)
- **Reject**: Discard AI summary, create manual entry
- **Print**: Generate PDF for records
- **Export**: FHIR-compatible output

### 4.5 AYUSH Module

Structured fields for traditional medicine systems:
- **Prakriti** (body constitution)
- **Vikriti** (current imbalance)
- **Sara** (tissue quality)
- **Samhanana** (structural build)
- **Pramana** (body measurements)
- **Satmya** (compatibility)
- **Sattva** (mental strength)
- **Ahara Shakti** (digestive capacity)
- **Vyayama Shakti** (exercise tolerance)
- **Vaya** (age-related factors)
- **Agni** (digestive fire)
- **Koshtha** (bowel habit)
- **Ahara-Vihara** (diet and lifestyle)
- **Nidana** (causative factors)
- **Samprapti** (pathogenesis)

Module activated based on:
- Hospital type selection
- Department selection
- Doctor specialty

### 4.6 Consent Management

#### 4.6.1 Consent Types
- Data collection for clinical care
- AI processing of clinical information
- Document digitization and OCR
- ABDM/ABHA integration
- Data sharing with specialists
- Research participation (optional)

#### 4.6.2 Consent Features
- Clear explanations in patient's language
- Simple language for low-literacy users
- Audio explanations
- Explicit opt-in required
- Withdrawal capability
- Version tracking
- Audit logging

Database Model:
```typescript
Consent {
  id: UUID
  patientId: UUID
  consentType: ConsentType
  purpose: string
  version: string
  status: "GIVEN" | "WITHDRAWN"
  givenAt: DateTime
  withdrawnAt?: DateTime
  expiresAt?: DateTime
  documentUrl?: string
  witnessedBy?: UUID
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time: < 2 seconds
- API response time: < 500ms (95th percentile)
- Voice transcription: Real-time (< 200ms delay)
- OCR processing: < 10 seconds per document
- Dashboard refresh: Real-time via WebSocket
- Support 50+ concurrent kiosk sessions
- Handle 1000+ patients per day per hospital

### 5.2 Accessibility
- WCAG 2.1 AA compliance
- Minimum touch target: 56px × 56px (kiosks), 48px × 48px (mobile)
- Minimum text size: 16px body text
- High contrast mode support
- Screen reader compatibility
- Keyboard navigation
- Audio alternatives for all visual content
- Multiple language support
- Low-literacy friendly UI

### 5.3 Security
- HTTPS/TLS 1.3 required
- JWT-based authentication
- Refresh token rotation
- Session timeout: 15 minutes (patient kiosks), 60 minutes (doctors)
- Role-based access control (RBAC)
- Field-level encryption for sensitive data
- Audit logging of all access
- Rate limiting on APIs
- CORS properly configured
- No sensitive data in logs
- Secure file upload validation
- XSS and SQL injection prevention

### 5.4 Compliance
- ABDM (Ayushman Bharat Digital Mission) integration ready
- ABHA (Health ID) compatible
- FHIR R4 interoperability layer
- Indian medical record standards
- Hospital data privacy policies
- Consent management framework

### 5.5 Reliability
- 99.5% uptime during operational hours
- Graceful degradation when external services unavailable
- Offline capability for kiosks (basic intake)
- Automatic session recovery
- Data loss prevention (autosave every 30 seconds)
- Backup and disaster recovery
- Health check endpoints

### 5.6 Scalability
- Horizontal scaling capability
- Multi-tenant architecture support
- CDN for static assets
- Database connection pooling
- Caching layer (Redis)
- Async job processing for heavy tasks (OCR, AI)
- Queue-based document processing

---

## 6. Technology Constraints

### 6.1 Must Use
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache/Real-time**: Redis, Socket.IO
- **File Storage**: S3-compatible (with local adapter for dev)
- **Authentication**: JWT

### 6.2 Design System Preservation
- Use existing Stitch-generated UI components
- Maintain "Clinical Calm & Vital Intelligence" design system
- Colors, typography, spacing from DESIGN.md
- Preserve component structure and layouts
- Maintain responsive breakpoints
- Keep accessibility features

---

## 7. Integration Requirements

### 7.1 FHIR/ABDM Integration
**Phased Approach:**

Phase 1: Internal FHIR-compatible data structures  
Phase 2: FHIR resource mapping layer  
Phase 3: ABDM sandbox integration  
Phase 4: Production ABDM connectivity (when credentials available)

#### 7.1.1 FHIR Resources to Support
- Patient
- Encounter
- Observation
- Condition
- MedicationStatement
- AllergyIntolerance
- FamilyMemberHistory
- DiagnosticReport
- DocumentReference

#### 7.1.2 ABDM Features
- ABHA number validation
- Health record linking
- Consent management (ABDM consent framework)
- PHR app connectivity
- Provider registry integration

### 7.2 External Services
All external services must use abstraction layers:

```typescript
// OCR Service
interface OCRProvider {
  extractText(imageBuffer: Buffer): Promise<OCRResult>;
  extractMedicalEntities(text: string): Promise<MedicalEntity[]>;
}

// Speech Service
interface SpeechProvider {
  transcribe(audioBlob: Blob, language: string): Promise<Transcription>;
  synthesize(text: string, language: string): Promise<AudioBuffer>;
}

// AI Service
interface AIProvider {
  generateSummary(data: ClinicalData): Promise<ClinicalSummary>;
  extractEntities(text: string): Promise<Entity[]>;
}
```

---

## 8. Demo Mode Requirements

For SIH prototype and testing without external services:

### 8.1 Demo Mode Features
```bash
DEMO_MODE=true
```

When enabled:
- Mock OCR results with realistic medical text
- Simulated AI summaries
- Fake ABDM integration responses
- Seeded patient database
- Simulated red-flag detection
- Mock speech recognition

### 8.2 Demo Data Requirements
- 20+ realistic fictional Indian patient profiles
- 10+ doctor profiles
- Sample documents (prescriptions, lab reports)
- Medical history scenarios
- Red-flag scenarios
- AYUSH patient examples

### 8.3 Demo Indicators
- Clear "DEMO MODE" badge in admin panel
- "Simulated Response" labels on AI/OCR outputs
- "Sandbox Integration" label for ABDM features
- Toast notifications: "Demo: OCR processing simulated"

---

## 9. Success Metrics

### 9.1 Patient Experience
- Intake completion rate > 85%
- Average intake time < 10 minutes
- Voice recognition accuracy > 90%
- Patient satisfaction score > 4.0/5.0
- Error rate < 5%

### 9.2 Clinical Quality
- Doctor summary acceptance rate > 80%
- OCR accuracy > 95% for typed documents
- Red-flag detection accuracy > 98%
- Clinical data completeness > 90%

### 9.3 Operational Efficiency
- Reduction in doctor intake time: 40%
- Patient wait time reduction: 30%
- Data entry errors reduction: 60%
- Document digitization: 100% of uploaded docs

### 9.4 Technical Performance
- System uptime: > 99.5%
- API response time: < 500ms (p95)
- Kiosk crash rate: < 0.1%
- Data loss incidents: 0

---

## 10. Out of Scope (Current Version)

These features are explicitly NOT included in the initial implementation:

- ❌ Billing/payment integration
- ❌ Pharmacy integration
- ❌ Lab system integration (beyond document upload)
- ❌ Radiology system integration
- ❌ Electronic prescription generation
- ❌ Appointment scheduling
- ❌ Video consultation
- ❌ Mobile app (native iOS/Android)
- ❌ Patient portal for home access
- ❌ Wearable device integration
- ❌ Genomic data
- ❌ Real-time vital signs monitoring
- ❌ Chatbot for medical advice
- ❌ Treatment plan generation
- ❌ Drug interaction checking
- ❌ Automatic coding (ICD-10, CPT)

These may be added in future phases based on hospital requirements.

---

## 11. Risks & Constraints

### 11.1 Technical Risks
- **Voice Recognition**: Hindi/regional language accuracy may vary
- **OCR Quality**: Handwritten prescriptions difficult to parse
- **Network**: Hospital WiFi reliability issues
- **Browser Compatibility**: Kiosk hardware may be outdated
- **External Services**: ABDM/Bhashini availability uncertain

### 11.2 Clinical Risks
- **Red Flag Sensitivity**: Balance false positives vs. false negatives
- **AI Errors**: Hallucination or incorrect entity extraction
- **Consent Complexity**: Low-literacy users may not understand
- **Doctor Adoption**: Resistance to reviewing AI summaries

### 11.3 Mitigation Strategies
- Fallback to text input when voice fails
- Manual correction workflow for OCR errors
- Offline mode for core intake features
- Comprehensive user testing with real patients
- Doctor training and onboarding program
- Clear error messages and help options
- 24/7 technical support during deployment

---

## 12. Acceptance Criteria

The platform will be considered complete when:

### Phase 1 Criteria
✅ Patient can complete intake flow from welcome to submission  
✅ Multi-language support functional (minimum 3 languages)  
✅ Voice and touch input both working  
✅ Document upload and preview functional  
✅ Mock OCR extraction displaying  
✅ Medical timeline rendering correctly  
✅ Basic red-flag detection operational  
✅ Doctor can view patient queue  
✅ Doctor can review and edit summaries  
✅ All data persisted to database  
✅ Responsive design on all target devices  
✅ No critical security vulnerabilities  
✅ Demo mode fully functional without external services  

### Phase 2+ Criteria
✅ Real OCR provider integrated  
✅ Real AI provider integrated  
✅ Real speech provider integrated  
✅ ABDM sandbox integration  
✅ Advanced red-flag rules  
✅ AYUSH module functional  
✅ Admin panel operational  
✅ Audit logging complete  
✅ Production deployment ready  

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Sept 5, 2026 | System Analysis | Initial specification created from Stitch UI analysis |

**Next Steps**: Proceed to ARCHITECTURE.md and IMPLEMENTATION_PLAN.md
