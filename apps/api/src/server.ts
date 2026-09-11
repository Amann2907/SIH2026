import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/app';
import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for Vite in dev
}));
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      demoMode: config.DEMO_MODE,
    },
  });
});

// In-memory store fallback for demo mode encounters
const demoEncounters: any[] = [
  {
    id: 'ENC-10428',
    patientName: 'Ramesh Kumar Sharma',
    patientId: 'MK-10428',
    language: 'Hindi',
    mode: 'voice',
    chiefComplaint: 'कल शाम से सीने में भारीपन और हल्का दर्द महसूस हो रहा है।',
    painSeverity: 6,
    status: 'IN_QUEUE',
    tokenNumber: '#04',
    createdAt: new Date().toISOString(),
  },
];

// Encounters API
app.get('/api/encounters', (_req, res) => {
  res.json({
    success: true,
    data: demoEncounters,
  });
});

app.post('/api/encounters', (req, res) => {
  const newEncounter = {
    id: req.body.encounterId || 'ENC-' + Date.now(),
    patientName: req.body.patientName || 'Ramesh Kumar Sharma',
    patientId: req.body.patientId || 'CUREX-10428',
    language: req.body.language || 'Hindi',
    mode: req.body.mode || 'voice',
    chiefComplaint: req.body.chiefComplaint || '',
    painSeverity: req.body.painSeverity || 5,
    documents: req.body.documents || [],
    status: 'IN_QUEUE',
    tokenNumber: '#04',
    createdAt: new Date().toISOString(),
  };
  demoEncounters.unshift(newEncounter);
  res.status(201).json({
    success: true,
    data: newEncounter,
  });
});

// API Root
app.get('/api', (_req, res) => {
  res.json({
    success: true,
    message: 'MediKiosk API Server',
    version: '1.0.0',
    demoMode: config.DEMO_MODE,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      patients: '/api/patients',
      encounters: '/api/encounters',
      documents: '/api/documents',
      clinical: {
        extractSymptoms: '/api/clinical/extract-symptoms',
        nextQuestions: '/api/clinical/next-questions',
        detectRedFlags: '/api/clinical/detect-red-flags',
      },
      ocr: {
        upload: '/api/documents/upload',
        process: '/api/ocr/process',
      },
    },
    documentation: 'See API_DOCUMENTATION.md for detailed API reference',
  });
});

// Serve static files from the React app
if (config.NODE_ENV === 'production') {
  // In production, serve the built React app
  const frontendPath = path.join(__dirname, '../../web/dist');
  logger.info(`Serving static files from: ${frontendPath}`);
  app.use(express.static(frontendPath));
  
  // Handle React routing - send all non-API routes to index.html
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      next();
    }
  });
}

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectDatabase();
    
    const port = parseInt(config.PORT);
    app.listen(port, () => {
      logger.info('='.repeat(60));
      logger.info('🏥 MediKiosk Clinical Intake Platform');
      logger.info('='.repeat(60));
      logger.info(`🚀 Application URL: http://localhost:${port}`);
      logger.info(`📋 Environment: ${config.NODE_ENV}`);
      logger.info(`🎭 Demo Mode: ${config.DEMO_MODE ? 'ON' : 'OFF'}`);
      logger.info(`📖 API Docs: http://localhost:${port}/api`);
      logger.info(`✅ Health Check: http://localhost:${port}/api/health`);
      if (config.NODE_ENV === 'production') {
        logger.info(`🎨 Frontend: http://localhost:${port}`);
        logger.info('   (Serving built React app)');
      } else {
        logger.info(`⚠️  Development: Run frontend separately on port 5173`);
        logger.info('   Or build frontend: npm run build --workspace=apps/web');
      }
      logger.info('='.repeat(60));
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();

// Clinical Questions API
app.post('/api/clinical/extract-symptoms', (req, res) => {
  const { complaint } = req.body;
  
  if (!complaint) {
    return res.status(400).json({
      success: false,
      error: { message: 'Chief complaint is required' },
    });
  }

  const symptoms: any[] = [];
  const categories: string[] = [];

  if (/सीने.*दर्द|chest.*pain|सीने.*भारीपन/i.test(complaint)) {
    symptoms.push({ name: 'CHEST_PAIN', confidence: 0.9 });
    categories.push('CHEST_PAIN');
  }
  if (/बुखार|fever/i.test(complaint)) {
    symptoms.push({ name: 'FEVER', confidence: 0.9 });
    categories.push('FEVER');
  }
  if (/पेट.*दर्द|stomach.*pain|abdominal.*pain/i.test(complaint)) {
    symptoms.push({ name: 'ABDOMINAL_PAIN', confidence: 0.9 });
    categories.push('ABDOMINAL_PAIN');
  }
  if (/सिर.*दर्द|headache/i.test(complaint)) {
    symptoms.push({ name: 'HEADACHE', confidence: 0.9 });
    categories.push('HEADACHE');
  }

  return res.json({
    success: true,
    data: {
      symptoms,
      primaryCategory: categories[0] || 'GENERAL',
      categories,
    },
  });
});

app.post('/api/clinical/next-questions', (req, res) => {
  const { category, answeredQuestions } = req.body;
  
  const questionBank: Record<string, any[]> = {
    CHEST_PAIN: [
      { id: 'chest_pain_location', questionEn: 'Where exactly in your chest do you feel the pain?', questionHi: 'सीने में दर्द किस जगह हो रहा है?', priority: 1 },
      { id: 'chest_pain_radiation', questionEn: 'Does the pain spread to your arm, shoulder, neck, or jaw?', questionHi: 'क्या दर्द हाथ, कंधे, गर्दन या जबड़े तक जाता है?', priority: 2 },
      { id: 'chest_pain_breathing', questionEn: 'Are you having difficulty breathing?', questionHi: 'क्या सांस लेने में परेशानी हो रही है?', priority: 1 },
    ],
    FEVER: [
      { id: 'fever_duration', questionEn: 'How many days have you had fever?', questionHi: 'बुखार कितने दिन से है?', priority: 1 },
      { id: 'fever_temperature', questionEn: 'What is your highest recorded temperature?', questionHi: 'सबसे ज्यादा तापमान कितना रहा है?', priority: 1 },
    ],
  };

  const questions = questionBank[category] || [];
  const answered = answeredQuestions || [];
  
  const nextQuestions = questions
    .filter(q => !answered.includes(q.id))
    .slice(0, 3);

  res.json({
    success: true,
    data: { questions: nextQuestions, category },
  });
});

// Red Flag Detection API
app.post('/api/clinical/detect-red-flags', (req, res) => {
  const { chiefComplaint, symptoms, clinicalAnswers } = req.body;
  
  if (!chiefComplaint) {
    return res.status(400).json({
      success: false,
      error: { message: 'Chief complaint is required' },
    });
  }

  const redFlags: any[] = [];
  let priority: 'EMERGENCY' | 'URGENT' | 'ROUTINE' = 'ROUTINE';
  
  const combined = (chiefComplaint + ' ' + (symptoms || []).join(' ')).toLowerCase();
  
  // EMERGENCY: Chest pain with breathing/sweating
  if (/सीने.*दर्द|chest.*pain/i.test(combined)) {
    if (/सांस|breath|पसीना|sweat/i.test(combined) || clinicalAnswers?.chest_pain_breathing === 'yes') {
      redFlags.push({
        id: 'chest_pain_cardiac',
        severity: 'EMERGENCY',
        category: 'CARDIAC',
        description: 'Possible cardiac emergency: Chest pain with breathing difficulty or sweating',
        descriptionHi: 'संभावित हृदय आपात स्थिति: सांस लेने में कठिनाई या पसीने के साथ सीने में दर्द',
        recommendation: 'IMMEDIATE medical attention required.',
        recommendationHi: 'तत्काल चिकित्सा ध्यान आवश्यक है।',
      });
      priority = 'EMERGENCY';
    }
    
    if (/हाथ|कंधे|जबड़े|arm|shoulder|jaw/i.test(combined) || clinicalAnswers?.chest_pain_radiation === 'yes') {
      redFlags.push({
        id: 'chest_pain_radiating',
        severity: 'EMERGENCY',
        category: 'CARDIAC',
        description: 'Possible cardiac emergency: Radiating chest pain',
        descriptionHi: 'संभावित हृदय आपात स्थिति: फैलने वाला सीने में दर्द',
        recommendation: 'IMMEDIATE medical attention required.',
        recommendationHi: 'तत्काल चिकित्सा ध्यान आवश्यक है।',
      });
      priority = 'EMERGENCY';
    }
  }
  
  // EMERGENCY: Severe sudden headache
  if (/अचानक.*सिरदर्द|sudden.*headache|worst.*headache/i.test(combined)) {
    redFlags.push({
      id: 'severe_headache_sudden',
      severity: 'EMERGENCY',
      category: 'NEUROLOGICAL',
      description: 'Sudden severe headache - possible stroke',
      descriptionHi: 'अचानक गंभीर सिरदर्द - संभावित स्ट्रोक',
      recommendation: 'IMMEDIATE emergency care required.',
      recommendationHi: 'तुरंत आपातकालीन देखभाल आवश्यक है।',
    });
    priority = 'EMERGENCY';
  }
  
  // URGENT: High fever
  const temp = parseFloat(clinicalAnswers?.fever_temperature);
  if (!isNaN(temp) && temp >= 103) {
    redFlags.push({
      id: 'high_fever',
      severity: 'URGENT',
      category: 'INFECTION',
      description: `Very high fever (${temp}°F)`,
      descriptionHi: `बहुत तेज बुखार (${temp}°F)`,
      recommendation: 'URGENT medical attention needed.',
      recommendationHi: 'तत्काल चिकित्सा ध्यान आवश्यक है।',
    });
    if (priority === 'ROUTINE') priority = 'URGENT';
  }
  
  // URGENT: Coughing blood
  if (/खून.*खांसी|cough.*blood/i.test(combined) || clinicalAnswers?.cough_blood === 'yes') {
    redFlags.push({
      id: 'coughing_blood',
      severity: 'URGENT',
      category: 'RESPIRATORY',
      description: 'Coughing up blood',
      descriptionHi: 'खांसी में खून आना',
      recommendation: 'URGENT medical evaluation needed.',
      recommendationHi: 'तत्काल चिकित्सा मूल्यांकन आवश्यक है।',
    });
    if (priority === 'ROUTINE') priority = 'URGENT';
  }
  
  // Determine triage
  const requiresImmediateAttention = priority !== 'ROUTINE';
  let estimatedWaitTime = '30-60 minutes';
  let recommendedAction = 'Please wait for your turn. A doctor will see you soon.';
  let recommendedActionHi = 'कृपया अपनी बारी का इंतजार करें। एक डॉक्टर जल्द ही आपको देखेगा।';
  
  if (priority === 'EMERGENCY') {
    estimatedWaitTime = 'IMMEDIATE';
    recommendedAction = 'EMERGENCY: You will be seen immediately.';
    recommendedActionHi = 'आपातकाल: आपको तुरंत देखा जाएगा।';
  } else if (priority === 'URGENT') {
    estimatedWaitTime = '10-15 minutes';
    recommendedAction = 'URGENT: You will be prioritized.';
    recommendedActionHi = 'जरूरी: आपको प्राथमिकता दी जाएगी।';
  }
  
  return res.json({
    success: true,
    data: {
      priority,
      redFlags,
      requiresImmediateAttention,
      estimatedWaitTime,
      recommendedAction,
      recommendedActionHi,
    },
  });
});

// OCR and Document Processing API
app.post('/api/documents/upload', (req, res) => {
  // In production, use multer or similar for file upload handling
  // For now, return mock response
  const mockOcrResult = {
    success: true,
    data: {
      documentId: `DOC-${Date.now()}`,
      ocrScore: Math.floor(Math.random() * 10) + 90,
      extractedText: 'Dr. Ramesh Kumar Sharma, MD\nDiagnosis: Type 2 Diabetes Mellitus\nTab Metformin 500mg - OD',
      entities: [
        { type: 'diagnosis', value: 'Type 2 Diabetes Mellitus', confidence: 0.95 },
        { type: 'medication', value: 'Metformin 500mg', confidence: 0.92 },
      ],
      structuredData: {
        diagnosis: ['Type 2 Diabetes Mellitus'],
        medications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'OD' },
        ],
        labValues: [],
      },
    },
  };
  
  res.json(mockOcrResult);
});

app.post('/api/ocr/process', (req, res) => {
  const { documentType, fileName } = req.body;
  
  // Mock OCR processing based on document type
  let extractedData: any = {
    diagnosis: [],
    medications: [],
    labValues: [],
  };
  
  if (documentType?.includes('Prescription') || fileName?.includes('prescription')) {
    extractedData = {
      diagnosis: ['Type 2 Diabetes Mellitus', 'Hypertension'],
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'OD' },
        { name: 'Amlodipine', dosage: '5mg', frequency: 'OD' },
        { name: 'Ecosprin', dosage: '75mg', frequency: 'OD' },
      ],
      labValues: [],
      doctorName: 'Dr. Ramesh Kumar Sharma',
    };
  } else if (documentType?.includes('Lab') || fileName?.includes('lab')) {
    extractedData = {
      diagnosis: [],
      medications: [],
      labValues: [
        { test: 'Fasting Blood Sugar', value: '168', unit: 'mg/dL', status: 'high' },
        { test: 'HbA1c', value: '7.8', unit: '%', status: 'high' },
        { test: 'Total Cholesterol', value: '220', unit: 'mg/dL', status: 'high' },
      ],
    };
  } else {
    extractedData = {
      diagnosis: ['Type 2 Diabetes Mellitus'],
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'OD' },
      ],
      labValues: [
        { test: 'Fasting Blood Sugar', value: '168', unit: 'mg/dL', status: 'high' },
      ],
    };
  }
  
  res.json({
    success: true,
    data: {
      ocrScore: Math.floor(Math.random() * 10) + 90,
      extractedText: 'Mock OCR extracted text...',
      structuredData: extractedData,
    },
  });
});
