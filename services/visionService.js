const axios = require('axios');

// Analyzes uploaded image (wound, injury scene) and returns a text description
// That description is then passed to Foundry as the user's "message"

async function analyzeImage(imageBuffer) {
  try {
    const response = await axios.post(
      `${process.env.VISION_ENDPOINT}computervision/imageanalysis:analyze`,
      imageBuffer,
      {
        params: {
          'api-version': '2023-02-01-preview',
          features: 'caption,tags',
          language: 'en'
        },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.VISION_KEY,
          'Content-Type': 'application/octet-stream'
        }
      }
    );

    const caption = response.data.captionResult?.text || '';
    const tags = response.data.tagsResult?.values?.map(t => t.name).join(', ') || '';

    // Build a natural language description for Foundry
    return `I can see: ${caption}. Related terms: ${tags}. What first aid should I provide?`;
  } catch (error) {
    console.error('Vision error:', error.response?.data || error.message);
    throw new Error('Could not analyze image. Please describe the situation in text.');
  }
}

module.exports = { analyzeImage };
