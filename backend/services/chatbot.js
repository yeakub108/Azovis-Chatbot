/**
 * Chatbot Service
 * Core service for handling AI chat interactions
 */

import { openai, chatConfig } from '../config/openai.js';
import conversationHistory from './conversationHistory.js';
import logger from '../utils/logger.js';

class ChatbotService {
  /**
   * Send message to OpenAI and get response
   */
  async chat(message, sessionId = 'default') {
    try {
      // Add user message to history
      conversationHistory.addMessage(sessionId, 'user', message);

      // Prepare messages with system prompt and history
      const messages = conversationHistory.prepareMessages(sessionId);

      logger.info('Sending request to OpenAI', { sessionId, messageLength: message.length });

      // Call OpenAI API for main response
      const completion = await openai.chat.completions.create({
        model: chatConfig.model,
        messages: messages,
        max_tokens: chatConfig.maxTokens,
        temperature: chatConfig.temperature,
      });

      // Extract assistant response
      const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      // Add assistant response to history
      conversationHistory.addMessage(sessionId, 'assistant', assistantMessage);

      // Generate related questions
      const relatedQuestions = await this.generateRelatedQuestions(message, assistantMessage);

      logger.info('Received response from OpenAI', {
        sessionId,
        tokensUsed: completion.usage?.total_tokens
      });

      return {
        success: true,
        message: assistantMessage,
        sessionId: sessionId,
        model: chatConfig.model,
        tokensUsed: completion.usage?.total_tokens,
        relatedQuestions: relatedQuestions,
      };

    } catch (error) {
      logger.error('Error in chat service', error);

      return {
        success: false,
        error: this.handleError(error),
        sessionId: sessionId,
      };
    }
  }

  /**
   * Generate related questions based on user query and AI response
   */
  async generateRelatedQuestions(userQuery, aiResponse) {
    try {
      const prompt = [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates 3 relevant follow-up questions based on the user\'s question and the AI\'s response. Return ONLY a JSON array of 3 short, clear questions. No explanation, just the JSON array.'
        },
        {
          role: 'user',
          content: `User Question: "${userQuery}"\n\nAI Response: "${aiResponse.substring(0, 500)}"\n\nGenerate 3 relevant follow-up questions the user might want to ask. Return ONLY a JSON array of question strings.`
        }
      ];

      const completion = await openai.chat.completions.create({
        model: chatConfig.model,
        messages: prompt,
        max_tokens: 200,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || '[]';
      const questions = JSON.parse(response);

      return Array.isArray(questions) ? questions.slice(0, 3) : [];
    } catch (error) {
      logger.error('Error generating related questions', error);
      return [];
    }
  }

  /**
   * Handle and format errors
   */
  handleError(error) {
    if (error.response) {
      // OpenAI API error
      return {
        type: 'API_ERROR',
        message: error.response.data?.error?.message || 'OpenAI API error',
        status: error.response.status,
      };
    } else if (error.code === 'insufficient_quota') {
      return {
        type: 'QUOTA_EXCEEDED',
        message: 'API quota exceeded. Please check your OpenAI account.',
      };
    } else if (error.code === 'invalid_api_key') {
      return {
        type: 'INVALID_API_KEY',
        message: 'Invalid API key. Please check your OPENAI_API_KEY.',
      };
    } else {
      // General error
      return {
        type: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  /**
   * Clear conversation history for a session
   */
  resetConversation(sessionId = 'default') {
    conversationHistory.clearHistory(sessionId);
    logger.info('Conversation history cleared', { sessionId });
    return {
      success: true,
      message: 'Conversation history cleared',
      sessionId: sessionId,
    };
  }

  /**
   * Get conversation statistics
   */
  getConversationStats(sessionId = 'default') {
    const history = conversationHistory.getHistory(sessionId);
    return {
      sessionId: sessionId,
      messageCount: history.length,
      messages: history,
    };
  }
}

export default new ChatbotService();
