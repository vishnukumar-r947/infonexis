const { processWithLLM, generateSummaryFromText } = require('../services/llmService');
const { synthesizeSpeech } = require('../services/ttsService');
const storeService = require('../services/storeService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

async function handleAIChat(req, res) {
  try {
    const { prompt, conversationId, language = 'en', documentContext } = req.body;
    if (!prompt) return errorResponse(res, 'Prompt is required', 400);

    const userId = req.user?.id;

    // Load conversation history safely via storeService
    let conversation = null;
    if (conversationId) {
      conversation = await storeService.getConversation(conversationId);
    }

    // Build context-aware system prompt
    let systemPrompt = `You are the INFONEXIS AI Assistant — an expert Information Intelligence analyst.
Your role is to help users understand, analyze, and act on their information.

Key behaviors:
- Answer based on the actual documents and context provided
- Detect conflicts, missing info, and important deadlines
- Be precise, professional, and concise
- If you don't have enough context, say so honestly
- Never fabricate information`;

    if (documentContext) {
      systemPrompt += `\n\nRelevant Document Context:\n${documentContext.substring(0, 3000)}`;
    }

    // Include conversation history in prompt
    let fullPrompt = prompt;
    if (conversation && conversation.messages?.length > 0) {
      const history = conversation.messages.slice(-6).map(m => 
        `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`
      ).join('\n');
      fullPrompt = `Conversation History:\n${history}\n\nCurrent Question: ${prompt}`;
    }

    const reply = await processWithLLM({ prompt: fullPrompt, systemPrompt, maxTokens: 1500 });

    // Save to conversation via storeService
    let savedConv = null;
    if (userId) {
      savedConv = await storeService.saveConversation(userId, conversationId, prompt, reply, language);
    }

    return successResponse(res, {
      reply,
      conversationId: savedConv?._id || savedConv?.id || conversation?._id || conversation?.id,
      timestamp: new Date().toISOString()
    }, 'AI response generated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function handleAudioSummary(req, res) {
  try {
    const { text, language, rate } = req.body;
    if (!text) return errorResponse(res, 'Summary text is required', 400);
    const audioMeta = await synthesizeSpeech(text, language || 'en-US', rate || 1.0);
    return successResponse(res, audioMeta, 'Audio summary ready');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function handleTranslate(req, res) {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) return errorResponse(res, 'Text and targetLanguage required', 400);
    const translated = await processWithLLM({
      prompt: `Translate the following text to ${targetLanguage}. Return only the translated text:\n\n${text}`,
      maxTokens: 2000
    });
    return successResponse(res, { originalText: text, targetLanguage, translatedText: translated });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function getConversationHistory(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return successResponse(res, []);
    const conversations = await storeService.getConversationsForUser(userId);
    return successResponse(res, conversations);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

module.exports = { handleAIChat, handleAudioSummary, handleTranslate, getConversationHistory };
