// Speech-to-Text Service with Browser Web Speech API
// Supports Hindi, English, and Hinglish

export type SpeechLanguage = 'hi-IN' | 'en-IN' | 'en-US' | 'bn-IN' | 'mr-IN' | 'ta-IN' | 'te-IN' | 'gu-IN' | 'kn-IN';

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionError {
  error: 'no-speech' | 'audio-capture' | 'not-allowed' | 'network' | 'aborted' | 'not-supported' | 'unknown';
  message: string;
}

type SpeechRecognitionCallback = (result: SpeechRecognitionResult) => void;
type SpeechErrorCallback = (error: SpeechRecognitionError) => void;

class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private language: SpeechLanguage = 'hi-IN';
  private onResultCallback: SpeechRecognitionCallback | null = null;
  private onErrorCallback: SpeechErrorCallback | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false; // Stop after one phrase
    this.recognition.interimResults = true; // Show interim results
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const result = event.results[last];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.95;
      const isFinal = result.isFinal;

      if (this.onResultCallback) {
        this.onResultCallback({
          transcript,
          confidence,
          isFinal,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      
      const errorMap: Record<string, SpeechRecognitionError> = {
        'no-speech': {
          error: 'no-speech',
          message: 'कोई आवाज़ नहीं सुनाई दी। कृपया फिर से बोलें। / No speech detected. Please speak again.',
        },
        'audio-capture': {
          error: 'audio-capture',
          message: 'माइक्रोफोन से कनेक्ट नहीं हो पाया। / Could not access microphone.',
        },
        'not-allowed': {
          error: 'not-allowed',
          message: 'माइक्रोफोन की अनुमति नहीं दी गई। / Microphone permission denied.',
        },
        'network': {
          error: 'network',
          message: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें। / Network error. Please try again.',
        },
        'aborted': {
          error: 'aborted',
          message: 'रिकॉर्डिंग रद्द कर दी गई। / Recording cancelled.',
        },
      };

      const errorResult = errorMap[event.error] || {
        error: 'unknown',
        message: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें। / Something went wrong. Please try again.',
      };

      if (this.onErrorCallback) {
        this.onErrorCallback(errorResult);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public setLanguage(lang: SpeechLanguage) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(
    onResult: SpeechRecognitionCallback,
    onError: SpeechErrorCallback,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      onError({
        error: 'not-supported',
        message: 'आपका ब्राउज़र वॉइस रिकग्निशन सपोर्ट नहीं करता। / Speech recognition not supported in your browser.',
      });
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd || null;

    try {
      this.recognition.lang = this.language;
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error: any) {
      onError({
        error: 'unknown',
        message: 'रिकॉर्डिंग शुरू नहीं हो पाई। / Could not start recording.',
      });
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public abort() {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Singleton instance
export const speechService = new SpeechRecognitionService();

// Language mapping helper
export function mapLanguageToSpeechLang(language: string): SpeechLanguage {
  const mapping: Record<string, SpeechLanguage> = {
    'Hindi': 'hi-IN',
    'English': 'en-IN',
    'Bengali': 'bn-IN',
    'Marathi': 'mr-IN',
    'Tamil': 'ta-IN',
    'Telugu': 'te-IN',
    'Gujarati': 'gu-IN',
    'Kannada': 'kn-IN',
  };
  return mapping[language] || 'hi-IN';
}
