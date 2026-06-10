const { queryFoundry } = require('../services/foundryService');
const { translateToEnglish, translateFromEnglish } = require('../services/translatorService');
const { analyzeImage } = require('../services/visionService');

function detectLanguage(text) {
  if (/[\u0600-\u06FF]/.test(text)) return 'ur';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}

async function assess(req, res) {
  try {
    let { message, language = 'en', inputType = 'text' } = req.body;

    let userMessage = message;

    // Step 1 — If image, analyze it to get text description
    if (inputType === 'image') {
      if (!req.file) {
        return res.status(400).json({ error: 'No image provided.' });
      }
      userMessage = await analyzeImage(req.file.buffer);
    }

    // Step 2 — Auto-detect language from script if user typed in Hindi/Urdu
    if (inputType === 'text' && language === 'en') {
      const detected = detectLanguage(userMessage);
      if (detected !== 'en') language = detected;
    }

    // Step 3 — Translate input TO English for better reasoning
    const englishMessage = await translateToEnglish(userMessage, language);
    console.log('English message:', englishMessage);

    // EMERGENCY PRE-CHECK — if clearly emergency, return deterministic protocol
    const emergencyRegex = /\b(choking|not breathing|no breathing|no pulse|heavy bleeding|unconscious|seizure|cardiac arrest|heart attack|anaphylaxis|severe burn|stroke|fainting)\b/i;

    if (emergencyRegex.test(englishMessage)) {
      console.log('Emergency detected by regex');
      
      const protocol = (function() {
        if (/choking|no breathing|not breathing/i.test(englishMessage)) {
          return {
            urgency: 'high',
            emergency: true,
            actions: [
              'Call emergency services immediately',
              'If conscious and cannot cough or speak, give 5 firm back blows between shoulder blades',
              'If back blows fail, perform Heimlich (abdominal thrusts); if becomes unresponsive, start CPR'
            ],
            warnings: ['Do not perform blind finger sweeps. Begin CPR if unresponsive.'],
            meds: [],
            note: 'Follow immediately until help arrives.'
          };
        }
        if (/heavy bleeding|bleeding/i.test(englishMessage)) {
          return {
            urgency: 'high',
            emergency: true,
            actions: [
              'Call emergency services immediately',
              'Apply firm direct pressure with clean cloth',
              'Elevate limb if no fracture suspected and continue pressure until help arrives'
            ],
            warnings: ['If bleeding soaks through cloth, add more layers; do not remove.'],
            meds: [],
            note: 'Control bleeding first, seek immediate help.'
          };
        }
        if (/unconscious|unresponsive/i.test(englishMessage)) {
          return {
            urgency: 'high',
            emergency: true,
            actions: [
              'Call emergency services immediately',
              'Place in recovery position (on side) to keep airway open',
              'Check for breathing and pulse; start CPR if not breathing'
            ],
            warnings: ['Monitor breathing. Start CPR if breathing stops.'],
            meds: [],
            note: 'Position for recovery; CPR if needed until help arrives.'
          };
        }
        // Default high emergency
        return {
          urgency: 'high',
          emergency: true,
          actions: [
            'Call emergency services immediately',
            'Begin basic life support if trained',
            'Keep the person calm and still'
          ],
          warnings: ['Start CPR if person becomes unresponsive and not breathing.'],
          meds: [],
          note: 'These are immediate actions until help arrives.'
        };
      })();

      // Translate protocol back to user language
      let final = protocol;
      if (language !== 'en') {
        const translatedActions = [];
        for (const a of protocol.actions) {
          translatedActions.push(await translateFromEnglish(a, language));
        }
        const translatedWarnings = [];
        for (const w of protocol.warnings) {
          translatedWarnings.push(await translateFromEnglish(w, language));
        }
        const translatedNote = await translateFromEnglish(protocol.note, language);
        final = { ...protocol, actions: translatedActions, warnings: translatedWarnings, note: translatedNote };
      }

      return res.json({ success: true, guidance: final, language });
    }

    // Step 4 — Get guidance from Foundry (returns structured object now)
    const guidanceObj = await queryFoundry(englishMessage);
    console.log('Guidance object received:', guidanceObj.urgency, 'emergency:', guidanceObj.emergency);

    // Step 5 — Translate response BACK to user's language if needed
    let final = guidanceObj;
    if (language !== 'en') {
      const translatedActions = [];
      for (const a of guidanceObj.actions || []) {
        translatedActions.push(await translateFromEnglish(a, language));
      }
      const translatedWarnings = [];
      for (const w of guidanceObj.warnings || []) {
        translatedWarnings.push(await translateFromEnglish(w, language));
      }
      const translatedMeds = [];
      for (const m of guidanceObj.meds || []) {
        translatedMeds.push(await translateFromEnglish(m, language));
      }
      const translatedNote = guidanceObj.note ? await translateFromEnglish(guidanceObj.note, language) : '';
      
      final = { 
        ...guidanceObj, 
        actions: translatedActions, 
        warnings: translatedWarnings, 
        meds: translatedMeds,
        note: translatedNote 
      };
    }

    res.json({ success: true, guidance: final, language });

  } catch (error) {
    console.error('Assess error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { assess };