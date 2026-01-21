/**
 * Chat Controller
 * Handles HTTP requests for chatbot operations
 */

import chatbotService from '../services/chatbot.js';
import logger from '../utils/logger.js';

class ChatController {
  /**
   * Handle chat message request
   */
  async sendMessage(req, res) {
    try {
      const { message, sessionId } = req.body;

      // Validate request
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Message is required and must be a string',
        });
      }

      if (!message.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Message cannot be empty',
        });
      }

      // Process message through chatbot service
      const result = await chatbotService.chat(message, sessionId || 'default');

      if (result.success) {
        return res.status(200).json({
          success: true,
          data: {
            message: result.message,
            sessionId: result.sessionId,
            tokensUsed: result.tokensUsed,
          },
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      logger.error('Error in sendMessage controller', error);
      return res.status(500).json({
        success: false,
        error: {
          type: 'SERVER_ERROR',
          message: 'Internal server error',
        },
      });
    }
  }

  /**
   * Handle conversation reset request
   */
  async resetConversation(req, res) {
    try {
      const { sessionId } = req.body;
      const result = chatbotService.resetConversation(sessionId || 'default');

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in resetConversation controller', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to reset conversation',
      });
    }
  }

  /**
   * Handle conversation stats request
   */
  async getStats(req, res) {
    try {
      const { sessionId } = req.params;
      const stats = chatbotService.getConversationStats(sessionId || 'default');

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getStats controller', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve conversation stats',
      });
    }
  }
}

export default new ChatController();
