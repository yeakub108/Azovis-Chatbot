/**
 * OpenAI Configuration Module
 * Centralizes all OpenAI client settings
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required in environment variables');
}

// Create and configure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chatbot configuration
const chatConfig = {
  model: process.env.MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.MAX_TOKENS) || 1000,
  temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
};

export { openai, chatConfig };
