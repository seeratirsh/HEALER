const axios = require('axios');

async function translateToEnglish(text, fromLanguage) {
  if (fromLanguage === 'en') return text;
  try {
    const response = await axios.post(
      `${process.env.TRANSLATOR_ENDPOINT}/translate`,
      [{ text }],
      {
        params: { 'api-version': '3.0', from: fromLanguage, to: 'en' },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.TRANSLATOR_KEY,
          'Ocp-Apim-Subscription-Region': process.env.TRANSLATOR_REGION,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Translator (to English) error:', error.message);
    return text;
  }
}

async function translateFromEnglish(text, toLanguage) {
  if (toLanguage === 'en') return text;
  try {
    const response = await axios.post(
      `${process.env.TRANSLATOR_ENDPOINT}/translate`,
      [{ text }],
      {
        params: { 'api-version': '3.0', from: 'en', to: toLanguage },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.TRANSLATOR_KEY,
          'Ocp-Apim-Subscription-Region': process.env.TRANSLATOR_REGION,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Translator (from English) error:', error.message);
    return text;
  }
}

module.exports = { translateToEnglish, translateFromEnglish };