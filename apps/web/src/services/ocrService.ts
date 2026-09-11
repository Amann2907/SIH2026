// OCR Processing Service
// Handles document text extraction and clinical entity recognition

export interface OcrResult {
  text: string;
  confidence: number;
  boundingBoxes?: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface ClinicalEntity {
  type: 'diagnosis' | 'medication' | 'lab_value' | 'dosage' | 'doctor_name' | 'date';
  value: string;
  confidence: number;
  position?: { start: number; end: number };
}

export interface ExtractedClinicalData {
  diagnosis: string[];
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;
  labValues: Array<{
    test: string;
    value: string;
    unit?: string;
    status?: 'normal' | 'high' | 'low';
  }>;
  doctorName?: string;
  prescriptionDate?: string;
  patientName?: string;
}

class OcrService {
  /**
   * Process an image or PDF file to extract text (OCR)
   * In production, this would call a real OCR API like Tesseract.js, Google Vision, AWS Textract, etc.
   */
  async processDocument(file: File): Promise<OcrResult> {
    // Simulate OCR processing delay
    await this.delay(1500);

    // Mock OCR based on file type
    const mockText = this.generateMockOcrText(file.name);
    
    return {
      text: mockText,
      confidence: Math.random() * 10 + 90, // 90-100%
    };
  }

  /**
   * Extract clinical entities from OCR text
   * In production, this would use NLP/AI models for medical entity recognition
   */
  extractClinicalEntities(ocrText: string): ClinicalEntity[] {
    const entities: ClinicalEntity[] = [];

    // Diagnosis patterns
    const diagnosisPatterns = [
      /(?:diagnosis|dx|impression|assessment):\s*([^\n]+)/gi,
      /type\s+2\s+diabetes\s+mellitus/gi,
      /hypertension|htn/gi,
      /coronary\s+artery\s+disease|cad/gi,
      /chronic\s+kidney\s+disease|ckd/gi,
      /asthma|copd/gi,
    ];

    for (const pattern of diagnosisPatterns) {
      const matches = ocrText.matchAll(pattern);
      for (const match of matches) {
        entities.push({
          type: 'diagnosis',
          value: match[1] || match[0],
          confidence: 0.85,
          position: { start: match.index || 0, end: (match.index || 0) + match[0].length },
        });
      }
    }

    // Medication patterns
    const medicationPatterns = [
      /(?:tab|tablet|cap|capsule|inj|injection|syrup)\s+([a-z]+(?:\s+[a-z]+)?)\s+(\d+\s*(?:mg|ml|mcg))/gi,
      /metformin|glimepiride|insulin|amlodipine|atenolol|aspirin|ecosprin|atorvastatin|rosuvastatin/gi,
    ];

    for (const pattern of medicationPatterns) {
      const matches = ocrText.matchAll(pattern);
      for (const match of matches) {
        entities.push({
          type: 'medication',
          value: match[0],
          confidence: 0.9,
          position: { start: match.index || 0, end: (match.index || 0) + match[0].length },
        });
      }
    }

    // Lab value patterns
    const labPatterns = [
      /(?:fasting\s+)?blood\s+sugar|fbs|ppbs|rbs/gi,
      /hba1c|glycosylated\s+hemoglobin/gi,
      /cholesterol|ldl|hdl|triglycerides/gi,
      /creatinine|urea|bun/gi,
      /hemoglobin|hb|rbc|wbc/gi,
    ];

    for (const pattern of labPatterns) {
      const matches = ocrText.matchAll(pattern);
      for (const match of matches) {
        // Try to find associated value
        const valueMatch = ocrText.slice((match.index || 0), (match.index || 0) + 100).match(/(\d+\.?\d*)\s*(mg\/dl|mmol\/l|g\/dl|%)/i);
        entities.push({
          type: 'lab_value',
          value: valueMatch ? `${match[0]}: ${valueMatch[0]}` : match[0],
          confidence: 0.85,
          position: { start: match.index || 0, end: (match.index || 0) + match[0].length },
        });
      }
    }

    // Doctor name patterns
    const doctorPattern = /(?:dr\.?|doctor)\s+([a-z]+(?:\s+[a-z]+){0,2})/gi;
    const doctorMatches = ocrText.matchAll(doctorPattern);
    for (const match of doctorMatches) {
      entities.push({
        type: 'doctor_name',
        value: match[0],
        confidence: 0.8,
        position: { start: match.index || 0, end: (match.index || 0) + match[0].length },
      });
    }

    return entities;
  }

  /**
   * Structure extracted entities into organized clinical data
   */
  structureClinicalData(entities: ClinicalEntity[], ocrText: string): ExtractedClinicalData {
    const data: ExtractedClinicalData = {
      diagnosis: [],
      medications: [],
      labValues: [],
    };

    // Extract unique diagnoses
    const diagnoses = entities.filter(e => e.type === 'diagnosis');
    data.diagnosis = [...new Set(diagnoses.map(d => this.cleanText(d.value)))];

    // Extract medications with dosage
    const medications = entities.filter(e => e.type === 'medication');
    for (const med of medications) {
      const medText = this.cleanText(med.value);
      const dosageMatch = medText.match(/(\d+\s*(?:mg|ml|mcg))/i);
      const frequencyMatch = ocrText.match(/(?:od|bd|tid|qid|sos|prn|once|twice|thrice)/gi);
      
      data.medications.push({
        name: medText.replace(/(\d+\s*(?:mg|ml|mcg)).*$/i, '').trim(),
        dosage: dosageMatch ? dosageMatch[0] : undefined,
        frequency: frequencyMatch ? frequencyMatch[0] : undefined,
      });
    }

    // Extract lab values
    const labValues = entities.filter(e => e.type === 'lab_value');
    for (const lab of labValues) {
      const labText = this.cleanText(lab.value);
      const [test, valueStr] = labText.split(':').map(s => s.trim());
      const valueMatch = valueStr?.match(/(\d+\.?\d*)\s*(mg\/dl|mmol\/l|g\/dl|%)/i);
      
      if (valueMatch) {
        const numValue = parseFloat(valueMatch[1]);
        let status: 'normal' | 'high' | 'low' = 'normal';
        
        // Simple heuristics for status (in production, use reference ranges)
        if (test.toLowerCase().includes('sugar') || test.toLowerCase().includes('glucose')) {
          if (numValue > 140) status = 'high';
          else if (numValue < 70) status = 'low';
        } else if (test.toLowerCase().includes('hba1c')) {
          if (numValue > 6.5) status = 'high';
        }
        
        data.labValues.push({
          test,
          value: valueMatch[1],
          unit: valueMatch[2],
          status,
        });
      }
    }

    // Extract doctor name
    const doctor = entities.find(e => e.type === 'doctor_name');
    if (doctor) {
      data.doctorName = this.cleanText(doctor.value);
    }

    return data;
  }

  /**
   * Complete OCR pipeline: document → text → entities → structured data
   */
  async processClinicalDocument(file: File): Promise<{
    ocr: OcrResult;
    entities: ClinicalEntity[];
    structuredData: ExtractedClinicalData;
  }> {
    // Step 1: OCR text extraction
    const ocrResult = await this.processDocument(file);

    // Step 2: Entity extraction
    const entities = this.extractClinicalEntities(ocrResult.text);

    // Step 3: Structure data
    const structuredData = this.structureClinicalData(entities, ocrResult.text);

    return {
      ocr: ocrResult,
      entities,
      structuredData,
    };
  }

  /**
   * Generate mock OCR text based on document type
   */
  private generateMockOcrText(filename: string): string {
    const lower = filename.toLowerCase();
    
    if (lower.includes('prescription') || lower.includes('rx')) {
      return `Dr. Ramesh Kumar Sharma, MD
Apollo Hospital, New Delhi
Date: ${new Date().toLocaleDateString()}

Patient: Ramesh Kumar
Age: 56 Years | Gender: Male

Diagnosis: Type 2 Diabetes Mellitus, Hypertension

Medications:
1. Tab Metformin 500mg - OD (After breakfast)
2. Tab Glimepiride 2mg - OD (Before breakfast)
3. Tab Amlodipine 5mg - OD (Morning)
4. Tab Ecosprin 75mg - OD (After dinner)

Follow-up: 2 weeks

Dr. Ramesh Kumar Sharma
Reg. No: 12345`;
    } else if (lower.includes('lab') || lower.includes('test') || lower.includes('report')) {
      return `Clinical Laboratory Report
Sample Collection Date: ${new Date().toLocaleDateString()}

Patient Name: Ramesh Kumar
Age: 56 Years | Gender: Male

BLOOD GLUCOSE PROFILE:
Fasting Blood Sugar: 168 mg/dL (High) [Normal: 70-100]
HbA1c: 7.8% (High) [Normal: <5.7%]

LIPID PROFILE:
Total Cholesterol: 220 mg/dL (Borderline High)
LDL Cholesterol: 145 mg/dL (High)
HDL Cholesterol: 38 mg/dL (Low)
Triglycerides: 185 mg/dL (Borderline High)

RENAL FUNCTION:
Serum Creatinine: 1.1 mg/dL (Normal)
Blood Urea: 32 mg/dL (Normal)

Verified by: Dr. Sharma, Pathologist`;
    } else {
      return `Medical Document
Patient Name: Ramesh Kumar
Date: ${new Date().toLocaleDateString()}

Clinical Notes:
Type 2 Diabetes Mellitus - under treatment
Blood pressure: 140/90 mmHg

Current Medications:
- Metformin 500mg
- Amlodipine 5mg

Dr. R.K. Sharma`;
    }
  }

  private cleanText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const ocrService = new OcrService();
