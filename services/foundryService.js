const axios = require('axios');

const SYSTEM_PROMPT = `You are HEALER, a concise first-aid assistant that provides direct, WHO-aligned guidance.

OUTPUT RULES:
- Output ONLY valid JSON (no surrounding text) matching this schema:
  {
    "urgency": "low" | "medium" | "high",
    "emergency": true | false,
    "actions": ["step 1", "step 2", ...],
    "warnings": ["when to call emergency"],
    "meds": ["name + dose or empty if none"],
    "note": "short plain-text summary (1-2 sentences)"
  }

- Do NOT include any other text, headings, or commentary.
- If uncertain, use conservative WHO-style first-aid steps.

EXAMPLES:

User: "I have a headache"
{
  "urgency": "low",
  "emergency": false,
  "actions": [
    "Rest in a quiet, dark room",
    "Take paracetamol 500-1000 mg every 4-6 hours (max 3000 mg/day)",
    "Drink water and avoid screens"
  ],
  "warnings": ["Seek emergency care if headache is sudden, severe, or with confusion, weakness, or loss of consciousness"],
  "meds": ["Paracetamol 500-1000 mg every 4-6 hours"],
  "note": "Most headaches improve with rest, hydration, and paracetamol."
}

User: "Someone is choking"
{
  "urgency": "high",
  "emergency": true,
  "actions": [
    "Call emergency services immediately",
    "Give 5 firm back blows between the shoulder blades",
    "If back blows fail, perform Heimlich (abdominal thrusts) until object dislodges"
  ],
  "warnings": ["If person becomes unresponsive, start CPR immediately"],
  "meds": [],
  "note": "Follow these steps until professional help arrives."
}

END INSTRUCTIONS.`;

async function queryFoundry(userMessage) {
  const apiKey     = process.env.FOUNDRY_API_KEY;
  const deployment = process.env.FOUNDRY_DEPLOYMENT_NAME || 'Phi-4-reasoning';
  const url = 'https://medifirst-resource.services.ai.azure.com/openai/v1/chat/completions';

  console.log('Calling Foundry:', url);

  try {
    const response = await axios.post(
      url,
      {
        model: deployment,
        messages: [
          {
            role: 'system', 
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.0
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    let raw = response.data?.choices?.[0]?.message?.content || '';
    console.log('Raw reply length:', raw.length);
    console.log('First 200 chars:', raw.substring(0, 200));

    // Try direct JSON parse
    let parsed = null;

    function extractJsonObject(text) {
      const start = text.indexOf('{');
      if (start === -1) return null;
      let stack = 0;
      for (let i = start; i < text.length; i++) {
        if (text[i] === '{') stack++;
        else if (text[i] === '}') {
          stack--;
          if (stack === 0) {
            const candidate = text.substring(start, i + 1);
            try { return JSON.parse(candidate); } catch (e) { return null; }
          }
        }
      }
      return null;
    }

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = extractJsonObject(raw);
    }

    // Fallback if no valid JSON
    if (!parsed) {
      console.warn('No valid JSON in response, creating fallback');
      parsed = {
        urgency: 'low',
        emergency: false,
        actions: [raw && raw.length > 20 ? raw.substring(0, 200) : 'Please describe your concern clearly.'],
        warnings: [],
        meds: [],
        note: ''
      };
    }

    // Ensure all required fields exist
    parsed.urgency = parsed.urgency || 'low';
    parsed.emergency = !!parsed.emergency;
    parsed.actions = Array.isArray(parsed.actions) ? parsed.actions.filter(a => a) : [];
    parsed.warnings = Array.isArray(parsed.warnings) ? parsed.warnings.filter(w => w) : [];
    parsed.meds = Array.isArray(parsed.meds) ? parsed.meds.filter(m => m) : [];
    parsed.note = String(parsed.note || '');

    console.log('Parsed guidance object:', JSON.stringify(parsed).substring(0, 200));
    return parsed;

  } catch (error) {
    console.error('Foundry error:', error.response?.data || error.message);
    throw new Error('Failed to get guidance. Please try again.');
  }
}

module.exports = { queryFoundry };