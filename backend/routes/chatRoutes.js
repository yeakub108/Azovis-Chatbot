/**
 * Chat Routes
 * Defines API endpoints for chatbot operations
 */

import express from 'express';
import chatController from '../controllers/chatController.js';

const router = express.Router();

/**
 * @route   POST /api/chat
 * @desc    Send a message to the chatbot
 * @access  Public
 * @body    { message: string, sessionId?: string }
 * @returns { success: boolean, data: { message: string, sessionId: string, tokensUsed: number } }
 */
router.post('/chat', (req, res) => chatController.sendMessage(req, res));

/**
 * @route   POST /api/chat/reset
 * @desc    Reset conversation history for a session
 * @access  Public
 * @body    { sessionId?: string }
 * @returns { success: boolean, data: { message: string, sessionId: string } }
 */
router.post('/chat/reset', (req, res) => chatController.resetConversation(req, res));

/**
 * @route   GET /api/chat/stats/:sessionId?
 * @desc    Get conversation statistics for a session
 * @access  Public
 * @returns { success: boolean, data: { sessionId: string, messageCount: number, messages: array } }
 */
router.get('/chat/stats/:sessionId?', (req, res) => chatController.getStats(req, res));

export default router;
