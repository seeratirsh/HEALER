/**
 * HEALER — Frontend
 * Fixes: response position, TTS, image upload, typewriter effect
 */

const i18n = {
  en: {
    appName: 'HEALER',
    tagline: "Vision • Voice • Reasoning • Guidance",
    greeting: "Hi, I'm HEALER 👋",
    greetingSub: 'Describe what\'s happening — emergencies, fever, pain, anything.',
    inputLabel: "What's the problem?",
    placeholder: 'e.g. someone is choking, I have a fever, deep cut on hand...',
    btnHelp: "Start Analysis",
    btnVoice:"Voice Input",
    btnImage: "Visual Analysis",
    emergencyLabel: '🚨 Emergencies', healthLabel: '💊 Everyday Health',
    loadingTitle: 'Analyzing...', loadingSub: 'Checking WHO protocols',
    responseTitle: 'Health Guidance',
    disclaimer: 'General guidance only. Always consult a doctor for serious conditions.',
    callNow: 'Call now', listening: 'Listening...', btnSpeak: '🔊 Speak', btnStop: '⏹ Stop',
    dir: 'ltr'
  },
  hi: {
    appName: 'HEALER',
    tagline: 'विज़न • आवाज़ • रीजनिंग • मार्गदर्शन',
    greeting: 'नमस्ते, मैं HEALER हूँ 👋',
    greetingSub: 'बताइए क्या हुआ — आपात, बुखार, दर्द, कुछ भी।',
    inputLabel: 'क्या समस्या है?',
    placeholder: 'जैसे: दम घुट रहा है, बुखार है, हाथ पर कट लगा...',
    btnHelp: 'मदद लें', btnVoice: 'आवाज़', btnImage: 'तस्वीर',
    emergencyLabel: '🚨 आपात स्थितियाँ', healthLabel: '💊 रोज़मर्रा की सेहत',
    loadingTitle: 'विश्लेषण हो रहा है...', loadingSub: 'WHO प्रोटोकॉल जाँचा जा रहा है',
    responseTitle: 'स्वास्थ्य मार्गदर्शन',
    disclaimer: 'केवल सामान्य मार्गदर्शन। गंभीर स्थिति में डॉक्टर से मिलें।',
    callNow: 'अभी कॉल करें', listening: 'सुन रहे हैं...', btnSpeak: '🔊 सुनें', btnStop: '⏹ रोकें',
    dir: 'ltr'
  },
  ur: {
    appName: 'HEALER',
    tagline: 'ویژن • آواز • ریزننگ • رہنمائی',
    greeting: 'السلام علیکم، میں HEALER ہوں 👋',
    greetingSub: 'بتائیں کیا ہوا — ہنگامی، بخار، درد، کچھ بھی۔',
    inputLabel: 'کیا مسئلہ ہے؟',
    placeholder: 'مثلاً: دم گھٹ رہا ہے، بخار ہے، ہاتھ پر زخم...',
    btnHelp: 'مدد لیں', btnVoice: 'آواز', btnImage: 'تصویر',
    emergencyLabel: '🚨 ہنگامی حالات', healthLabel: '💊 روزمرہ کی صحت',
    loadingTitle: 'تجزیہ ہو رہا ہے...', loadingSub: 'WHO پروٹوکول چیک ہو رہا ہے',
    responseTitle: 'صحت کی رہنمائی',
    disclaimer: 'صرف عمومی رہنمائی۔ سنگین حالت میں ڈاکٹر سے ملیں۔',
    callNow: 'ابھی کال کریں', listening: 'سن رہے ہیں...', btnSpeak: '🔊 سنیں', btnStop: '⏹ روکیں',
    dir: 'rtl'
  }
};

const chips = {
  emergency: {
    en: [
      { label: 'Choking',      q: 'Someone is choking and cannot breathe' },
      { label: 'Bleeding',     q: 'There is heavy bleeding from a wound' },
      { label: 'Burns',        q: 'Someone has a burn injury' },
      { label: 'Seizure',      q: 'Someone is having a seizure' },
      { label: 'Heart attack', q: 'Someone may be having a heart attack' },
      { label: 'Fainting',     q: 'Someone has fainted and is unconscious' },
      { label: 'CPR',          q: 'Someone is not breathing and needs CPR' },
      { label: 'Stroke',       q: 'Someone may be having a stroke' }
    ],
    hi: [
      { label: 'दम घुटना',    q: 'किसी का दम घुट रहा है' },
      { label: 'खून बहना',    q: 'घाव से बहुत खून बह रहा है' },
      { label: 'जलना',        q: 'किसी को जलने की चोट लगी है' },
      { label: 'दौरा',        q: 'किसी को दौरा पड़ रहा है' },
      { label: 'दिल का दौरा', q: 'किसी को दिल का दौरा पड़ सकता है' },
      { label: 'बेहोशी',      q: 'कोई बेहोश हो गया है' },
      { label: 'सीपीआर',      q: 'कोई सांस नहीं ले रहा उसे सीपीआर चाहिए' },
      { label: 'स्ट्रोक',     q: 'किसी को स्ट्रोक हो सकता है' }
    ],
    ur: [
      { label: 'دم گھٹنا',   q: 'کسی کا دم گھٹ رہا ہے' },
      { label: 'خون بہنا',   q: 'زخم سے بہت خون بہہ رہا ہے' },
      { label: 'جلنا',       q: 'کسی کو جلنے کی چوٹ لگی ہے' },
      { label: 'دورہ',       q: 'کسی کو دورہ پڑ رہا ہے' },
      { label: 'دل کا دورہ', q: 'کسی کو دل کا دورہ پڑ سکتا ہے' },
      { label: 'بے ہوشی',    q: 'کوئی بے ہوش ہو گیا ہے' },
      { label: 'سی پی آر',   q: 'کوئی سانس نہیں لے رہا اسے سی پی آر چاہیے' },
      { label: 'فالج',       q: 'کسی کو فالج ہو سکتا ہے' }
    ]
  },
  health: {
    en: [
      { label: 'Fever',        q: 'I have a high fever' },
      { label: 'Cold & Flu',   q: 'I have cold and flu' },
      { label: 'Headache',     q: 'I have a severe headache' },
      { label: 'Stomach ache', q: 'I have stomach ache' },
      { label: 'Vomiting',     q: 'I am vomiting repeatedly' },
      { label: 'Sore throat',  q: 'I have a sore throat' },
      { label: 'Diarrhea',     q: 'I have diarrhea' },
      { label: 'Minor cut',    q: 'I have a minor cut on my hand' }
    ],
    hi: [
      { label: 'बुखार',       q: 'मुझे तेज़ बुखार है' },
      { label: 'सर्दी-जुकाम',q: 'मुझे सर्दी और जुकाम है' },
      { label: 'सिरदर्द',    q: 'मुझे तेज़ सिरदर्द है' },
      { label: 'पेट दर्द',   q: 'मुझे पेट में दर्द है' },
      { label: 'उल्टी',      q: 'मुझे उल्टी हो रही है' },
      { label: 'गला दर्द',   q: 'मेरा गला दर्द कर रहा है' },
      { label: 'दस्त',       q: 'मुझे दस्त लगे हैं' },
      { label: 'छोटा कट',    q: 'मेरे हाथ पर छोटा कट लगा है' }
    ],
    ur: [
      { label: 'بخار',         q: 'مجھے تیز بخار ہے' },
      { label: 'نزلہ زکام',   q: 'مجھے نزلہ اور زکام ہے' },
      { label: 'سر درد',       q: 'مجھے شدید سر درد ہے' },
      { label: 'پیٹ درد',     q: 'مجھے پیٹ میں درد ہے' },
      { label: 'قے',           q: 'مجھے قے آ رہی ہے' },
      { label: 'گلے کی تکلیف',q: 'میرا گلا درد کر رہا ہے' },
      { label: 'اسہال',        q: 'مجھے اسہال ہے' },
      { label: 'چھوٹا زخم',   q: 'میرے ہاتھ پر چھوٹا زخم ہے' }
    ]
  }
};

let currentLang    = 'en';
let emergencyMode = false;

const emergencyQuestions = [
  "Is the person conscious?",
  "Is the person breathing normally?",
  "Is there heavy bleeding?",
  "Is there severe pain or visible fracture?",
  "Is there head or neck injury?"
];

let emergencyAnswers = {};
let emergencyStep = 0;
let typewriterTimer = null;
let lastGuidance = null;

// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

// i18n
function applyLanguage(lang) {
  const t = i18n[lang];
  document.documentElement.lang = lang === 'ur' ? 'ur' : lang === 'hi' ? 'hi' : 'en';
  document.documentElement.dir  = t.dir;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });
  buildChips(lang);
}

// Chips
function buildChips(lang) {
  ['emergencyChips', 'healthChips'].forEach(id => document.getElementById(id).innerHTML = '');
  chips.emergency[lang].forEach(c => addChip('emergencyChips', c, 'chip'));
  chips.health[lang].forEach(c => addChip('healthChips', c, 'chip chip-health'));
}

function addChip(containerId, chip, className) {
  const btn = document.createElement('button');
  btn.className   = className;
  btn.textContent = chip.label;
  btn.addEventListener('click', () => {
    document.getElementById('textInput').value = chip.q;
    submitText(chip.q);
  });
  document.getElementById(containerId).appendChild(btn);
}

// Language toggle
document.querySelectorAll('.lb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lb').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    currentLang = btn.dataset.lang;
    applyLanguage(currentLang);
  });
});

// Submit
document.getElementById('submitText').addEventListener('click', () => {
  const msg = document.getElementById('textInput').value.trim();
  if (msg) submitText(msg);
});

document.getElementById('textInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const msg = document.getElementById('textInput').value.trim();
    if (msg) submitText(msg);
  }
});

// Voice
document.getElementById('voiceBtn').addEventListener('click', () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return alert('Voice not supported. Use Chrome or Edge.');
  const recognition = new SR();
  recognition.lang  =
    currentLang === 'hi' ? 'hi-IN' :
    currentLang === 'ur' ? 'ur-PK' : 'en-US';
  const span = document.querySelector('#voiceBtn [data-i18n]');
  span.textContent = i18n[currentLang].listening;
  recognition.start();
  recognition.onresult = e => {
    const t = e.results[0][0].transcript;
    document.getElementById('textInput').value = t;
    span.textContent = i18n[currentLang].btnVoice;
    submitText(t);
  };
  recognition.onerror = () => { span.textContent = i18n[currentLang].btnVoice; };
});

// Image
document.getElementById('imageInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) submitImage(file);
});

// ── TTS ───────────────────────────────────────────────────────────────────────
let currentUtterance = null;

function speakGuidance(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const urduVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('ur'));
  utterance.lang =
    currentLang === 'hi' ? 'hi-IN' :
    currentLang === 'ur' ?  (urduVoices.length ? 'ur-PK' : 'hi-IN') : 'en-US';
  utterance.rate = 0.88;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => {
    currentUtterance = utterance;
    const stopBtn = document.getElementById('stopBtn');
    const speakBtn = document.getElementById('speakBtn');
    if (stopBtn) stopBtn.style.display = 'flex';
    if (speakBtn) speakBtn.style.opacity = '0.5';
  };
  utterance.onend = utterance.onerror = () => {
    currentUtterance = null;
    const stopBtn = document.getElementById('stopBtn');
    const speakBtn = document.getElementById('speakBtn');
    if (stopBtn) stopBtn.style.display = 'none';
    if (speakBtn) speakBtn.style.opacity = '1';
  };

  setTimeout(() => window.speechSynthesis.speak(utterance), 100);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  currentUtterance = null;
  const stopBtn = document.getElementById('stopBtn');
  const speakBtn = document.getElementById('speakBtn');
  if (stopBtn) stopBtn.style.display = 'none';
  if (speakBtn) speakBtn.style.opacity = '1';
}

document.getElementById('speakBtn').addEventListener('click', () => {
  if (lastGuidance) speakGuidance(buildSpeakText(lastGuidance));
});

document.getElementById('stopBtn').addEventListener('click', stopSpeaking);
function normalizeGuidanceItem(item) {
  if (typeof item === 'string') return item;
  if (!item) return '';
  if (typeof item === 'object') {
    return item.text || item.title || item.content || item.message || JSON.stringify(item);
  }
  return String(item);
}

function showLoading() {
  const loading = document.getElementById('loading');
  const response = document.getElementById('responseArea');
  const el = document.getElementById('guidanceText');

  response.classList.add('hidden');
  loading.classList.remove('hidden');
  el.textContent = '';
}

// ── API Calls ─────────────────────────────────────────────────────────────────

// Replace submitText function
async function submitText(message) {
  showLoading();
  try {
    const res  = await fetch('/api/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language: currentLang, inputType: 'text' })
    });
    const data = await res.json();
    if (data.guidance) {
      renderGuidance(data.guidance);
    } else {
      renderGuidance({ 
        urgency: 'low', 
        emergency: false, 
        actions: [data.error || 'Could not get a response. Please try again.'], 
        warnings: [], 
        meds: [], 
        note: '' 
      });
    }
  } catch {
    renderGuidance({ 
      urgency: 'low', 
      emergency: false, 
      actions: ['Could not connect. Check your internet and try again.'], 
      warnings: [], 
      meds: [], 
      note: '' 
    });
  }
}

// Replace submitImage function
async function submitImage(file) {
  showLoading();

  // Show image preview
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('imagePreview');
    if (preview) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('image', file);
  formData.append('language', currentLang);
  formData.append('inputType', 'image');
  try {
    const res  = await fetch('/api/assess', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.guidance) {
      renderGuidance(data.guidance);
    } else {
      renderGuidance({ 
        urgency: 'low', 
        emergency: false, 
        actions: [data.error || 'Could not analyze image. Please describe in text.'], 
        warnings: [], 
        meds: [], 
        note: '' 
      });
    }
  } catch {
    renderGuidance({ 
      urgency: 'low', 
      emergency: false, 
      actions: ['Could not analyze image. Please describe the situation in text.'], 
      warnings: [], 
      meds: [], 
      note: '' 
    });
  }
}

function buildSpeakText(guidance) {
  // For Urdu, speak English version since ur-PK voice unavailable in most browsers
  if (currentLang === 'ur' && guidance._enActions) {
    const parts = [];
    if (guidance._enActions?.length) parts.push(...guidance._enActions);
    if (guidance._enWarnings?.length) parts.push(...guidance._enWarnings);
    if (guidance._enNote) parts.push(guidance._enNote);
    return parts.join('. ');
  }
  const parts = [];
  if (guidance.actions?.length) parts.push(...guidance.actions.map(a => normalizeGuidanceItem(a)));
  if (guidance.warnings?.length) parts.push(...guidance.warnings.map(w => normalizeGuidanceItem(w)));
  if (guidance.note) parts.push(guidance.note);
  return parts.join('. ');
}

// Replace showGuidance with renderGuidance

function renderGuidance(guidance) {
  lastGuidance = guidance;
  console.log("Guidance received:", guidance);

  stopSpeaking();

  if (typewriterTimer) {
    clearTimeout(typewriterTimer);
  }

  const loading = document.getElementById('loading');
  const response = document.getElementById('responseArea');
  const el = document.getElementById('guidanceText');
  const badge = document.getElementById('riskBadge');

  const labels = {
  en: {
    actions: '🩺 WHAT TO DO',
    warnings: '⚠️ WARNING SIGNS',
    meds: '💊 MEDICATION',
    note: '📋 SUMMARY'
  },
  hi: {
    actions: '🩺 क्या करें',
    warnings: '⚠️ चेतावनी संकेत',
    meds: '💊 दवा',
    note: '📋 सारांश'
  },
  ur: {
    actions: '🩺 کیا کریں',
    warnings: '⚠️ خطرے کی علامات',
    meds: '💊 دوا',
    note: '📋 خلاصہ'
  }
};
// let raw = response.data?.choices?.[0]?.message?.content || '';
// console.log("RAW RESPONSE:");
// console.log(raw);
const t = labels[currentLang] || labels.en;

  loading.classList.add('hidden');
  response.classList.remove('hidden');

  el.textContent = '';

  let display = '';
  if (guidance.emergency) {
  badge.style.display = 'inline-block';
  badge.className='risk-badge risk-high';
  badge.innerHTML ='<i class="fa-solid fa-triangle-exclamation"></i> HIGH RISK';
  }
else if (guidance.urgency === 'medium') {
  badge.style.display = 'inline-block';
  badge.className='risk-badge risk-medium';
  badge.innerHTML ='<i class="fa-solid fa-stethoscope"></i> MEDIUM RISK';
  }
else { 
  badge.style.display = 'inline-block';
  badge.className='risk-badge risk-low';
  badge.innerHTML ='<i class="fa-solid fa-heart-pulse"></i> LOW RISK';
 }

  if (
    guidance.actions &&
    Array.isArray(guidance.actions) &&
    guidance.actions.length > 0
  ) {
    display += `${t.actions}\n\n`;

    guidance.actions.forEach((a, idx) => {
      const text = normalizeGuidanceItem(a);

      if (text && text.trim()) {
        display += `${idx + 1}. ${text}\n`;
      }
    });

    display += '\n';
  }

  if (
    guidance.warnings &&
    Array.isArray(guidance.warnings) &&
    guidance.warnings.length > 0
  ) {
    display += `${t.warnings}\n\n`;

    guidance.warnings.forEach(w => {
      const text = normalizeGuidanceItem(w);

      if (text && text.trim()) {
        display += `• ${text}\n`;
      }
    });

    display += '\n';
  }

  if (
    guidance.meds &&
    Array.isArray(guidance.meds) &&
    guidance.meds.length > 0
  ) {
    display += `${t.meds}\n\n`;
    guidance.meds.forEach(m => {
      const text = normalizeGuidanceItem(m);

      if (text && text.trim()) {
        display += `• ${text}\n`;
      }
    });

    display += '\n';
  }

  if (guidance.note && guidance.note.trim()) {
    display += `${t.note}\n\n${guidance.note}`;
  }

  if (!display.trim()) {
    display = 'No guidance available.';
  }

  let i = 0;

  function typeWriter() {
    if (i < display.length) {
      el.textContent += display.charAt(i);
      i++;
      typewriterTimer = setTimeout(typeWriter, 8);
    } else {
     setTimeout(() => {
    speakGuidance(buildSpeakText(guidance));
     }, 500);
    }
  }

  typeWriter();

  response.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
document.addEventListener('DOMContentLoaded', () => {

  const panicBtn = document.getElementById('panicBtn');

  if (panicBtn) {

    panicBtn.addEventListener('click', () => {

      emergencyMode = true;
      emergencyStep = 0;
      emergencyAnswers = {};

      addBotMessage(
        "🚨 Emergency Mode Activated"
      );

      askEmergencyQuestion();
    });

  }

});

function addBotMessage(text) {

  const chat = document.getElementById('chatArea');

  const msg = document.createElement('div');

  msg.className = 'bot-message';

  msg.textContent = text;

  chat.appendChild(msg);

  chat.scrollTop = chat.scrollHeight;

  speakGuidance(text);
}

function addUserMessage(text) {

  const chat = document.getElementById('chatArea');

  const msg = document.createElement('div');

  msg.className = 'user-message';

  msg.textContent = text;

  chat.appendChild(msg);

  chat.scrollTop = chat.scrollHeight;
}

function askEmergencyQuestion() {

  if (emergencyStep >= emergencyQuestions.length) {

    evaluateEmergency();

    return;
  }

  addBotMessage(
    emergencyQuestions[emergencyStep]
  );
}

function evaluateEmergency() {

  addBotMessage(
    "🔍 Analyzing emergency..."
  );

  addBotMessage(
    "🚨 HIGH RISK DETECTED"
  );

  addBotMessage(
`1. Apply firm pressure to bleeding.

2. Keep the injured person still.

3. Do not straighten broken limbs.

4. Seek emergency medical help immediately.`
  );
}
// Init
applyLanguage('en');