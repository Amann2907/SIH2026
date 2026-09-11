# MediKiosk API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: TBD

## API Version
- Current: `v1.0.0`
- Base Path: `/api`

---

## Table of Contents
1. [Health & Status](#health--status)
2. [Authentication](#authentication)
3. [Patients](#patients)
4. [Encounters](#encounters)
5. [Clinical Intelligence](#clinical-intelligence)
6. [Document Processing & OCR](#document-processing--ocr)

---

## Health & Status

### GET /api/health
Check API server health status.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-09-05T10:30:00.000Z",
  "database": "connected"
}
```

### GET /api
Get API information and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "MediKiosk API Server",
  "version": "1.0.0",
  "demoMode": true,
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "patients": "/api/patients",
    "encounters": "/api/encounters",
    "documents": "/api/documents",
    "clinical": "/api/clinical"
  }
}
```

---

## Authentication

### POST /api/auth/login
Authenticate user (demo mode).

**Request Body:**
```json
{
  "email": "doctor@medikiosk.demo",
  "password": "demo123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-1",
    "name": "Dr. Ramesh Kumar",
    "email": "doctor@medikiosk.demo",
    "role": "DOCTOR"
  },
  "token": "demo-token-xyz"
}
```

**Status Codes:**
- `200`: Success
- `401`: Invalid credentials
- `400`: Missing required fields

---

## Patients

### GET /api/patients
Get list of all patients.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "MK-10428",
      "name": "Ramesh Kumar Sharma",
      "age": 56,
      "gender": "Male",
      "abhaId": "91-9876-5432-1234"
    }
  ]
}
```

### GET /api/patients/:id
Get specific patient details.

**Parameters:**
- `id` (path): Patient ID (e.g., MK-10428)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "MK-10428",
    "name": "Ramesh Kumar Sharma",
    "age": 56,
    "gender": "Male",
    "abhaId": "91-9876-5432-1234",
    "encounters": ["ENC-123456", "ENC-789012"]
  }
}
```

---

## Encounters

### GET /api/encounters
Get all encounters (intake sessions).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ENC-170432",
      "patientId": "MK-10428",
      "patientName": "Ramesh Kumar Sharma",
      "language": "Hindi",
      "mode": "voice",
      "chiefComplaint": "सीने में दर्द और भारीपन",
      "painSeverity": 6,
      "documents": [],
      "status": "IN_QUEUE",
      "tokenNumber": "#04",
      "createdAt": "2026-09-05T10:15:00.000Z"
    }
  ]
}
```

### POST /api/encounters
Create new encounter (submit intake).

**Request Body:**
```json
{
  "encounterId": "ENC-170432",
  "patientId": "MK-10428",
  "patientName": "Ramesh Kumar Sharma",
  "language": "Hindi",
  "mode": "voice",
  "chiefComplaint": "सीने में दर्द",
  "painSeverity": 6,
  "documents": [],
  "status": "IN_QUEUE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ENC-170432",
    "status": "IN_QUEUE",
    "tokenNumber": "#04",
    "createdAt": "2026-09-05T10:15:00.000Z"
  }
}
```

**Status Codes:**
- `201`: Created successfully
- `400`: Invalid request body
- `500`: Server error

---

## Clinical Intelligence

### POST /api/clinical/extract-symptoms
Extract symptoms from patient's chief complaint using NLP.

**Request Body:**
```json
{
  "complaint": "कल शाम से सीने में भारीपन और दर्द है"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symptoms": [
      {
        "name": "CHEST_PAIN",
        "confidence": 0.9
      }
    ],
    "primaryCategory": "CHEST_PAIN",
    "categories": ["CHEST_PAIN"]
  }
}
```

**Supported Categories:**
- `CHEST_PAIN`
- `FEVER`
- `ABDOMINAL_PAIN`
- `HEADACHE`
- `COUGH`

**Status Codes:**
- `200`: Success
- `400`: Missing complaint field

---

### POST /api/clinical/next-questions
Get relevant follow-up questions based on chief complaint category.

**Request Body:**
```json
{
  "category": "CHEST_PAIN",
  "answeredQuestions": ["chest_pain_location"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "chest_pain_radiation",
        "questionEn": "Does the pain spread to your arm, shoulder, neck, or jaw?",
        "questionHi": "क्या दर्द हाथ, कंधे, गर्दन या जबड़े तक जाता है?",
        "priority": 2
      },
      {
        "id": "chest_pain_breathing",
        "questionEn": "Are you having difficulty breathing?",
        "questionHi": "क्या सांस लेने में परेशानी हो रही है?",
        "priority": 1
      }
    ],
    "category": "CHEST_PAIN"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid category

---

### POST /api/clinical/detect-red-flags
Detect emergency symptoms requiring immediate attention.

**Request Body:**
```json
{
  "chiefComplaint": "सीने में दर्द और सांस लेने में परेशानी",
  "symptoms": ["chest pain", "breathing difficulty"],
  "clinicalAnswers": {
    "chest_pain_breathing": "yes",
    "chest_pain_sweating": "yes"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "priority": "EMERGENCY",
    "redFlags": [
      {
        "id": "chest_pain_cardiac",
        "severity": "EMERGENCY",
        "category": "CARDIAC",
        "description": "Possible cardiac emergency: Chest pain with breathing difficulty or sweating",
        "descriptionHi": "संभावित हृदय आपात स्थिति",
        "recommendation": "IMMEDIATE medical attention required.",
        "recommendationHi": "तत्काल चिकित्सा ध्यान आवश्यक है।"
      }
    ],
    "requiresImmediateAttention": true,
    "estimatedWaitTime": "IMMEDIATE",
    "recommendedAction": "EMERGENCY: You will be seen immediately.",
    "recommendedActionHi": "आपातकाल: आपको तुरंत देखा जाएगा।"
  }
}
```

**Priority Levels:**
- `EMERGENCY`: Immediate attention (life-threatening)
- `URGENT`: Priority queue (10-15 minutes)
- `ROUTINE`: Normal queue (30-60 minutes)

**Status Codes:**
- `200`: Success
- `400`: Missing required fields

---

## Document Processing & OCR

### POST /api/documents/upload
Upload and process medical document with OCR.

**Request:**
- Content-Type: `multipart/form-data`
- File Field: `document`
- Supported Formats: JPEG, PNG, PDF
- Max Size: 10MB

**Form Data:**
```
document: [File]
documentType: "Prescription" | "Lab Report" | "Discharge Summary"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "DOC-1693824567890",
    "ocrScore": 95,
    "extractedText": "Dr. Ramesh Kumar Sharma...",
    "entities": [
      {
        "type": "diagnosis",
        "value": "Type 2 Diabetes Mellitus",
        "confidence": 0.95
      },
      {
        "type": "medication",
        "value": "Metformin 500mg",
        "confidence": 0.92
      }
    ],
    "structuredData": {
      "diagnosis": ["Type 2 Diabetes Mellitus"],
      "medications": [
        {
          "name": "Metformin",
          "dosage": "500mg",
          "frequency": "OD"
        }
      ],
      "labValues": []
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid file type or size
- `413`: File too large
- `500`: OCR processing error

---

### POST /api/ocr/process
Process document OCR (alternative endpoint).

**Request Body:**
```json
{
  "documentType": "Prescription",
  "fileName": "prescription.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ocrScore": 92,
    "extractedText": "Mock OCR extracted text...",
    "structuredData": {
      "diagnosis": ["Type 2 Diabetes Mellitus", "Hypertension"],
      "medications": [
        {
          "name": "Metformin",
          "dosage": "500mg",
          "frequency": "OD"
        },
        {
          "name": "Amlodipine",
          "dosage": "5mg",
          "frequency": "OD"
        }
      ],
      "labValues": [],
      "doctorName": "Dr. Ramesh Kumar Sharma"
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Missing required fields

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting
- Current: Not implemented
- Recommended: 100 requests per minute per IP

---

## CORS Configuration
- Development: All origins allowed
- Production: Whitelist specific domains

---

## Authentication (Future)
Currently in demo mode. Future implementation:
- JWT tokens
- Session-based auth
- RBAC (Role-Based Access Control)

---

## Production Deployment Checklist

### Before Deployment:
- [ ] Replace mock OCR with production service (Tesseract.js, Google Vision, AWS Textract)
- [ ] Implement real NLP for symptom extraction (spaCy, Hugging Face, custom model)
- [ ] Add authentication middleware
- [ ] Implement rate limiting
- [ ] Set up proper error logging (Sentry, LogRocket)
- [ ] Configure CORS whitelist
- [ ] Add request validation middleware
- [ ] Implement database connection pooling
- [ ] Add API versioning strategy
- [ ] Set up monitoring and alerting
- [ ] Configure HTTPS/SSL certificates
- [ ] Implement data encryption at rest
- [ ] Add audit logging for HIPAA compliance
- [ ] Set up backup and disaster recovery

---

## Demo Mode

When `DEMO_MODE=true`:
- All APIs return mock data
- No database persistence (in-memory)
- Authentication bypassed
- OCR uses pattern-based mock extraction
- Clinical questions use simple regex

---

## Integration Examples

### Frontend Integration (React/TypeScript)

```typescript
// Symptom extraction
const extractSymptoms = async (complaint: string) => {
  const response = await fetch('/api/clinical/extract-symptoms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaint }),
  });
  return response.json();
};

// Red flag detection
const checkRedFlags = async (data: {
  chiefComplaint: string;
  symptoms: string[];
  clinicalAnswers: Record<string, any>;
}) => {
  const response = await fetch('/api/clinical/detect-red-flags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// Document upload
const uploadDocument = async (file: File, documentType: string) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('documentType', documentType);
  
  const response = await fetch('/api/documents/upload', {
    method: 'POST',
    body: formData,
  });
  return response.json();
};
```

---

## Support & Contact
- GitHub Issues: [Project Repository]
- Email: support@medikiosk.demo
- Documentation: `/api`
