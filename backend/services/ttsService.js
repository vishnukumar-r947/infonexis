// TTS Service - Uses browser-native TTS or Google TTS API
// Browser-side TTS is handled in the frontend. This backend service is for server-side audio generation.

async function synthesizeSpeech(text, language = 'en-US', rate = 1.0) {
  const provider = process.env.TTS_PROVIDER || 'browser';
  
  if (provider === 'browser') {
    // Return metadata - frontend handles actual TTS via Web Speech API
    return {
      provider: 'browser-native',
      text: text.substring(0, 5000),
      language,
      rate,
      note: 'Audio generated client-side using Web Speech API. Configure TTS_PROVIDER=google for server-side TTS.',
      generatedAt: new Date().toISOString()
    };
  }
  
  // Placeholder for Google Cloud TTS or other providers
  return {
    provider,
    text: text.substring(0, 5000),
    language,
    rate,
    note: 'Configure Google Cloud TTS credentials to enable server-side audio generation.',
    generatedAt: new Date().toISOString()
  };
}

module.exports = { synthesizeSpeech };
