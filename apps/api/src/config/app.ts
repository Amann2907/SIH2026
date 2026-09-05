import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  DEMO_MODE: z.string().transform(val => val === 'true').default('true'),
  AI_PROVIDER: z.enum(['openai', 'anthropic', 'mock']).default('mock'),
  OCR_PROVIDER: z.enum(['tesseract', 'google-vision', 'mock']).default('mock'),
  SPEECH_PROVIDER: z.enum(['browser', 'bhashini', 'mock']).default('browser'),
  ABDM_PROVIDER: z.enum(['sandbox', 'production', 'mock']).default('mock'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const config = parsed.data;

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
export const isDemoMode = config.DEMO_MODE;
