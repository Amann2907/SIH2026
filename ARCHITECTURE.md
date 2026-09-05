# CUREX - System Architecture

**Version:** 1.0.0  
**Last Updated:** September 5, 2026  
**Status:** Design Phase

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Data Architecture](#4-data-architecture)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Integration Architecture](#7-integration-architecture)
8. [Deployment Architecture](#8-deployment-architecture)

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Patient Kiosk (React)  │  Doctor Dashboard (React)  │  Admin   │
│  - Touch Interface      │  - Case Management         │  Panel   │
│  - Voice Input          │  - Queue View              │          │
│  - Document Scanner     │  - Summary Verification    │          │
└────────────┬────────────┴──────────────┬──────────────┴─────────┘
             │                           │
             │      HTTPS/WSS            │
             ▼                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY / LOAD BALANCER               │
└────────────┬────────────────────────────────────┬────────────────┘
             │                                    │
             ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER (Node.js)                  │
├─────────────────────────────────────────────────────────────────┤
│  REST API  │  WebSocket  │  Auth Service  │  Background Jobs    │
│  Express   │  Socket.IO  │  JWT/Session   │  Bull Queue         │
└────────────┴─────────────┴────────────────┴─────────────────────┘
             │                                    │
             ▼                                    ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│   BUSINESS LOGIC LAYER   │      │   EXTERNAL SERVICE LAYER     │
├──────────────────────────┤      ├──────────────────────────────┤
│ • Clinical Engine        │      │ • AI Provider (OpenAI/       │
│ • Question Engine        │      │   Anthropic/Local)           │
│ • Red Flag Engine        │      │ • OCR Provider (Tesseract/   │
│ • Summary Generator      │      │   Cloud Vision)              │
│ • FHIR Mapper            │      │ • Speech Provider (Browser/  │
│ • AYUSH Module           │      │   Bhashini)                  │
└────────────┬─────────────┘      │ • ABDM Integration           │
             │                     └──────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
├──────────────────────────────────────────────────────────────────┤
│  PostgreSQL        │  Redis Cache     │  S3 Object Storage       │
│  (Prisma ORM)      │  (Sessions/Jobs) │  (Documents/Images)      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Interaction Flow

#### Patient Intake Flow
```
Patient → Kiosk UI → API → Clinical Engine → Database
                    ↓
                Voice/OCR → External Services → Entity Extraction
                    ↓
                Red Flag Check → Alert → WebSocket → Doctor Dashboard
```

#### Doctor Review Flow
```
Doctor → Dashboard → API → Database → Retrieve Case Data
                   ↓
         Edit Summary → Validation → Database Update
                   ↓
         Confirm → Status Change → Audit Log
```

---

## 2. Technology Stack

### 2.1 Frontend Stack

```typescript
// Core Framework
- React 18.x
- TypeScript 5.x
- Vite 5.x

// Styling
- Tailwind CSS 3.x
- CSS Modules (component-specific)
- Design tokens from Stitch UI

// State Management
- TanStack Query (React Query) - Server state
- Zustand - Client state
- Context API - Theme/i18n

// Routing
- React Router 6.x
- Protected routes
- Role-based routing

// Forms & Validation
- React Hook Form
- Zod schemas
- Custom validators

// UI Components
- Existing Stitch components (preserved)
- Headless UI (modals, dropdowns)
- React Icons (Material Symbols)

// Real-time
- Socket.IO Client

// Voice/Speech
- Web Speech API (browser)
- MediaRecorder API
- Audio Worklet (future)

// I18n
- i18next
- react-i18next
- ICU message format
```

### 2.2 Backend Stack

```typescript
// Runtime & Framework
- Node.js 20.x LTS
- Express 4.x
- TypeScript 5.x

// Database & ORM
- PostgreSQL 16.x
- Prisma 5.x
- Prisma migrations

// Authentication
- jsonwebtoken (JWT)
- bcrypt (password hashing)
- Express session (optional)

// Validation
- Zod (shared with frontend)
- Express validator

// File Handling
- Multer (upload middleware)
- Sharp (image processing)
- pdf-parse (PDF extraction)

// Real-time
- Socket.IO

// Background Jobs
- Bull (Redis-based queue)
- Cron jobs (node-cron)

// Caching
- Redis (ioredis client)

// Logging
- Winston
- Morgan (HTTP logging)

// Testing
- Jest
- Supertest (API testing)
- MSW (Mock Service Worker)

// Documentation
- OpenAPI/Swagger
```

### 2.3 External Service Integrations

```typescript
// AI/ML Services (abstracted)
interface AIProvider {
  name: "openai" | "anthropic" | "local" | "mock";
  generateSummary(data: ClinicalData): Promise<ClinicalSummary>;
  extractEntities(text: string): Promise<MedicalEntity[]>;
}

// OCR Services (abstracted)
interface OCRProvider {
  name: "tesseract" | "google-vision" | "azure" | "mock";
  extractText(image: Buffer): Promise<string>;
  extractMedicalEntities(text: string): Promise<Entity[]>;
}

// Speech Services (abstracted)
interface SpeechProvider {
  name: "browser" | "bhashini" | "ai4bharat" | "mock";
  transcribe(audio: Blob, language: string): Promise<Transcription>;
  synthesize(text: string, language: string): Promise<AudioBuffer>;
}

// ABDM Integration (abstracted)
interface ABDMProvider {
  name: "sandbox" | "production" | "mock";
  validateABHA(abhaNumber: string): Promise<ABHARecord>;
  linkHealthRecords(patientId: string, abhaId: string): Promise<void>;
  fetchConsents(abhaId: string): Promise<Consent[]>;
}
```

### 2.4 DevOps & Infrastructure

```yaml
# Development
- Docker & Docker Compose
- Hot reload (Vite HMR, nodemon)
- PostgreSQL container
- Redis container
- MinIO (S3-compatible local storage)

# CI/CD
- GitHub Actions (preferred) / GitLab CI
- Automated testing
- Linting (ESLint, Prettier)
- Type checking
- Build verification

# Production
- PM2 (Node.js process management)
- Nginx (reverse proxy, SSL termination)
- PostgreSQL (managed service recommended)
- Redis (managed service recommended)
- S3 / equivalent object storage
- CloudFlare / CDN (optional)

# Monitoring
- Health check endpoints
- Prometheus metrics (future)
- Application logging (Winston → cloud logs)
- Error tracking (Sentry/similar)
```

---

## 3. Project Structure

### 3.1 Recommended Monorepo Structure

```
curex/
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
├── apps/
│   ├── web/                    # Patient & doctor frontend
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/         # Images, fonts
│   │   │   ├── components/     # Reusable React components
│   │   │   │   ├── common/     # Buttons, inputs, cards
│   │   │   │   ├── patient/    # Patient-specific components
│   │   │   │   ├── doctor/     # Doctor-specific components
│   │   │   │   └── admin/      # Admin-specific components
│   │   │   ├── pages/          # Route pages
│   │   │   │   ├── patient/
│   │   │   │   ├── doctor/
│   │   │   │   └── admin/
│   │   │   ├── layouts/        # Page layouts
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API clients
│   │   │   ├── contexts/       # React contexts
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── types/          # TypeScript types
│   │   │   ├── utils/          # Helper functions
│   │   │   ├── i18n/           # Translations
│   │   │   ├── styles/         # Global styles
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   │
│   └── api/                    # Backend API
│       ├── src/
│       │   ├── modules/        # Feature modules
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.routes.ts
│       │   │   │   └── auth.types.ts
│       │   │   ├── patients/
│       │   │   ├── encounters/
│       │   │   ├── clinical/
│       │   │   ├── documents/
│       │   │   ├── timeline/
│       │   │   ├── summaries/
│       │   │   ├── redflags/
│       │   │   ├── doctors/
│       │   │   ├── queue/
│       │   │   └── admin/
│       │   ├── middleware/     # Express middleware
│       │   │   ├── auth.middleware.ts
│       │   │   ├── validation.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   └── logging.middleware.ts
│       │   ├── services/       # Business logic services
│       │   │   ├── clinical-engine.service.ts
│       │   │   ├── question-engine.service.ts
│       │   │   ├── redflag-engine.service.ts
│       │   │   ├── ai.service.ts
│       │   │   ├── ocr.service.ts
│       │   │   ├── speech.service.ts
│       │   │   ├── fhir-mapper.service.ts
│       │   │   └── abdm.service.ts
│       │   ├── providers/      # External service providers
│       │   │   ├── ai/
│       │   │   │   ├── index.ts
│       │   │   │   ├── openai.provider.ts
│       │   │   │   ├── anthropic.provider.ts
│       │   │   │   └── mock.provider.ts
│       │   │   ├── ocr/
│       │   │   ├── speech/
│       │   │   └── abdm/
│       │   ├── workers/        # Background job workers
│       │   │   ├── document-processor.worker.ts
│       │   │   ├── summary-generator.worker.ts
│       │   │   └── notification.worker.ts
│       │   ├── utils/          # Helper utilities
│       │   │   ├── logger.ts
│       │   │   ├── errors.ts
│       │   │   └── validators.ts
│       │   ├── config/         # Configuration
│       │   │   ├── database.ts
│       │   │   ├── redis.ts
│       │   │   ├── storage.ts
│       │   │   └── app.ts
│       │   ├── types/          # TypeScript types
│       │   ├── app.ts          # Express app setup
│       │   └── server.ts       # Server entry point
│       ├── tests/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── e2e/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                   # Shared packages
│   ├── shared-types/           # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── patient.types.ts
│   │   │   ├── clinical.types.ts
│   │   │   ├── fhir.types.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── clinical-engine/        # Clinical logic (can be shared)
│   │   ├── src/
│   │   │   ├── questions/      # Question bank
│   │   │   ├── rules/          # Red flag rules
│   │   │   ├── ontology/       # Clinical concepts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── validation/             # Shared Zod schemas
│   │   ├── src/
│   │   │   ├── patient.schema.ts
│   │   │   ├── clinical.schema.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ai/                     # AI/ML utilities
│       ├── src/
│       │   ├── prompts/        # AI prompt templates
│       │   ├── parsers/        # Response parsers
│       │   └── index.ts
│       └── package.json
│
├── prisma/                     # Database schema & migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── docker/
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── nginx.conf
│
├── docker-compose.yml
├── docker-compose.prod.yml
│
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json                # Root package.json (workspace)
├── tsconfig.json               # Base TypeScript config
├── README.md
├── SPECIFICATION.md
├── ARCHITECTURE.md
└── IMPLEMENTATION_PLAN.md
```

### 3.2 Alternative Simple Structure (If Monorepo Too Complex)

```
curex/
├── client/                     # Frontend (React)
├── server/                     # Backend (Node.js)
├── prisma/                     # Database
├── shared/                     # Shared types
└── docker-compose.yml
```

---

## 4. Data Architecture

### 4.1 Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      UserRole
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  patient Patient?
  doctor  Doctor?
  nurse   Nurse?
  admin   Admin?

  sessions    Session[]
  auditLogs   AuditLog[]
  consents    Consent[]
  
  @@map("users")
}

enum UserRole {
  PATIENT
  DOCTOR
  NURSE
  ADMIN
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  ipAddress String?
  userAgent String?

  @@map("sessions")
}

// ============================================================================
// PATIENT DATA
// ============================================================================

model Patient {
  id          String    @id @default(uuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Demographics
  firstName   String
  middleName  String?
  lastName    String
  dateOfBirth DateTime
  gender      Gender
  bloodGroup  String?
  
  // Contact
  phone       String
  email       String?
  address     String?
  city        String?
  state       String?
  pincode     String?
  
  // Identifiers
  uhid        String?   @unique  // Hospital unique ID
  abhaNumber  String?   @unique  // ABDM health ID
  aadhaarHash String?              // Encrypted/hashed
  
  // Preferences
  preferredLanguage String @default("en")
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  encounters       Encounter[]
  documents        Document[]
  consents         Consent[]
  medicalHistory   MedicalHistory?
  
  @@map("patients")
}

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

model MedicalHistory {
  id        String   @id @default(uuid())
  patientId String   @unique
  patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  allergies          Allergy[]
  medications        Medication[]
  diagnoses          Diagnosis[]
  surgeries          Surgery[]
  familyHistory      FamilyHistory[]
  personalHistory    Json?              // Lifestyle data
  ayushHistory       AyushHistory?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("medical_histories")
}

model Allergy {
  id        String   @id @default(uuid())
  historyId String
  history   MedicalHistory @relation(fields: [historyId], references: [id], onDelete: Cascade)
  
  allergen  String
  reaction  String?
  severity  AllergySeverity
  verifiedBy String?
  verifiedAt DateTime?
  
  createdAt DateTime @default(now())
  
  @@map("allergies")
}

enum AllergySeverity {
  MILD
  MODERATE
  SEVERE
  LIFE_THREATENING
}

model Medication {
  id        String   @id @default(uuid())
  historyId String
  history   MedicalHistory @relation(fields: [historyId], references: [id], onDelete: Cascade)
  
  name      String
  dosage    String
  frequency String
  route     String?
  startDate DateTime?
  endDate   DateTime?
  isActive  Boolean @default(true)
  prescribedBy String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("medications")
}

model Diagnosis {
  id        String   @id @default(uuid())
  historyId String
  history   MedicalHistory @relation(fields: [historyId], references: [id], onDelete: Cascade)
  
  condition String
  icdCode   String?
  diagnosedDate DateTime?
  status    DiagnosisStatus @default(ACTIVE)
  notes     String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("diagnoses")
}

enum DiagnosisStatus {
  ACTIVE
  RESOLVED
  CHRONIC
  IN_REMISSION
}

model Surgery {
  id        String   @id @default(uuid())
  historyId String
  history   MedicalHistory @relation(fields: [historyId], references: [id], onDelete: Cascade)
  
  procedure String
  date      DateTime
  hospital  String?
  surgeon   String?
  notes     String?
  
  createdAt DateTime @default(now())
  
  @@map("surgeries")
}

model FamilyHistory {
  id        String   @id @default(uuid())
  historyId String
  history   MedicalHistory @relation(fields: [historyId], references: [id], onDelete: Cascade)
  
  relation  String   // father, mother, sibling, etc.
  condition String
  ageAtOnset Int?
  
  createdAt DateTime @default(now())
  
  @@map("family_histories")
}

model AyushHistory {
  id        String   @id @default(uuid())
  historyId String   @unique
  history   MedicalHistory @relation(fields: [historyId], references: [id], onDelete: Cascade)
  
  prakriti  String?
  vikriti   String?
  sara      String?
  samhanana String?
  pramana   String?
  satmya    String?
  sattva    String?
  aharaShakti String?
  vyayamaShakti String?
  vaya      String?
  agni      String?
  koshtha   String?
  aharaVihara Json?
  nidana    String?
  samprapti String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("ayush_histories")
}

// ============================================================================
// CLINICAL ENCOUNTERS
// ============================================================================

model Encounter {
  id          String   @id @default(uuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  doctorId    String?
  doctor      Doctor?  @relation(fields: [doctorId], references: [id])
  
  hospitalId  String?
  hospital    Hospital? @relation(fields: [hospitalId], references: [id])
  
  kioskId     String?
  kiosk       Kiosk?   @relation(fields: [kioskId], references: [id])
  
  // Status
  status      EncounterStatus @default(INTAKE_STARTED)
  priority    Priority        @default(NORMAL)
  
  // Clinical Data
  chiefComplaint    String?
  presentIllness    String?
  reviewOfSystems   Json?
  
  // AI/Processing
  aiSummary         String?
  aiSummaryStatus   SummaryStatus @default(PENDING)
  verifiedBy        String?
  verifiedAt        DateTime?
  
  // Metadata
  language          String @default("en")
  intakeMode        String? // voice, touch, assisted
  startedAt         DateTime @default(now())
  completedAt       DateTime?
  
  questions         QuestionResponse[]
  documents         Document[]
  redFlags          RedFlag[]
  timelineEvents    TimelineEvent[]
  
  @@map("encounters")
}

enum EncounterStatus {
  INTAKE_STARTED
  INTAKE_COMPLETED
  IN_QUEUE
  WITH_DOCTOR
  COMPLETED
  CANCELLED
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum SummaryStatus {
  PENDING
  AI_DRAFT
  UNDER_REVIEW
  EDITED
  CLINICIAN_VERIFIED
  REJECTED
}

model QuestionResponse {
  id          String   @id @default(uuid())
  encounterId String
  encounter   Encounter @relation(fields: [encounterId], references: [id], onDelete: Cascade)
  
  questionId  String
  question    String   // Store question text
  answer      String
  answerType  String   // text, number, select, multiselect
  
  // Voice metadata
  isVoiceInput Boolean @default(false)
  voiceConfidence Float?
  transcription String?
  
  createdAt   DateTime @default(now())
  
  @@map("question_responses")
}

// ============================================================================
// DOCUMENTS & OCR
// ============================================================================

model Document {
  id          String   @id @default(uuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  encounterId String?
  encounter   Encounter? @relation(fields: [encounterId], references: [id])
  
  category    DocumentCategory
  fileName    String
  fileSize    Int
  mimeType    String
  storageKey  String   // S3 key
  thumbnailKey String?
  
  // OCR
  ocrText     String?
  ocrConfidence Float?
  ocrStatus   OCRStatus @default(PENDING)
  ocrProcessedAt DateTime?
  
  uploadedAt  DateTime @default(now())
  
  extractedEntities DocumentEntity[]
  timelineEvents    TimelineEvent[]
  
  @@map("documents")
}

enum DocumentCategory {
  PRESCRIPTION
  LAB_REPORT
  DISCHARGE_SUMMARY
  IMAGING_REPORT
  SURGERY_RECORD
  OTHER
}

enum OCRStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  MANUAL_REVIEW
}

model DocumentEntity {
  id         String   @id @default(uuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  
  entityType EntityType
  value      String
  confidence Float
  status     EntityStatus @default(PENDING)
  
  // Additional fields based on type
  metadata   Json?
  
  verifiedBy String?
  verifiedAt DateTime?
  
  createdAt  DateTime @default(now())
  
  @@map("document_entities")
}

enum EntityType {
  DIAGNOSIS
  MEDICATION
  DOSAGE
  LAB_TEST
  LAB_VALUE
  PROCEDURE
  DATE
  DOCTOR_NAME
  HOSPITAL_NAME
  OTHER
}

enum EntityStatus {
  PENDING
  CONFIRMED
  EDITED
  REJECTED
}

// ============================================================================
// RED FLAGS & TRIAGE
// ============================================================================

model RedFlag {
  id          String   @id @default(uuid())
  encounterId String
  encounter   Encounter @relation(fields: [encounterId], references: [id], onDelete: Cascade)
  
  flagType    String   // CHEST_PAIN_HIGH_RISK, STROKE_SYMPTOMS, etc.
  severity    Priority
  description String
  
  triggeredBy String   // Rule ID or symptom combination
  metadata    Json?    // Store triggering data
  
  acknowledged Boolean @default(false)
  acknowledgedBy String?
  acknowledgedAt DateTime?
  
  createdAt   DateTime @default(now())
  
  alerts      TriageAlert[]
  
  @@map("red_flags")
}

model TriageAlert {
  id         String   @id @default(uuid())
  redFlagId  String
  redFlag    RedFlag  @relation(fields: [redFlagId], references: [id], onDelete: Cascade)
  
  alertType  String   // NURSE, DOCTOR, EMERGENCY
  sentTo     String   // User ID or role
  status     AlertStatus @default(SENT)
  
  sentAt     DateTime @default(now())
  readAt     DateTime?
  
  @@map("triage_alerts")
}

enum AlertStatus {
  SENT
  DELIVERED
  READ
  ACKNOWLEDGED
  RESOLVED
}

// ============================================================================
// TIMELINE
// ============================================================================

model TimelineEvent {
  id          String   @id @default(uuid())
  encounterId String?
  encounter   Encounter? @relation(fields: [encounterId], references: [id])
  
  documentId  String?
  document    Document?  @relation(fields: [documentId], references: [id])
  
  eventType   EventType
  title       String
  description String?
  eventDate   DateTime
  
  metadata    Json?
  
  createdAt   DateTime @default(now())
  
  @@map("timeline_events")
}

enum EventType {
  DIAGNOSIS
  MEDICATION_START
  MEDICATION_STOP
  LAB_RESULT
  PROCEDURE
  SURGERY
  HOSPITAL_VISIT
  DOCUMENT_UPLOAD
  SYMPTOM_ONSET
  OTHER
}

// ============================================================================
// HEALTHCARE PROVIDERS
// ============================================================================

model Doctor {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  firstName   String
  lastName    String
  qualification String
  specialty   String?
  registrationNumber String? @unique
  
  hospitalId  String?
  hospital    Hospital? @relation(fields: [hospitalId], references: [id])
  
  isAvailable Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  encounters  Encounter[]
  
  @@map("doctors")
}

model Nurse {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  firstName   String
  lastName    String
  qualification String?
  
  hospitalId  String?
  hospital    Hospital? @relation(fields: [hospitalId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("nurses")
}

model Admin {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  firstName String
  lastName  String
  
  hospitalId String?
  hospital   Hospital? @relation(fields: [hospitalId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("admins")
}

// ============================================================================
// HOSPITAL & INFRASTRUCTURE
// ============================================================================

model Hospital {
  id        String   @id @default(uuid())
  name      String
  type      HospitalType
  
  address   String?
  city      String?
  state     String?
  pincode   String?
  phone     String?
  
  isActive  Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  doctors   Doctor[]
  nurses    Nurse[]
  admins    Admin[]
  kiosks    Kiosk[]
  encounters Encounter[]
  
  @@map("hospitals")
}

enum HospitalType {
  GENERAL
  MULTISPECIALTY
  AYUSH
  SPECIALTY
  CLINIC
}

model Kiosk {
  id         String   @id @default(uuid())
  hospitalId String
  hospital   Hospital @relation(fields: [hospitalId], references: [id], onDelete: Cascade)
  
  name       String
  location   String
  deviceId   String   @unique
  
  isOnline   Boolean  @default(false)
  lastPing   DateTime?
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  encounters Encounter[]
  
  @@map("kiosks")
}

// ============================================================================
// CONSENT MANAGEMENT
// ============================================================================

model Consent {
  id        String   @id @default(uuid())
  patientId String
  patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  consentType ConsentType
  purpose   String
  version   String
  status    ConsentStatus @default(GIVEN)
  
  givenAt   DateTime @default(now())
  withdrawnAt DateTime?
  expiresAt DateTime?
  
  metadata  Json?
  
  @@map("consents")
}

enum ConsentType {
  DATA_COLLECTION
  AI_PROCESSING
  DOCUMENT_DIGITIZATION
  ABDM_INTEGRATION
  DATA_SHARING
  RESEARCH
}

enum ConsentStatus {
  GIVEN
  WITHDRAWN
  EXPIRED
}

// ============================================================================
// AUDIT & COMPLIANCE
// ============================================================================

model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  action    String   // LOGIN, VIEW_PATIENT, EDIT_SUMMARY, etc.
  resource  String?  // Patient ID, Document ID, etc.
  details   Json?
  
  ipAddress String?
  userAgent String?
  
  createdAt DateTime @default(now())
  
  @@map("audit_logs")
}

// ============================================================================
// CLINICAL KNOWLEDGE BASE
// ============================================================================

model QuestionBank {
  id          String   @id @default(uuid())
  category    String
  subcategory String?
  
  questionText Json    // Multilingual question text
  answerType   String   // text, number, select, etc.
  options      Json?    // For select/multiselect
  
  followUpRules Json?   // Conditional next questions
  redFlagRules  Json?   // Red flag detection rules
  
  isActive    Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("question_bank")
}

model RedFlagRule {
  id          String   @id @default(uuid())
  name        String
  description String
  
  conditions  Json     // Rule logic
  severity    Priority
  action      Json     // What to do when triggered
  
  isActive    Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("red_flag_rules")
}
```

### 4.2 Data Relationships Diagram

```
User ──────────────────┐
  ├─ Patient          │
  │   ├─ Encounters   │
  │   ├─ Documents    │
  │   └─ MedicalHistory
  │       ├─ Allergies
  │       ├─ Medications
  │       ├─ Diagnoses
  │       ├─ Surgeries
  │       ├─ FamilyHistory
  │       └─ AyushHistory
  ├─ Doctor           │
  │   └─ Encounters   │
  ├─ Nurse            │
  └─ Admin            │

Encounter ─────────────┐
  ├─ QuestionResponses
  ├─ Documents
  │   └─ DocumentEntities
  ├─ RedFlags
  │   └─ TriageAlerts
  └─ TimelineEvents

Hospital
  ├─ Doctors
  ├─ Nurses
  ├─ Kiosks
  └─ Encounters
```

---

## 5. API Design

### 5.1 API Structure

```
/api/v1/
  ├── /auth
  │   ├── POST /login
  │   ├── POST /logout
  │   ├── POST /refresh
  │   └── GET  /me
  │
  ├── /patients
  │   ├── POST   /                     # Register new patient
  │   ├── GET    /:id                  # Get patient details
  │   ├── PATCH  /:id                  # Update patient
  │   ├── GET    /:id/history          # Medical history
  │   ├── GET    /:id/timeline         # Medical timeline
  │   ├── GET    /:id/encounters       # List encounters
  │   └── GET    /:id/documents        # List documents
  │
  ├── /encounters
  │   ├── POST   /                     # Start new encounter
  │   ├── GET    /:id                  # Get encounter details
  │   ├── PATCH  /:id                  # Update encounter
  │   ├── POST   /:id/answers          # Submit question answers
  │   ├── GET    /:id/questions        # Get next questions
  │   ├── POST   /:id/complete         # Mark intake complete
  │   ├── GET    /:id/summary          # Get AI summary
  │   └── POST   /:id/verify           # Doctor verify summary
  │
  ├── /clinical
  │   ├── POST   /check-redflags       # Run red flag detection
  │   ├── GET    /questions/:category  # Get questions for category
  │   └── POST   /extract-symptoms     # Extract from free text
  │
  ├── /documents
  │   ├── POST   /upload               # Upload document
  │   ├── GET    /:id                  # Get document
  │   ├── GET    /:id/download         # Download original
  │   ├── POST   /:id/process          # Trigger OCR processing
  │   ├── GET    /:id/entities         # Get extracted entities
  │   └── PATCH  /:id/entities/:entityId  # Verify entity
  │
  ├── /doctor
  │   ├── GET    /queue                # Get patient queue
  │   ├── GET    /alerts               # Get triage alerts
  │   ├── GET    /encounters/:id       # View patient case
  │   ├── PATCH  /encounters/:id/summary  # Edit summary
  │   ├── POST   /encounters/:id/confirm  # Confirm summary
  │   └── GET    /dashboard            # Dashboard stats
  │
  ├── /admin
  │   ├── GET    /hospitals            # List hospitals
  │   ├── GET    /kiosks               # List kiosks
  │   ├── GET    /kiosks/:id/status    # Kiosk status
  │   ├── GET    /users                # User management
  │   ├── GET    /audit-logs           # Audit logs
  │   └── GET    /analytics            # System analytics
  │
  ├── /ai
  │   ├── POST   /summarize            # Generate summary
  │   ├── POST   /extract-entities     # Extract medical entities
  │   └── POST   /transcribe           # Transcribe speech
  │
  └── /health
      ├── GET    /                     # Basic health check
      ├── GET    /db                   # Database status
      ├── GET    /redis                # Redis status
      └── GET    /services             # External services status
```

### 5.2 API Response Format

```typescript
// Success Response
{
  success: true,
  data: any,
  meta?: {
    page?: number,
    limit?: number,
    total?: number
  }
}

// Error Response
{
  success: false,
  error: {
    code: string,           // ERROR_CODE
    message: string,        // User-friendly message
    details?: any,          // Additional error details (dev only)
    field?: string,         // For validation errors
    timestamp: string
  }
}
```

### 5.3 WebSocket Events

```typescript
// Server → Client
{
  "queue:updated": { queueLength, estimatedWait },
  "alert:new": { alertId, type, priority, message },
  "document:processed": { documentId, status, entities },
  "summary:generated": { encounterId, summary },
  "redflag:detected": { encounterId, flagType, severity }
}

// Client → Server
{
  "join:doctor-queue": { doctorId },
  "join:encounter": { encounterId },
  "acknowledge:alert": { alertId }
}
```

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
1. Login Request
   POST /api/auth/login
   Body: { email, password }
   
2. Server validates credentials
   - Hash password with bcrypt
   - Compare with stored hash
   
3. Generate JWT tokens
   accessToken (15 min expiry)
   refreshToken (7 days expiry)
   
4. Return tokens
   Store refreshToken in httpOnly cookie (optional)
   Return accessToken in response body
   
5. Subsequent Requests
   Authorization: Bearer <accessToken>
   
6. Token Refresh
   POST /api/auth/refresh
   Body: { refreshToken }
   Returns new accessToken
```

### 6.2 Authorization Strategy

```typescript
// Role-based access control
enum Permission {
  // Patient permissions
  VIEW_OWN_DATA = "view:own:data",
  UPDATE_OWN_DATA = "update:own:data",
  START_INTAKE = "start:intake",
  
  // Doctor permissions
  VIEW_PATIENT_QUEUE = "view:patient:queue",
  VIEW_PATIENT_CASE = "view:patient:case",
  EDIT_CLINICAL_SUMMARY = "edit:clinical:summary",
  VERIFY_SUMMARY = "verify:summary",
  
  // Admin permissions
  MANAGE_USERS = "manage:users",
  VIEW_AUDIT_LOGS = "view:audit:logs",
  MANAGE_KIOSKS = "manage:kiosks",
  VIEW_ANALYTICS = "view:analytics"
}

// Middleware usage
router.get(
  "/doctor/queue",
  authenticateJWT,
  requireRole(["DOCTOR", "NURSE"]),
  requirePermission("view:patient:queue"),
  getDoctorQueue
);
```

### 6.3 Data Protection

```typescript
// Encryption at rest
- Database: PostgreSQL encryption
- Files: S3 server-side encryption
- Sensitive fields: Application-level encryption (AES-256)

// Encryption in transit
- HTTPS/TLS 1.3
- WSS (WebSocket Secure)

// Field-level encryption
const sensitiveFields = [
  "aadhaarHash",
  "abhaNumber",
  "dateOfBirth"
];

// Hash-only storage (never decryptable)
- Passwords: bcrypt
- Aadhaar: SHA-256 + salt
```

### 6.4 Security Headers

```typescript
// helmet middleware configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "*.googleusercontent.com"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(","),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

---

## 7. Integration Architecture

### 7.1 Service Abstraction Pattern

```typescript
// Base interface
interface ServiceProvider {
  name: string;
  isAvailable(): Promise<boolean>;
}

// AI Service
interface AIService extends ServiceProvider {
  generateClinicalSummary(data: ClinicalData): Promise<ClinicalSummary>;
  extractMedicalEntities(text: string): Promise<MedicalEntity[]>;
}

// Factory pattern
class AIServiceFactory {
  static create(type: "openai" | "anthropic" | "mock"): AIService {
    switch(type) {
      case "openai":
        return new OpenAIService();
      case "anthropic":
        return new AnthropicService();
      case "mock":
        return new MockAIService();
    }
  }
}

// Usage
const aiService = AIServiceFactory.create(
  process.env.AI_PROVIDER as any
);
```

### 7.2 FHIR Mapping Layer

```typescript
class FHIRMapper {
  // Map internal Patient to FHIR Patient resource
  toFHIRPatient(patient: Patient): R4.IPatient {
    return {
      resourceType: "Patient",
      id: patient.id,
      identifier: [
        {
          system: "https://curex.health/uhid",
          value: patient.uhid
        },
        {
          system: "https://abdm.gov.in/abha",
          value: patient.abhaNumber
        }
      ],
      name: [{
        family: patient.lastName,
        given: [patient.firstName, patient.middleName].filter(Boolean)
      }],
      gender: patient.gender.toLowerCase(),
      birthDate: patient.dateOfBirth.toISOString().split('T')[0]
    };
  }
  
  // Map FHIR Observation to internal format
  fromFHIRObservation(obs: R4.IObservation): LabResult {
    // Implementation
  }
}
```

---

## 8. Deployment Architecture

### 8.1 Development Environment

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: curex
      POSTGRES_PASSWORD: development
      POSTGRES_DB: curex_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://curex:development@postgres:5432/curex_dev
      REDIS_URL: redis://redis:6379
      S3_ENDPOINT: http://minio:9000
    depends_on:
      - postgres
      - redis
      - minio
    volumes:
      - ./apps/api:/app
      - /app/node_modules

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000
    volumes:
      - ./apps/web:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### 8.2 Production Architecture

```
                         ┌─────────────────┐
                         │  CloudFlare CDN │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  Load Balancer  │
                         │  (Nginx/ALB)    │
                         └────────┬────────┘
                                  │
                ┌─────────────────┴──────────────────┐
                │                                    │
        ┌───────▼───────┐                   ┌───────▼───────┐
        │   Web Server  │                   │   Web Server  │
        │   (Nginx)     │                   │   (Nginx)     │
        │   Static +    │                   │   Static +    │
        │   React SPA   │                   │   React SPA   │
        └───────┬───────┘                   └───────┬───────┘
                │                                    │
                └─────────────────┬──────────────────┘
                                  │
                         ┌────────▼────────┐
                         │  API Gateway    │
                         │  (Nginx/Kong)   │
                         └────────┬────────┘
                                  │
                ┌─────────────────┴──────────────────┐
                │                                    │
        ┌───────▼────────┐                  ┌───────▼────────┐
        │  Node.js API   │                  │  Node.js API   │
        │  (PM2 Cluster) │                  │  (PM2 Cluster) │
        └───────┬────────┘                  └───────┬────────┘
                │                                    │
                └─────────────────┬──────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐      ┌─────────▼────────┐      ┌───────▼────────┐
│  PostgreSQL    │      │  Redis Cluster   │      │  S3 Storage    │
│  (Managed RDS) │      │  (ElastiCache)   │      │  (AWS/Minio)   │
└────────────────┘      └──────────────────┘      └────────────────┘
```

### 8.3 Environment Configuration

```bash
# .env.example

# Application
NODE_ENV=production
PORT=3000
APP_URL=https://curex.health

# Database
DATABASE_URL=postgresql://user:pass@host:5432/curex_prod
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://redis-host:6379
REDIS_PASSWORD=secret

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-secret-key
REFRESH_TOKEN_EXPIRES_IN=7d

# File Storage
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=curex-documents
S3_REGION=ap-south-1
S3_ACCESS_KEY=AKIA...
S3_SECRET_KEY=secret...

# External Services
AI_PROVIDER=openai  # openai | anthropic | mock
OPENAI_API_KEY=sk-...
OCR_PROVIDER=tesseract  # tesseract | google-vision | mock
SPEECH_PROVIDER=browser  # browser | bhashini | mock
ABDM_PROVIDER=sandbox  # sandbox | production | mock

# Feature Flags
DEMO_MODE=false
ENABLE_ABDM=true
ENABLE_AYUSH=true
ENABLE_RED_FLAGS=true

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Sept 5, 2026 | System Analysis | Initial architecture document |

**Next Step**: Proceed to IMPLEMENTATION_PLAN.md
