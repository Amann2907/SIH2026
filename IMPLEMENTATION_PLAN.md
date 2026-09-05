# CUREX - Implementation Plan

**Version:** 1.0.0  
**Last Updated:** September 5, 2026  
**Status:** Planning Phase

---

## Overview

This document outlines the **phased implementation strategy** for transforming the existing Stitch-generated CUREX UI into a fully functional, production-ready clinical intake platform.

**Key Principle**: Develop incrementally, test thoroughly, and deploy in phases. Each phase builds upon the previous one and can be demonstrated independently.

---

## Implementation Phases

### Phase Summary

| Phase | Focus | Duration (Est.) | Complexity |
|-------|-------|----------------|------------|
| **Phase 1** | Project Foundation | 1-2 weeks | Medium |
| **Phase 2** | Authentication & Authorization | 1 week | Medium |
| **Phase 3** | Patient Intake Workflow | 2-3 weeks | High |
| **Phase 4** | Clinical History Engine | 2 weeks | High |
| **Phase 5** | Red-Flag Detection Engine | 1 week | Medium |
| **Phase 6** | Document Upload & OCR | 2 weeks | High |
| **Phase 7** | Medical Timeline | 1 week | Low |
| **Phase 8** | AI Clinical Summary | 1-2 weeks | High |
| **Phase 9** | Doctor Dashboard | 2 weeks | Medium |
| **Phase 10** | AYUSH Module | 1 week | Low |
| **Phase 11** | FHIR/ABDM Integration | 2 weeks | Medium |
| **Phase 12** | Security, Testing & Deployment | 2-3 weeks | High |

**Total Estimated Timeline**: 18-24 weeks (4.5-6 months)

---

## Phase 1: Project Foundation

### Objectives
- Set up development environment
- Initialize project structure
- Configure database and ORM
- Establish design system integration
- Create shared types and utilities

### Tasks

#### 1.1 Project Initialization
- [ ] Create monorepo structure (or simple multi-package structure)
- [ ] Initialize frontend (`apps/web`)
  - [ ] Create Vite + React + TypeScript project
  - [ ] Install Tailwind CSS
  - [ ] Configure design tokens from Stitch DESIGN.md
  - [ ] Set up React Router
  - [ ] Configure TanStack Query
- [ ] Initialize backend (`apps/api`)
  - [ ] Create Node.js + Express + TypeScript project
  - [ ] Configure tsconfig and build process
  - [ ] Set up ESLint and Prettier
- [ ] Create shared packages
  - [ ] `shared-types` for TypeScript interfaces
  - [ ] `validation` for Zod schemas

#### 1.2 Database Setup
- [ ] Install and configure Prisma
- [ ] Create initial `schema.prisma` with core models:
  - User, Patient, Doctor, Hospital
  - Encounter, Document
  - Consent, AuditLog
- [ ] Run first migration
- [ ] Create database seed script with demo data
- [ ] Test database connection

#### 1.3 Docker Development Environment
- [ ] Create `docker-compose.yml`
  - PostgreSQL container
  - Redis container
  - MinIO container (S3-compatible)
- [ ] Create Dockerfile for API (development)
- [ ] Create Dockerfile for Web (development)
- [ ] Test full stack startup
- [ ] Document setup in README.md

#### 1.4 Design System Integration
- [ ] Extract Stitch UI color palette into Tailwind config
- [ ] Extract typography system into Tailwind config
- [ ] Extract spacing/sizing into Tailwind config
- [ ] Create reusable component library:
  - [ ] Button component
  - [ ] Input/TextArea component
  - [ ] Card component
  - [ ] Modal component
  - [ ] Toast/notification component
  - [ ] Language selector component
- [ ] Set up i18next for internationalization
- [ ] Create language files (English, Hindi initially)

#### 1.5 Basic API Structure
- [ ] Create Express app with middleware:
  - [ ] CORS
  - [ ] JSON body parser
  - [ ] Helmet (security headers)
  - [ ] Morgan (HTTP logging)
  - [ ] Error handling middleware
- [ ] Create health check endpoints (`/api/health`)
- [ ] Set up Winston logger
- [ ] Create base API response format
- [ ] Test basic API call from frontend

#### 1.6 Environment Configuration
- [ ] Create `.env.example` file
- [ ] Set up environment variable validation (Zod)
- [ ] Create config service for backend
- [ ] Create environment-based feature flags

### Deliverables
✅ Working dev environment with Docker  
✅ Frontend and backend can communicate  
✅ Database connected and seeded  
✅ Design system components functional  
✅ README.md with setup instructions  

### Testing
- [ ] All containers start successfully
- [ ] Database migrations run without errors
- [ ] Seed data loads correctly
- [ ] Frontend loads with Stitch design
- [ ] Basic API call works

---

## Phase 2: Authentication & Authorization

### Objectives
- Implement JWT-based authentication
- Create role-based access control (RBAC)
- Build login/logout functionality
- Protect routes

### Tasks

#### 2.1 Backend Authentication
- [ ] Install JWT libraries (`jsonwebtoken`, `bcrypt`)
- [ ] Create authentication service:
  - [ ] User registration
  - [ ] Password hashing
  - [ ] Login (generate access & refresh tokens)
  - [ ] Token refresh
  - [ ] Logout
- [ ] Create authentication middleware
- [ ] Create authorization middleware (role-based)
- [ ] Add password validation (strength requirements)
- [ ] Create Session model (optional refresh token storage)

#### 2.2 API Endpoints
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/logout`
- [ ] `POST /api/auth/refresh`
- [ ] `GET /api/auth/me` (current user info)

#### 2.3 Frontend Authentication
- [ ] Create auth context/store (Zustand)
- [ ] Create login page
- [ ] Create role-based routing
- [ ] Implement token storage (localStorage or memory)
- [ ] Create auth service (API calls)
- [ ] Create protected route component
- [ ] Implement automatic token refresh
- [ ] Handle session expiry
- [ ] Add loading states

#### 2.4 Role Management
- [ ] Define roles: PATIENT, DOCTOR, NURSE, ADMIN
- [ ] Create role-based UI rendering
- [ ] Create permission checking utilities
- [ ] Test role switching

#### 2.5 Audit Logging
- [ ] Create audit log middleware
- [ ] Log authentication events:
  - Login success/failure
  - Logout
  - Token refresh
  - Session expiry
- [ ] Store IP address and user agent

### Deliverables
✅ Users can register and login  
✅ JWT tokens generated and validated  
✅ Role-based access control working  
✅ Protected routes functional  
✅ Audit logs recording auth events  

### Testing
- [ ] User registration works
- [ ] Login succeeds with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Protected routes redirect to login
- [ ] Token refresh works before expiry
- [ ] Logout clears session
- [ ] Role-based permissions enforced
- [ ] Audit logs captured correctly

---

## Phase 3: Patient Intake Workflow

### Objectives
- Implement complete patient intake flow
- Preserve Stitch UI design
- Connect UI to backend APIs
- Enable form persistence

### Tasks

#### 3.1 Preserve Existing Stitch UI
- [ ] Convert existing HTML screens to React components:
  - [ ] Welcome & language selection screen
  - [ ] Voice/touch mode selection
  - [ ] Patient identification screen
  - [ ] Consent screen
  - [ ] Chief complaint screen
  - [ ] Voice clinical history screen
- [ ] Maintain exact design (colors, spacing, components)
- [ ] Make responsive for kiosk, tablet, mobile

#### 3.2 Language System
- [ ] Set up i18next with language files
- [ ] Implement language switcher
- [ ] Add translations for:
  - English
  - Hindi
  - Bengali (optional for Phase 3)
- [ ] Create bilingual display components
- [ ] Test all screens in multiple languages

#### 3.3 Patient Registration
- [ ] Create Patient model (already in Prisma schema)
- [ ] Backend endpoints:
  - [ ] `POST /api/patients` (create)
  - [ ] `GET /api/patients/:id` (retrieve)
  - [ ] `PATCH /api/patients/:id` (update)
- [ ] Frontend forms:
  - [ ] New patient registration form
  - [ ] Existing patient lookup (UHID search)
  - [ ] ABHA number input (optional)
- [ ] Form validation (Zod schemas)
- [ ] Test patient creation

#### 3.4 Consent Management
- [ ] Create Consent model
- [ ] Backend endpoints:
  - [ ] `POST /api/consents` (create)
  - [ ] `GET /api/consents/:patientId` (list)
  - [ ] `PATCH /api/consents/:id/withdraw` (withdraw)
- [ ] Frontend consent screens:
  - [ ] Clear explanation in patient's language
  - [ ] Explicit checkbox opt-ins
  - [ ] Audio explanation option
  - [ ] Consent confirmation
- [ ] Store consent version and timestamp

#### 3.5 Encounter Initialization
- [ ] Create Encounter model
- [ ] Backend endpoints:
  - [ ] `POST /api/encounters` (start)
  - [ ] `GET /api/encounters/:id` (retrieve)
  - [ ] `PATCH /api/encounters/:id` (update)
- [ ] Link encounter to:
  - Patient
  - Hospital/Kiosk
  - Selected language
  - Intake mode
- [ ] Generate encounter session ID

#### 3.6 Chief Complaint Capture
- [ ] Create UI for chief complaint input
- [ ] Support voice and text input
- [ ] Real-time transcription display (browser speech API)
- [ ] Backend endpoint:
  - [ ] `PATCH /api/encounters/:id/complaint`
- [ ] Store in database

#### 3.7 Progress & Navigation
- [ ] Implement step progress indicator
- [ ] Enable back navigation (with data preservation)
- [ ] Auto-save mechanism (every 30 seconds)
- [ ] Session recovery on browser refresh
- [ ] Prevent data loss

### Deliverables
✅ Complete patient intake UI functional  
✅ All screens connected to backend  
✅ Data persisted to database  
✅ Multi-language support working  
✅ Consent properly recorded  
✅ Session recovery functional  

### Testing
- [ ] Complete intake flow works start to finish
- [ ] Data saves correctly
- [ ] Language switching works
- [ ] Voice input functional (browser API)
- [ ] Consent properly stored
- [ ] Session persists across refresh
- [ ] Back navigation preserves data
- [ ] Mobile, tablet, kiosk layouts work

---

## Phase 4: Clinical History Engine

### Objectives
- Implement deterministic clinical question engine
- Adaptive follow-up questions
- Structured data capture
- Multi-lingual question presentation

### Tasks

#### 4.1 Question Bank Setup
- [ ] Create QuestionBank model
- [ ] Define clinical question categories:
  - Chief complaint details
  - History of present illness (HPI)
  - Review of systems (ROS)
  - Past medical history
  - Medication history
  - Allergy history
  - Family history
  - Personal/social history
- [ ] Create question JSON structure:
```typescript
{
  id: "Q001",
  category: "HPI",
  questionText: {
    en: "When did the pain start?",
    hi: "दर्द कब शुरू हुआ?"
  },
  answerType: "select",
  options: [
    { value: "today", label: { en: "Today", hi: "आज" } },
    { value: "yesterday", label: { en: "Yesterday", hi: "कल" } },
    { value: "week", label: { en: "This week", hi: "इस हफ्ते" } },
    { value: "month", label: { en: "This month", hi: "इस महीने" } }
  ],
  followUpRules: {
    "today": ["Q002", "Q003"],
    "yesterday": ["Q002", "Q004"]
  }
}
```

#### 4.2 Question Engine Service
- [ ] Create `QuestionEngineService`:
  - [ ] `getFirstQuestion(category)` - Get initial question
  - [ ] `getNextQuestion(currentQ, answer)` - Determine next question
  - [ ] `getQuestionsByComplaint(complaint)` - Get relevant questions
- [ ] Implement decision tree logic
- [ ] Handle conditional branching

#### 4.3 Question Response Model
- [ ] Create QuestionResponse model
- [ ] Link to encounter
- [ ] Store:
  - Question ID
  - Question text (for history)
  - Answer
  - Voice metadata (if applicable)
  - Timestamp

#### 4.4 Backend Endpoints
- [ ] `GET /api/encounters/:id/questions/next` - Get next question
- [ ] `POST /api/encounters/:id/answers` - Submit answer
- [ ] `GET /api/encounters/:id/history` - Get complete Q&A history

#### 4.5 Frontend Question UI
- [ ] Create dynamic question renderer component
- [ ] Support multiple answer types:
  - [ ] Text input
  - [ ] Number input
  - [ ] Single select (buttons)
  - [ ] Multi-select (checkboxes)
  - [ ] Date picker
  - [ ] Scale/slider (1-10 pain scale)
- [ ] Voice input integration
- [ ] Real-time answer validation
- [ ] Progress tracking

#### 4.6 Structured Data Extraction
- [ ] Parse free-text answers
- [ ] Extract clinical concepts
- [ ] Map to structured fields
- [ ] Store in appropriate models:
  - MedicalHistory
  - Medications
  - Allergies
  - Diagnoses

#### 4.7 Clinical Scenario Testing
- [ ] Chest pain scenario
- [ ] Diabetes follow-up scenario
- [ ] Respiratory complaint scenario
- [ ] Verify question flow logic
- [ ] Test in multiple languages

### Deliverables
✅ Question engine operational  
✅ Adaptive questions based on answers  
✅ All answer types supported  
✅ Multi-language questions working  
✅ Structured data captured correctly  

### Testing
- [ ] Question flow follows decision tree
- [ ] All answer types work
- [ ] Voice input transcribes correctly
- [ ] Answers stored properly
- [ ] Multi-language questions display correctly
- [ ] Scenario-based end-to-end tests pass

---

## Phase 5: Red-Flag Detection Engine

### Objectives
- Implement deterministic red-flag rules
- Real-time symptom analysis
- Priority queue management
- Staff notification system

### Tasks

#### 5.1 Red-Flag Rules Definition
- [ ] Create RedFlagRule model
- [ ] Define critical rules:
```typescript
// Example: High-risk chest pain
{
  id: "RF001",
  name: "HIGH_RISK_CARDIAC",
  conditions: {
    AND: [
      { field: "chiefComplaint", operator: "EQUALS", value: "CHEST_PAIN" },
      { field: "severity", operator: "GTE", value: 7 },
      { OR: [
        { field: "symptoms", operator: "INCLUDES", value: "SHORTNESS_OF_BREATH" },
        { field: "symptoms", operator: "INCLUDES", value: "SWEATING" }
      ]}
    ]
  },
  severity: "URGENT",
  action: {
    createAlert: true,
    notifyRoles: ["DOCTOR", "NURSE"],
    changePriority: "HIGH",
    message: {
      patient: {
        en: "Potential emergency symptoms detected. Medical staff have been notified.",
        hi: "आपातकालीन लक्षण पाए गए हैं। चिकित्सा कर्मचारियों को सूचित कर दिया गया है।"
      },
      staff: "HIGH PRIORITY: Patient with chest pain + SOB/sweating"
    }
  }
}
```

#### 5.2 Red-Flag Engine Service
- [ ] Create `RedFlagEngineService`:
  - [ ] `evaluateRules(encounterData)` - Check all rules
  - [ ] `checkRule(rule, data)` - Evaluate single rule
  - [ ] `triggerActions(rule, encounter)` - Execute rule actions
- [ ] Implement rule evaluation logic
- [ ] Support complex conditions (AND, OR, NOT)

#### 5.3 Backend Integration
- [ ] Create RedFlag model
- [ ] Create TriageAlert model
- [ ] Endpoints:
  - [ ] `POST /api/clinical/check-redflags` - Manual check
  - [ ] Automatic check on answer submission
- [ ] WebSocket integration for real-time alerts

#### 5.4 Alert & Notification System
- [ ] Set up Socket.IO
- [ ] Implement alert broadcasting:
  - [ ] Send to specific users (doctors, nurses)
  - [ ] Send to role-based rooms
- [ ] Create notification queue
- [ ] Store alerts in database

#### 5.5 Priority Queue Management
- [ ] Update Encounter priority field
- [ ] Re-order patient queue
- [ ] Highlight high-priority patients in doctor dashboard

#### 5.6 Patient Communication
- [ ] Display safe, reassuring message to patient
- [ ] Avoid diagnostic language
- [ ] Provide clear instructions:
  - "Please remain here"
  - "Staff will assist you shortly"
- [ ] Multi-language support

#### 5.7 Testing Critical Scenarios
- [ ] Chest pain + shortness of breath → HIGH priority
- [ ] Stroke symptoms → URGENT
- [ ] Mild headache → NORMAL
- [ ] False positive handling
- [ ] Alert delivery confirmation

### Deliverables
✅ Red-flag engine operational  
✅ Rules trigger correctly  
✅ Alerts sent in real-time  
✅ Priority queue updated  
✅ Patient messages appropriate  

### Testing
- [ ] High-risk scenarios trigger alerts
- [ ] Low-risk scenarios don't trigger false positives
- [ ] Alerts reach correct staff members
- [ ] Priority queue updates immediately
- [ ] Patient sees reassuring message
- [ ] Multi-language messages correct
- [ ] WebSocket alerts delivered reliably

---

## Phase 6: Document Upload & OCR

### Objectives
- Implement document upload functionality
- Integrate OCR processing
- Extract medical entities
- Enable verification workflow

### Tasks

#### 6.1 File Upload Infrastructure
- [ ] Set up S3-compatible storage (MinIO for dev)
- [ ] Configure Multer middleware
- [ ] Implement file validation:
  - [ ] File type (image, PDF)
  - [ ] File size limits
  - [ ] Image quality check
- [ ] Generate thumbnails (Sharp library)

#### 6.2 Backend Endpoints
- [ ] `POST /api/documents/upload` - Upload file
- [ ] `GET /api/documents/:id` - Get metadata
- [ ] `GET /api/documents/:id/download` - Download original
- [ ] `GET /api/documents/:id/thumbnail` - Get thumbnail
- [ ] `POST /api/documents/:id/process` - Trigger OCR
- [ ] `GET /api/documents/:id/entities` - Get extracted entities
- [ ] `PATCH /api/documents/:id/entities/:entityId` - Verify entity

#### 6.3 OCR Service Abstraction
- [ ] Create OCRProvider interface
- [ ] Implement providers:
  - [ ] Tesseract.js (open-source)
  - [ ] Google Cloud Vision (optional)
  - [ ] Mock provider (demo mode)
- [ ] Create OCRService factory
- [ ] Handle OCR errors gracefully

#### 6.4 Medical Entity Extraction
- [ ] Create DocumentEntity model
- [ ] Implement entity recognition:
  - [ ] Medication names
  - [ ] Dosages
  - [ ] Diagnoses
  - [ ] Lab test names
  - [ ] Lab values
  - [ ] Dates
  - [ ] Doctor/hospital names
- [ ] Use pattern matching and NLP (basic)
- [ ] Assign confidence scores

#### 6.5 Document Processing Worker
- [ ] Set up Bull queue
- [ ] Create document processing job:
  - [ ] Extract text via OCR
  - [ ] Parse medical entities
  - [ ] Store results
  - [ ] Update document status
- [ ] Handle processing failures
- [ ] Retry logic

#### 6.6 Frontend Document UI
- [ ] Preserve existing Stitch document screen
- [ ] Implement camera capture
- [ ] Implement gallery selection
- [ ] Implement drag-and-drop
- [ ] Show upload progress
- [ ] Display OCR results
- [ ] Side-by-side view (original vs. extracted)
- [ ] Entity verification UI:
  - [ ] Highlight extracted entities
  - [ ] Allow edit/confirm/reject
  - [ ] Confidence badges

#### 6.7 Document Categories
- [ ] Implement category selection
- [ ] Filter by category
- [ ] Category-specific entity extraction

### Deliverables
✅ Document upload functional  
✅ OCR processing working  
✅ Medical entities extracted  
✅ Verification workflow complete  
✅ Demo mode with mock OCR  

### Testing
- [ ] Upload JPG, PNG, PDF successfully
- [ ] File validation works
- [ ] Thumbnails generated
- [ ] OCR extracts text correctly
- [ ] Entities identified with reasonable accuracy
- [ ] Confidence scores assigned
- [ ] Verification workflow works
- [ ] Mock OCR works in demo mode
- [ ] Error handling for failed OCR

---

## Phase 7: Medical Timeline

### Objectives
- Aggregate patient medical history
- Create chronological timeline
- Enable filtering and search
- Visual timeline UI

### Tasks

#### 7.1 Timeline Event Model
- [ ] Create TimelineEvent model (already in schema)
- [ ] Link to:
  - Encounters
  - Documents
  - Diagnoses
  - Medications
  - Lab results

#### 7.2 Timeline Aggregation Service
- [ ] Create TimelineService:
  - [ ] `getPatientTimeline(patientId)` - Aggregate all events
  - [ ] `filterByCategory(events, category)` - Filter
  - [ ] `searchTimeline(events, query)` - Search
  - [ ] `sortTimeline(events, order)` - Sort

#### 7.3 Backend Endpoints
- [ ] `GET /api/patients/:id/timeline` - Get full timeline
- [ ] `GET /api/patients/:id/timeline?category=LAB_RESULT` - Filtered
- [ ] `GET /api/patients/:id/timeline?search=diabetes` - Search

#### 7.4 Frontend Timeline UI
- [ ] Preserve existing Stitch timeline design
- [ ] Vertical timeline with nodes
- [ ] Color-coded event types
- [ ] Expandable event details
- [ ] Date range filter
- [ ] Category filter
- [ ] Search functionality
- [ ] Responsive design

#### 7.5 Timeline Event Creation
- [ ] Automatically create events on:
  - [ ] New diagnosis added
  - [ ] Medication started/stopped
  - [ ] Document uploaded
  - [ ] Lab result added
  - [ ] Current encounter

### Deliverables
✅ Timeline aggregates all patient data  
✅ Timeline UI functional and beautiful  
✅ Filtering and search working  
✅ Timeline updates automatically  

### Testing
- [ ] Timeline shows all relevant events
- [ ] Events sorted chronologically
- [ ] Filters work correctly
- [ ] Search finds relevant events
- [ ] Timeline updates with new data
- [ ] UI renders correctly on all devices

---

## Phase 8: AI Clinical Summary

### Objectives
- Integrate AI provider
- Generate structured clinical summaries
- Enable doctor review and editing
- Implement verification workflow

### Tasks

#### 8.1 AI Service Abstraction
- [ ] Create AIProvider interface
- [ ] Implement providers:
  - [ ] OpenAI (GPT-4)
  - [ ] Anthropic (Claude)
  - [ ] Mock provider (demo mode)
- [ ] Create AIService factory
- [ ] Handle API errors and rate limits

#### 8.2 Summary Generation Service
- [ ] Create SummaryService:
  - [ ] `generateSummary(encounterData)` - Create summary
  - [ ] `formatPrompt(data)` - Structure AI prompt
  - [ ] `parseSummary(aiResponse)` - Extract structured data
  - [ ] `validateSummary(summary)` - Check completeness
- [ ] Design prompt template:
```
You are a medical documentation assistant.
Generate a structured clinical summary from the following patient intake data.

Patient Data:
- Chief Complaint: ...
- History of Present Illness: ...
- Past Medical History: ...
- Medications: ...
- Allergies: ...

Output format (JSON):
{
  "chiefComplaint": "...",
  "hpi": "...",
  "pastMedicalHistory": [...],
  "medications": [...],
  "allergies": [...],
  ...
}
```

#### 8.3 Backend Endpoints
- [ ] `POST /api/summaries/generate` - Generate summary
- [ ] `GET /api/summaries/:id` - Get summary
- [ ] `PATCH /api/summaries/:id` - Edit summary
- [ ] `POST /api/summaries/:id/confirm` - Doctor confirmation

#### 8.4 Summary Status Workflow
- [ ] Implement status transitions:
  - PENDING → AI_DRAFT (after generation)
  - AI_DRAFT → UNDER_REVIEW (doctor opens)
  - UNDER_REVIEW → EDITED (doctor edits)
  - EDITED → CLINICIAN_VERIFIED (doctor confirms)
- [ ] Store verification metadata:
  - verifiedBy (doctor ID)
  - verifiedAt (timestamp)
  - editHistory (changes made)

#### 8.5 Frontend Summary UI
- [ ] Display AI-generated summary
- [ ] Prominent disclaimer banner:
  ```
  ⚠️ AI-GENERATED DRAFT — REQUIRES CLINICIAN REVIEW
  ```
- [ ] Inline editing capability
- [ ] Section-by-section review
- [ ] Confirm/Reject buttons
- [ ] Edit history display
- [ ] Loading states during generation

#### 8.6 Background Job for Summary Generation
- [ ] Create Bull job for async summary generation
- [ ] Trigger after encounter completion
- [ ] Update status on completion
- [ ] Notify doctor via WebSocket

#### 8.7 Demo Mode Mock Summaries
- [ ] Create realistic mock summaries
- [ ] Include "DEMO" indicators
- [ ] Simulate processing delay

### Deliverables
✅ AI integration functional  
✅ Summaries generated accurately  
✅ Doctor can review and edit  
✅ Verification workflow complete  
✅ Disclaimer prominently displayed  

### Testing
- [ ] Summary generated from encounter data
- [ ] Generated content is clinically sensible
- [ ] Structured JSON output correct
- [ ] Doctor can edit all fields
- [ ] Confirmation updates status
- [ ] Edit history tracked
- [ ] Mock AI works in demo mode
- [ ] Error handling for AI failures

---

## Phase 9: Doctor Dashboard

### Objectives
- Build doctor queue view
- Enable case review
- Implement summary verification
- Real-time queue updates

### Tasks

#### 9.1 Queue Management
- [ ] Backend endpoints:
  - [ ] `GET /api/doctor/queue` - Get patient queue
  - [ ] `GET /api/doctor/queue/:doctorId` - Specific doctor's queue
- [ ] Include in queue:
  - Token number
  - Patient name, age, gender
  - Chief complaint
  - Priority level
  - Status
  - Wait time
- [ ] Sort by priority and time
- [ ] Real-time updates via WebSocket

#### 9.2 Triage Alerts
- [ ] Backend endpoint:
  - [ ] `GET /api/doctor/alerts` - Get unread alerts
- [ ] Display red-flag alerts prominently
- [ ] Mark alerts as read
- [ ] Alert notification sound (optional)

#### 9.3 Case View
- [ ] Backend endpoint:
  - [ ] `GET /api/doctor/encounters/:id` - Full case data
- [ ] Display sections:
  - [ ] Patient demographics
  - [ ] Chief complaint
  - [ ] HPI
  - [ ] Past medical history
  - [ ] Current medications
  - [ ] **Allergies** (prominently displayed)
  - [ ] Family history
  - [ ] Personal/social history
  - [ ] Review of systems
  - [ ] Uploaded documents (with viewer)
  - [ ] Lab results
  - [ ] Medical timeline
  - [ ] Red flags/alerts
  - [ ] AI summary (with edit capability)

#### 9.4 Document Viewer
- [ ] Inline document viewer
- [ ] PDF rendering
- [ ] Image zoom
- [ ] Download option
- [ ] Extracted entities overlay

#### 9.5 Summary Editing
- [ ] Inline editing for all summary sections
- [ ] Rich text editor (optional, or plain textarea)
- [ ] Auto-save drafts
- [ ] Undo/redo
- [ ] Confirm button

#### 9.6 Frontend Dashboard
- [ ] Preserve Stitch dashboard design (if exists)
- [ ] Queue table/list
- [ ] Priority color coding
- [ ] Search/filter queue
- [ ] Case detail view
- [ ] Navigation between patients
- [ ] Responsive design

#### 9.7 Real-time Features
- [ ] WebSocket integration
- [ ] Queue updates automatically
- [ ] New alert notifications
- [ ] Document processing status updates

### Deliverables
✅ Doctor dashboard functional  
✅ Patient queue displays correctly  
✅ Case view shows all information  
✅ Summary editing works  
✅ Real-time updates functional  

### Testing
- [ ] Queue displays all waiting patients
- [ ] Priority patients highlighted
- [ ] Case view loads complete data
- [ ] Doctor can edit summary
- [ ] Confirmation persists changes
- [ ] Real-time queue updates work
- [ ] Alerts display and dismiss correctly
- [ ] Document viewer works for all formats

---

## Phase 10: AYUSH Module

### Objectives
- Implement AYUSH-specific clinical fields
- Enable AYUSH history capture
- Integrate with main workflow

### Tasks

#### 10.1 AYUSH Data Model
- [ ] AyushHistory model (already in schema)
- [ ] Define all AYUSH fields (Prakriti, Vikriti, etc.)

#### 10.2 AYUSH Question Bank
- [ ] Create AYUSH-specific questions
- [ ] Multi-language support
- [ ] Traditional medicine terminology

#### 10.3 Backend Endpoints
- [ ] `POST /api/patients/:id/ayush-history` - Create
- [ ] `GET /api/patients/:id/ayush-history` - Retrieve
- [ ] `PATCH /api/patients/:id/ayush-history` - Update

#### 10.4 Frontend AYUSH Forms
- [ ] AYUSH intake screens
- [ ] Preserve any existing Stitch AYUSH design
- [ ] Form validation
- [ ] Integration with main intake flow

#### 10.5 AYUSH Summary Section
- [ ] Add AYUSH section to AI summary
- [ ] Include in doctor case view
- [ ] Separate from modern medical history

#### 10.6 Hospital Type Configuration
- [ ] Enable/disable AYUSH module per hospital
- [ ] Conditional UI rendering

### Deliverables
✅ AYUSH module functional  
✅ AYUSH history captured  
✅ Integrated with main workflow  

### Testing
- [ ] AYUSH questions display correctly
- [ ] AYUSH data saves properly
- [ ] Displays in doctor dashboard
- [ ] Module can be disabled for non-AYUSH hospitals

---

## Phase 11: FHIR/ABDM Integration

### Objectives
- Implement FHIR resource mapping
- Create ABDM integration layer
- Enable ABHA number validation
- Prepare for HIE connectivity

### Tasks

#### 11.1 FHIR Mapper Service
- [ ] Create FHIRMapperService
- [ ] Implement mappings:
  - [ ] Patient → FHIR Patient
  - [ ] Encounter → FHIR Encounter
  - [ ] Condition → FHIR Condition
  - [ ] MedicationStatement → FHIR MedicationStatement
  - [ ] AllergyIntolerance → FHIR AllergyIntolerance
  - [ ] DiagnosticReport → FHIR DiagnosticReport
  - [ ] DocumentReference → FHIR DocumentReference
- [ ] Validate FHIR resources

#### 11.2 ABDM Provider Interface
- [ ] Create ABDMProvider interface
- [ ] Implement mock provider
- [ ] Implement sandbox provider (when credentials available)
- [ ] Functions:
  - [ ] `validateABHA(abhaNumber)` - Verify ABHA ID
  - [ ] `linkHealthRecords(patientId, abhaId)` - Link records
  - [ ] `fetchConsents(abhaId)` - Get ABDM consents
  - [ ] `pushHealthRecord(fhirBundle)` - Send record to ABDM

#### 11.3 Backend Endpoints
- [ ] `POST /api/abdm/validate-abha` - Validate ABHA number
- [ ] `POST /api/abdm/link-patient` - Link patient to ABHA
- [ ] `GET /api/abdm/consents/:patientId` - Get consents
- [ ] `POST /api/abdm/push-record` - Push FHIR bundle

#### 11.4 Frontend ABHA Integration
- [ ] ABHA number input field
- [ ] Validation indicator
- [ ] Linking confirmation
- [ ] Consent management UI

#### 11.5 Demo/Sandbox Mode
- [ ] Mock ABHA validation
- [ ] Simulated ABDM responses
- [ ] Clear "Sandbox" indicators

#### 11.6 Configuration
- [ ] Enable/disable ABDM per hospital
- [ ] Sandbox vs. production toggle
- [ ] ABDM credentials management

### Deliverables
✅ FHIR mapping functional  
✅ ABDM integration layer ready  
✅ ABHA validation working (mock/sandbox)  
✅ Configuration flexible  

### Testing
- [ ] FHIR resources generated correctly
- [ ] FHIR resources validate against schema
- [ ] ABHA validation works (mock)
- [ ] Linking workflow functional
- [ ] Demo mode works without real ABDM

---

## Phase 12: Security, Testing & Deployment

### Objectives
- Comprehensive security hardening
- Automated testing
- Performance optimization
- Production deployment readiness

### Tasks

#### 12.1 Security Hardening
- [ ] Run security audit (npm audit, snyk)
- [ ] Fix all critical vulnerabilities
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request validation on all endpoints
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Review and fix CORS configuration
- [ ] Implement proper error handling (don't leak stack traces)
- [ ] Set up security headers (Helmet)
- [ ] Encrypt sensitive fields in database
- [ ] Review and secure file upload
- [ ] Implement SQL injection prevention (Prisma handles this)
- [ ] Implement XSS prevention
- [ ] Add session timeout
- [ ] Implement account lockout after failed logins

#### 12.2 Testing
- [ ] **Unit Tests**:
  - [ ] Auth service
  - [ ] Question engine
  - [ ] Red-flag engine
  - [ ] Summary generator
  - [ ] FHIR mapper
  - [ ] Target: 70%+ coverage
- [ ] **Integration Tests**:
  - [ ] API endpoints
  - [ ] Database operations
  - [ ] External service mocks
- [ ] **End-to-End Tests**:
  - [ ] Complete patient intake flow
  - [ ] Doctor review workflow
  - [ ] Red-flag scenario
  - [ ] Document upload and OCR
- [ ] **Performance Tests**:
  - [ ] Load testing (50+ concurrent users)
  - [ ] API response time benchmarks
  - [ ] Database query optimization

#### 12.3 Performance Optimization
- [ ] Database indexing:
  - [ ] Patient lookups (UHID, ABHA)
  - [ ] Encounter queries
  - [ ] Timeline aggregation
- [ ] API response caching (Redis)
- [ ] Implement pagination for large lists
- [ ] Optimize N+1 queries (Prisma includes)
- [ ] Image optimization (compress uploads)
- [ ] Frontend code splitting
- [ ] Lazy loading for routes
- [ ] CDN for static assets (production)

#### 12.4 Monitoring & Logging
- [ ] Set up structured logging (Winston)
- [ ] Log levels (error, warn, info, debug)
- [ ] Error tracking (Sentry or similar)
- [ ] Application metrics (optional: Prometheus)
- [ ] Database monitoring
- [ ] Set up alerts for critical errors

#### 12.5 Documentation
- [ ] Complete README.md:
  - [ ] Project overview
  - [ ] Setup instructions
  - [ ] Development workflow
  - [ ] Deployment guide
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Database schema diagram
- [ ] Architecture diagram
- [ ] User guides:
  - [ ] Patient intake guide
  - [ ] Doctor guide
  - [ ] Admin guide

#### 12.6 Deployment Preparation
- [ ] Production environment variables
- [ ] Database migration strategy
- [ ] Seed data for production (hospitals, staff)
- [ ] SSL/TLS certificate setup
- [ ] Domain configuration
- [ ] CDN setup (CloudFlare)
- [ ] Backup strategy
- [ ] Disaster recovery plan

#### 12.7 Deployment
- [ ] Create production Dockerfiles
- [ ] Create docker-compose.prod.yml
- [ ] Set up CI/CD pipeline (GitHub Actions):
  - [ ] Run tests on PR
  - [ ] Build Docker images
  - [ ] Push to registry
  - [ ] Deploy to staging
  - [ ] Deploy to production (manual approval)
- [ ] Deploy to staging environment
- [ ] Conduct User Acceptance Testing (UAT)
- [ ] Deploy to production
- [ ] Smoke tests post-deployment

### Deliverables
✅ All security vulnerabilities addressed  
✅ Comprehensive test suite passing  
✅ Performance benchmarks met  
✅ Production deployment successful  
✅ Monitoring and logging operational  
✅ Documentation complete  

### Testing
- [ ] Security scan passes
- [ ] All automated tests pass
- [ ] Load testing meets targets
- [ ] UAT successful
- [ ] Production deployment smoke tests pass

---

## Post-Launch

### Immediate Post-Launch (Week 1-2)
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Conduct retrospective

### Short-Term Enhancements (Month 1-3)
- [ ] Improve voice recognition accuracy
- [ ] Enhance OCR for handwritten documents
- [ ] Add more languages
- [ ] Improve AI summary accuracy
- [ ] Performance optimization based on real usage

### Medium-Term Features (Month 3-6)
- [ ] Mobile app (React Native)
- [ ] Patient portal (home access)
- [ ] Appointment scheduling
- [ ] Real-time vital signs integration
- [ ] Lab system integration
- [ ] Radiology system integration

### Long-Term Vision (6-12 months)
- [ ] Multi-hospital deployment
- [ ] Production ABDM integration
- [ ] Advanced analytics dashboard
- [ ] Telemedicine integration
- [ ] Billing integration
- [ ] Pharmacy integration

---

## Risk Management

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Voice recognition accuracy low for regional languages | High | Medium | Provide text fallback, improve with feedback |
| OCR fails on handwritten prescriptions | High | Medium | Manual review workflow, train better models |
| AI generates incorrect summaries | Medium | High | Doctor verification required, never autonomous |
| External APIs unavailable | Medium | Medium | Fallback to demo/mock mode |
| Database performance issues | Low | High | Proper indexing, caching, load testing |
| Security breach | Low | Critical | Regular security audits, penetration testing |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Doctor adoption resistance | Medium | High | Training program, clear benefits communication |
| Patient usability issues | Medium | High | User testing, iterative improvements |
| Hospital IT infrastructure limitations | High | Medium | Offline mode, low-bandwidth optimization |
| Regulatory compliance issues | Low | Critical | Legal review, ABDM compliance, audit trail |

---

## Success Criteria

### Technical Success Metrics
- [ ] System uptime > 99.5%
- [ ] API response time < 500ms (p95)
- [ ] Zero critical security vulnerabilities
- [ ] Test coverage > 70%
- [ ] Zero data loss incidents

### User Experience Metrics
- [ ] Patient intake completion rate > 85%
- [ ] Average intake time < 10 minutes
- [ ] Patient satisfaction > 4.0/5.0
- [ ] Doctor summary acceptance rate > 80%
- [ ] Error rate < 5%

### Business Metrics
- [ ] Reduction in doctor intake time: 40%
- [ ] Patient wait time reduction: 30%
- [ ] Data entry errors reduction: 60%
- [ ] Document digitization: 100% of uploads
- [ ] 5+ hospitals deployed

---

## Resource Requirements

### Team Composition (Recommended)
- **1 Full-stack Lead Developer** (oversees architecture, critical decisions)
- **2 Frontend Developers** (React, UI/UX)
- **2 Backend Developers** (Node.js, database, APIs)
- **1 DevOps Engineer** (deployment, CI/CD, monitoring)
- **1 QA Engineer** (testing, automation)
- **1 Clinical Consultant** (domain expert, validates clinical logic)
- **1 Product Manager** (requirements, stakeholder management)
- **1 UX Designer** (optional, if major Stitch UI changes needed)

### Infrastructure
- **Development**:
  - Local Docker environment
  - Development database (PostgreSQL)
  - Development Redis
  - MinIO (S3-compatible)
- **Staging**:
  - Cloud VM or container service
  - Managed PostgreSQL
  - Managed Redis
  - S3 storage
- **Production**:
  - Load-balanced API servers
  - Managed PostgreSQL (replicated)
  - Managed Redis (clustered)
  - S3 storage
  - CDN
  - Monitoring tools

### External Services Budget
- AI API (OpenAI/Anthropic): ~$500-2000/month
- OCR API (if using cloud): ~$200-500/month
- Speech API (if using cloud): ~$100-300/month
- Cloud infrastructure: ~$500-1500/month
- Monitoring (Sentry, etc.): ~$50-200/month
- **Total estimated**: $1350-4500/month

---

## Next Steps

### Immediate Actions
1. **Review and approve** this implementation plan
2. **Assemble team** (if not already done)
3. **Set up development environment** (Docker, repos, access)
4. **Begin Phase 1** (Project Foundation)
5. **Set up project management** (Jira, Trello, GitHub Projects)

### Development Workflow
1. **Sprint Planning** (2-week sprints recommended)
2. **Daily standups** (15 minutes)
3. **Weekly demos** (show progress to stakeholders)
4. **Sprint retrospectives**
5. **Code reviews** (all PRs require review)
6. **Continuous integration** (automated tests on every PR)

### Communication Channels
- **Developer chat**: Slack / Discord
- **Project tracking**: Jira / Linear / GitHub Projects
- **Documentation**: Confluence / Notion / GitHub Wiki
- **Code repository**: GitHub / GitLab
- **Design files**: Figma (preserve Stitch designs)

---

## Conclusion

This phased implementation plan provides a structured approach to building CUREX from the existing Stitch UI foundation. The plan emphasizes:

✅ **Incremental development** - Each phase delivers working functionality  
✅ **Design preservation** - Stitch UI maintained throughout  
✅ **Safety first** - Medical AI boundaries strictly enforced  
✅ **Quality assurance** - Testing at every phase  
✅ **Flexibility** - Architecture supports future enhancements  

**Estimated Timeline**: 18-24 weeks for full implementation  
**Recommended Team Size**: 8-10 people  
**Estimated Budget**: $10,000-25,000/month (team + infrastructure)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Sept 5, 2026 | System Analysis | Initial implementation plan |

**Ready to begin Phase 1!**
