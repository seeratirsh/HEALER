const { queryFoundry } = require('../services/foundryService');
const { translateToEnglish, translateFromEnglish } = require('../services/translatorService');
const { analyzeImage } = require('../services/visionService');

function detectLanguage(text) {
  if (/[\u0600-\u06FF]/.test(text)) return 'ur';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}

 function getLocalGuidance(msg) {
  const m = msg.toLowerCase();
  
  if (/vomit|nausea|throwing up/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Sip small amounts of water or oral rehydration solution', 'Rest and avoid solid food for 1-2 hours', 'Gradually reintroduce bland foods like rice or toast'],
    warnings: ['Seek care if vomiting lasts more than 24 hours', 'Seek urgent care if there is blood in vomit'],
    meds: ['ORS solution to prevent dehydration', 'Ondansetron 4mg if prescribed by doctor'],
    note: 'Vomiting usually resolves with rest and hydration.'
  };

  if (/fever|temperature/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Drink plenty of fluids', 'Rest adequately', 'Monitor temperature regularly'],
    warnings: ['Seek care if fever exceeds 103°F (39.4°C)', 'Seek urgent care if difficulty breathing develops'],
    meds: ['Paracetamol 500mg every 4-6 hours as needed'],
    note: 'Most mild fevers resolve with hydration and rest.'
  };

  if (/headache|head pain/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Rest in a quiet, dark room', 'Drink water — dehydration is a common cause', 'Apply a cold or warm compress to forehead'],
    warnings: ['Seek urgent care if headache is sudden and severe', 'Seek care if headache is with fever and stiff neck'],
    meds: ['Paracetamol 500mg or Ibuprofen 400mg as needed'],
    note: 'Most headaches resolve with rest and hydration.'
  };

  if (/cold|flu|cough|runny nose/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Rest and stay hydrated', 'Use steam inhalation for congestion', 'Gargle with warm salt water for sore throat'],
    warnings: ['Seek care if symptoms worsen after 7 days', 'Seek urgent care if breathing becomes difficult'],
    meds: ['Paracetamol 500mg for fever or body ache', 'Cetirizine 10mg for runny nose if needed'],
    note: 'Cold and flu usually resolve within 7-10 days with rest.'
  };

  if (/stomach|abdomen|belly/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Rest and avoid heavy meals', 'Drink warm water or ginger tea', 'Apply a warm compress to the abdomen'],
    warnings: ['Seek care if pain is severe or persistent', 'Seek urgent care if pain is with fever or vomiting blood'],
    meds: ['Antacid (like Gelusil) for acidity-related pain'],
    note: 'Mild stomach aches often resolve with rest and light diet.'
  };

  if (/sore throat|throat pain/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Gargle with warm salt water 3 times a day', 'Drink warm fluids like honey and ginger tea', 'Rest your voice'],
    warnings: ['Seek care if throat pain is severe or with high fever', 'Seek care if you have difficulty swallowing'],
    meds: ['Paracetamol 500mg for pain relief', 'Strepsils lozenges for soothing'],
    note: 'Most sore throats improve within a few days.'
  };

  if (/diarrhea|loose stool|loose motion/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Drink ORS solution to replace lost fluids', 'Eat bland foods like rice, banana, and toast', 'Avoid dairy, spicy, and fatty foods'],
    warnings: ['Seek care if diarrhea lasts more than 2 days', 'Seek urgent care if there is blood in stool'],
    meds: ['ORS solution after every loose stool', 'Loperamide 2mg if needed (not for children under 12)'],
    note: 'Stay hydrated — dehydration is the main risk with diarrhea.'
  };

  if (/cut|wound|scratch/i.test(m)) return {
    urgency: 'low', emergency: false,
    actions: ['Clean the wound with clean running water', 'Apply gentle pressure with a clean cloth to stop bleeding', 'Cover with a clean bandage'],
    warnings: ['Seek care if cut is deep or edges are gaping', 'Seek care if wound shows signs of infection (redness, swelling, pus)'],
    meds: ['Apply antiseptic cream (like Betadine) after cleaning'],
    note: 'Keep the wound clean and dry to prevent infection.'
  };

  // Default fallback
  return {
    urgency: 'low', emergency: false,
    actions: ['Monitor your symptoms carefully', 'Rest and stay hydrated', 'Consult a doctor if symptoms worsen or persist'],
    warnings: ['Seek urgent care if you develop difficulty breathing, chest pain, or loss of consciousness'],
    meds: [],
    note: 'When in doubt, consult a healthcare professional.'
  };
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
    const emergencyRegex = /\b(choking|not breathing|no breathing|heavy bleeding|bleeding|fracture|broken bone|unconscious|head injury|neck injury|seizure|stroke|cardiac arrest|heart attack)\b/i;

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
    const guidanceObj = getLocalGuidance(englishMessage);
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
        note: translatedNote,
        _enActions: guidanceObj.actions,   
        _enWarnings: guidanceObj.warnings,
        _enNote: guidanceObj.note
      };
    }

    res.json({ success: true, guidance: final, language });

  } catch (error) {
    console.error('Assess error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { assess };