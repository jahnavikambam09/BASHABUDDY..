(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LANGS = ['en', 'te', 'hi', 'ta'];
  const GOAL = 5;
  const STORE = 'bhashabuddy-v1';
  const today = () => new Date().toDateString();
  const yesterday = () => new Date(Date.now() - 864e5).toDateString();
  const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);

  /* ---------- UI text: [English, Telugu, Hindi, Tamil] ---------- */
  const UI = {
    heroTitle: ['Learn engineering English in your language', 'మీ భాషలో ఇంజనీరింగ్ ఇంగ్లీష్ నేర్చుకోండి', 'अपनी भाषा में इंजीनियरिंग अंग्रेज़ी सीखें', 'உங்கள் மொழியில் பொறியியல் ஆங்கிலம் கற்கலாம்'],
    heroSub: ['Flip, listen, speak. Five words a day gets you interview-ready.', 'తిప్పండి, వినండి, మాట్లాడండి. రోజుకు ఐదు పదాలతో ఇంటర్వ్యూకి సిద్ధం.', 'पलटें, सुनें, बोलें। रोज़ पाँच शब्द, इंटरव्यू के लिए तैयार।', 'புரட்டுங்கள், கேளுங்கள், பேசுங்கள். தினமும் ஐந்து சொற்கள், நேர்காணலுக்குத் தயார்.'],
    tabLearn: ['Learn', 'నేర్చుకో', 'सीखें', 'கற்க'],
    tabQuiz: ['Quiz', 'క్విజ్', 'क्विज़', 'வினாடி வினா'],
    tabBuddy: ['Buddy', 'బడ్డీ', 'बडी', 'நண்பன்'],
    dailyGoal: ['Daily goal', 'రోజువారీ లక్ష్యం', 'दैनिक लक्ष्य', 'தினசரி இலக்கு'],
    words: ['words', 'పదాలు', 'शब्द', 'சொற்கள்'],
    streak: ['Day streak', 'రోజుల వరుస', 'दिनों की स्ट्रीक', 'தொடர் நாட்கள்'],
    points: ['Points', 'పాయింట్లు', 'अंक', 'புள்ளிகள்'],
    flipHint: ['Tap card to flip', 'కార్డును తిప్పడానికి నొక్కండి', 'पलटने के लिए कार्ड दबाएँ', 'புரட்ட அட்டையைத் தொடுங்கள்'],
    interviewLine: ['Placement interview line', 'ప్లేస్‌మెంట్ ఇంటర్వ్యూ వాక్యం', 'प्लेसमेंट इंटरव्यू वाक्य', 'வேலைவாய்ப்பு நேர்காணல் வாக்கியம்'],
    listen: ['Listen', 'వినండి', 'सुनें', 'கேளுங்கள்'],
    normal: ['Normal', 'సాధారణ', 'सामान्य', 'இயல்பான'],
    slow: ['Slow', 'నెమ్మదిగా', 'धीमा', 'மெதுவாக'],
    speak: ['Speak', 'మాట్లాడండి', 'बोलें', 'பேசுங்கள்'],
    stopRec: ['Stop', 'ఆపండి', 'रोकें', 'நிறுத்து'],
    studioTitle: ['Speaking studio', 'మాట్లాడే స్టూడియో', 'बोलने का स्टूडियो', 'பேசும் அரங்கு'],
    studioHint: ['Say the word out loud. Accents are welcome.', 'పదాన్ని గట్టిగా చెప్పండి. మీ యాసకు స్వాగతం.', 'शब्द ज़ोर से बोलें। आपके लहजे का स्वागत है।', 'சொல்லை உரக்கச் சொல்லுங்கள். உங்கள் உச்சரிப்புக்கு வரவேற்பு.'],
    match: ['Pronunciation Match', 'ఉచ్చారణ సరిపోలిక', 'उच्चारण मिलान', 'உச்சரிப்புப் பொருத்தம்'],
    heard: ['We heard', 'మేము విన్నది', 'हमने सुना', 'நாங்கள் கேட்டது'],
    great: ['Excellent! Word mastered.', 'అద్భుతం! పదం నేర్చుకున్నారు.', 'शानदार! शब्द सीख लिया।', 'அருமை! சொல் கற்றுக்கொண்டீர்கள்.'],
    tryAgain: ['Close. Listen once more and try again.', 'దాదాపు సరిగ్గా ఉంది. మళ్లీ విని ప్రయత్నించండి.', 'करीब हैं। एक बार और सुनें और फिर बोलें।', 'நெருக்கமாக உள்ளது. மீண்டும் கேட்டு முயலுங்கள்.'],
    fallbackTitle: ['Microphone not working?', 'మైక్ పనిచేయడం లేదా?', 'माइक काम नहीं कर रहा?', 'மைக் வேலை செய்யவில்லையா?'],
    fallbackHint: ['Type the word or use the demo match.', 'పదాన్ని టైప్ చేయండి లేదా డెమో మ్యాచ్ వాడండి.', 'शब्द टाइप करें या डेमो मैच इस्तेमाल करें।', 'சொல்லைத் தட்டச்சு செய்யவும் அல்லது டெமோ பொருத்தத்தைப் பயன்படுத்தவும்.'],
    check: ['Check', 'తనిఖీ', 'जाँचें', 'சரிபார்'],
    simulate: ['Simulate voice match', 'వాయిస్ మ్యాచ్ చూపించు', 'वॉइस मैच दिखाएँ', 'குரல் பொருத்தம் காட்டு'],
    typePh: ['Type the word', 'పదాన్ని టైప్ చేయండి', 'शब्द टाइप करें', 'சொல்லைத் தட்டச்சு செய்யவும்'],
    micOff: ['Microphone unavailable. Use the fallback below.', 'మైక్ అందుబాటులో లేదు. కింద ఉన్న ప్రత్యామ్నాయం వాడండి.', 'माइक उपलब्ध नहीं है। नीचे दिया विकल्प इस्तेमाल करें।', 'மைக் கிடைக்கவில்லை. கீழுள்ள மாற்று வழியைப் பயன்படுத்துங்கள்.'],
    listening: ['Listening…', 'వింటోంది…', 'सुन रहा है…', 'கேட்கிறது…'],
    prev: ['Previous', 'ముందు', 'पिछला', 'முந்தையது'],
    next: ['Next', 'తర్వాత', 'अगला', 'அடுத்தது'],
    card: ['Card', 'కార్డ్', 'कार्ड', 'அட்டை'],
    qMeaning: ['What does this word mean?', 'ఈ పదానికి అర్థం ఏమిటి?', 'इस शब्द का अर्थ क्या है?', 'இந்தச் சொல்லின் பொருள் என்ன?'],
    qBlank: ['Pick the word that completes the sentence.', 'వాక్యాన్ని పూర్తిచేసే పదాన్ని ఎంచుకోండి.', 'वाक्य पूरा करने वाला शब्द चुनें।', 'வாக்கியத்தை முடிக்கும் சொல்லைத் தேர்ந்தெடுங்கள்.'],
    correct: ['Correct!', 'సరైనది!', 'सही!', 'சரி!'],
    wrong: ['Not quite. Answer:', 'కాదు. సమాధానం:', 'सही नहीं। उत्तर:', 'இல்லை. பதில்:'],
    finish: ['Finish', 'ముగించు', 'समाप्त', 'முடி'],
    quizDone: ['Quiz complete', 'క్విజ్ పూర్తయింది', 'क्विज़ पूरा हुआ', 'வினாடி வினா முடிந்தது'],
    outOf: ['out of', 'మొత్తం', 'में से', 'இல்'],
    again: ['Play again', 'మళ్లీ ఆడండి', 'फिर खेलें', 'மீண்டும் விளையாடு'],
    buddyTitle: ['Placement Buddy', 'ప్లేస్‌మెంట్ బడ్డీ', 'प्लेसमेंट बडी', 'வேலைவாய்ப்பு நண்பன்'],
    chatHello: ['Hi! I\'m your Placement Buddy. Ask me anything in your language.', 'నమస్కారం! నేను మీ ప్లేస్‌మెంట్ బడ్డీని. మీ భాషలో ఏదైనా అడగండి.', 'नमस्ते! मैं आपका प्लेसमेंट बडी हूँ। अपनी भाषा में कुछ भी पूछें।', 'வணக்கம்! நான் உங்கள் வேலைவாய்ப்பு நண்பன். உங்கள் மொழியில் எதையும் கேளுங்கள்.'],
    askPh: ['Ask your doubt', 'మీ సందేహం అడగండి', 'अपना सवाल पूछें', 'உங்கள் சந்தேகத்தைக் கேளுங்கள்'],
    send: ['Send', 'పంపండి', 'भेजें', 'அனுப்பு'],
    chipInterview: ['Interview tips', 'ఇంటర్వ్యూ చిట్కాలు', 'इंटरव्यू टिप्स', 'நேர்காணல் குறிப்புகள்'],
    chipPron: ['Pronunciation help', 'ఉచ్చారణ సహాయం', 'उच्चारण मदद', 'உச்சரிப்பு உதவி'],
    chipAlgo: ['What is an algorithm?', 'అల్గారిథమ్ అంటే ఏమిటి?', 'एल्गोरिदम क्या है?', 'அல்காரிதம் என்றால் என்ன?'],
    reset: ['Reset demo', 'డెమో రీసెట్', 'डेमो रीसेट', 'டெமோவை மீட்டமை'],
    Easy: ['Easy', 'సులభం', 'आसान', 'எளிது'],
    Medium: ['Medium', 'మధ్యస్థం', 'मध्यम', 'நடுத்தரம்'],
    Hard: ['Hard', 'కఠినం', 'कठिन', 'கடினம்'],
    uDSA: ['Data Structures', 'డేటా స్ట్రక్చర్లు', 'डेटा स्ट्रक्चर', 'தரவு கட்டமைப்புகள்'],
    uNet: ['Networks', 'నెట్‌వర్క్స్', 'नेटवर्क', 'வலையமைப்பு'],
    uOOP: ['OOP', 'OOP', 'OOP', 'OOP'],
    uComp: ['Compiler Design', 'కంపైలర్ డిజైన్', 'कंपाइलर डिज़ाइन', 'தொகுப்பி வடிவமைப்பு']
  };

  /* ---------- Vocabulary ---------- */
  const WORDS = [
    { id: 'algorithm', term: 'Algorithm', phon: 'AL-guh-ri-thuhm', unit: 'uDSA', level: 'Easy', a1: '#F59E0B', a2: '#FFF1CC', visual: '📥 → ⚙️ → 📤',
      sentence: 'Can you explain the algorithm you used to solve this problem?',
      en: ['Algorithm', 'A step-by-step set of rules to solve a problem.'],
      te: ['క్రమసూత్ర పద్ధతి', 'సమస్యను పరిష్కరించడానికి దశలవారీగా పాటించే నియమాల వరుస.'],
      hi: ['एल्गोरिदम (क्रमबद्ध विधि)', 'किसी समस्या को हल करने के चरणबद्ध नियमों का समूह।'],
      ta: ['வழிமுறை (அல்காரிதம்)', 'ஒரு சிக்கலைத் தீர்க்க பின்பற்றும் படிப்படியான விதிகள்.'] },
    { id: 'recursion', term: 'Recursion', phon: 'ri-KUR-zhuhn', unit: 'uDSA', level: 'Medium', a1: '#7C3AED', a2: '#EDE4FF', visual: '🔁 🪆 🔁',
      sentence: 'I used recursion to traverse the binary tree.',
      en: ['Recursion', 'When a function calls itself to solve smaller parts of a problem.'],
      te: ['పునరావృతం', 'ఒక ఫంక్షన్ తనను తానే మళ్లీ పిలవడం.'],
      hi: ['पुनरावृत्ति', 'जब कोई फ़ंक्शन खुद को ही दोबारा कॉल करता है।'],
      ta: ['மீளுதல்', 'ஒரு செயல்பாடு தன்னைத்தானே மீண்டும் அழைப்பது.'] },
    { id: 'latency', term: 'Latency', phon: 'LAY-tuhn-see', unit: 'uNet', level: 'Easy', a1: '#0EA5E9', a2: '#DDF3FE', visual: '📡 ⏱️ 💻',
      sentence: 'We reduced the latency of the API from 800 ms to 200 ms.',
      en: ['Latency', 'The delay between sending a request and getting a reply.'],
      te: ['ఆలస్యం (లేటెన్సీ)', 'అభ్యర్థన పంపినప్పటి నుంచి స్పందన వచ్చే వరకు పట్టే సమయం.'],
      hi: ['विलंबता', 'अनुरोध भेजने और जवाब मिलने के बीच का समय।'],
      ta: ['தாமதம்', 'கோரிக்கை அனுப்பியதிலிருந்து பதில் வரும் வரை ஆகும் நேரம்.'] },
    { id: 'compiler', term: 'Compiler', phon: 'kuhm-PY-ler', unit: 'uComp', level: 'Medium', a1: '#F43F5E', a2: '#FFE4EA', visual: '📝 → 🛠️ → 0101',
      sentence: 'The compiler reported a syntax error on line 12.',
      en: ['Compiler', 'A tool that turns program code into machine language.'],
      te: ['సంకలనకర్త (కంపైలర్)', 'ప్రోగ్రామ్ కోడ్‌ను యంత్రం అర్థం చేసుకునే భాషలోకి మార్చే సాధనం.'],
      hi: ['संकलक', 'प्रोग्राम कोड को मशीन की भाषा में बदलने वाला टूल।'],
      ta: ['தொகுப்பி', 'நிரல் குறியீட்டை இயந்திரம் புரிந்துகொள்ளும் மொழியாக மாற்றும் கருவி.'] },
    { id: 'polymorphism', term: 'Polymorphism', phon: 'pol-ee-MOR-fiz-uhm', unit: 'uOOP', level: 'Hard', a1: '#10B981', a2: '#D9F8EC', visual: '🔷 🔶 🔺',
      sentence: 'Method overriding is an example of polymorphism in Java.',
      en: ['Polymorphism', 'One name, many forms: the same method behaves differently.'],
      te: ['బహురూపత', 'ఒకే పేరు, వేర్వేరు రూపాల్లో పనిచేయడం.'],
      hi: ['बहुरूपता', 'एक ही नाम से अलग-अलग तरह का व्यवहार करना।'],
      ta: ['பல்லுருவாக்கம்', 'ஒரே பெயர் வெவ்வேறு விதமாகச் செயல்படுவது.'] },
    { id: 'bandwidth', term: 'Bandwidth', phon: 'BAND-width', unit: 'uNet', level: 'Easy', a1: '#EA580C', a2: '#FFE8D6', visual: '🚰 📶 📦',
      sentence: 'Video calls need more bandwidth than text messages.',
      en: ['Bandwidth', 'The amount of data a network can carry in one second.'],
      te: ['బ్యాండ్‌విడ్త్ (డేటా సామర్థ్యం)', 'ఒక సెకనులో నెట్‌వర్క్ ద్వారా పంపగల డేటా పరిమాణం.'],
      hi: ['बैंडविड्थ', 'एक सेकंड में नेटवर्क से भेजा जा सकने वाला डेटा।'],
      ta: ['அலைவரிசை', 'ஒரு விநாடியில் வலையமைப்பு வழியாக அனுப்பக்கூடிய தரவின் அளவு.'] }
  ];

  /* ---------- Buddy replies ---------- */
  const BUDDY = {
    interview: [
      'Start with a one-line answer, then give an example. Try: "I used an algorithm that runs in O(n log n) time."',
      'మొదట ఒక చిన్న వాక్యంలో సమాధానం చెప్పండి, తర్వాత ఉదాహరణ ఇవ్వండి. ఇలా చెప్పండి: "I used an algorithm that runs in O(n log n) time."',
      'पहले एक छोटे वाक्य में जवाब दें, फिर उदाहरण दें। ऐसे बोलें: "I used an algorithm that runs in O(n log n) time."',
      'முதலில் ஒரு சிறிய வாக்கியத்தில் பதில் சொல்லுங்கள், பிறகு உதாரணம் தாருங்கள். இப்படிச் சொல்லுங்கள்: "I used an algorithm that runs in O(n log n) time."'
    ],
    pron: [
      'Slow down, split the word into syllables, and stress the capital part: AL-guh-ri-thuhm. Use the Slow button first.',
      'నెమ్మదిగా, అక్షరాలుగా విడగొట్టి చెప్పండి. పెద్ద అక్షరాల భాగంపై ఒత్తిడి ఇవ్వండి: AL-guh-ri-thuhm. ముందు "నెమ్మదిగా" బటన్ నొక్కండి.',
      'धीरे बोलें, शब्द को अक्षरों में बाँटें और बड़े अक्षरों पर ज़ोर दें: AL-guh-ri-thuhm। पहले "धीमा" बटन दबाएँ।',
      'மெதுவாக, எழுத்துக்கூறுகளாகப் பிரித்துச் சொல்லுங்கள். பெரிய எழுத்துப் பகுதியில் அழுத்தம் கொடுங்கள்: AL-guh-ri-thuhm. முதலில் "மெதுவாக" பொத்தானை அழுத்துங்கள்.'
    ],
    algo: [
      'An algorithm is a step-by-step method to solve a problem, like a recipe. In interviews, say: "My algorithm has three steps."',
      'అల్గారిథమ్ అంటే సమస్యను పరిష్కరించే దశలవారీ పద్ధతి, వంటకం లాంటిది. ఇంటర్వ్యూలో ఇలా చెప్పండి: "My algorithm has three steps."',
      'एल्गोरिदम समस्या हल करने का चरणबद्ध तरीका है, रेसिपी जैसा। इंटरव्यू में कहें: "My algorithm has three steps."',
      'அல்காரிதம் என்பது ஒரு சிக்கலைத் தீர்க்கும் படிப்படியான முறை, சமையல் குறிப்பு போல. நேர்காணலில் சொல்லுங்கள்: "My algorithm has three steps."'
    ],
    fallback: [
      'I can help with interview phrases, pronunciation, and word meanings. Tap a suggestion below.',
      'ఇంటర్వ్యూ వాక్యాలు, ఉచ్చారణ, పదాల అర్థాలలో నేను సహాయం చేస్తాను. కింద ఒక సూచనను నొక్కండి.',
      'मैं इंटरव्यू वाक्य, उच्चारण और शब्दों के अर्थ में मदद कर सकता हूँ। नीचे कोई सुझाव चुनें।',
      'நேர்காணல் வாக்கியங்கள், உச்சரிப்பு, சொற்பொருள் ஆகியவற்றில் உதவுவேன். கீழே ஒரு பரிந்துரையைத் தேர்ந்தெடுங்கள்.'
    ]
  };

  /* ---------- State ---------- */
  const defaults = () => ({
    lang: 'en', idx: 0, slow: false,
    mastered: ['latency', 'compiler'], // 2/5 at start, so mastering "Algorithm" gives 3/5
    streak: 3, points: 120, lastDay: yesterday()
  });
  let state = defaults();
  try { state = { ...state, ...JSON.parse(localStorage.getItem(STORE) || '{}') }; } catch (e) { /* ignore */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignore */ } };

  const li = () => LANGS.indexOf(state.lang);
  const t = (k) => (UI[k] ? UI[k][li()] : k);
  const tr = (w) => w[state.lang] || w.en;
  const word = () => WORDS[state.idx];

  function touchStreak() {
    if (state.lastDay === today()) return;
    state.streak = state.lastDay === yesterday() ? state.streak + 1 : 1;
    state.lastDay = today();
  }

  /* ---------- Toast / confetti ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }
  function confetti() {
    const box = $('#confetti');
    const colors = ['#F59E0B', '#10B981', '#F43F5E', '#0EA5E9', '#7C3AED', '#FACC15'];
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.background = colors[i % colors.length];
      s.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
      s.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      s.style.animationDelay = Math.random() * 0.4 + 's';
      box.appendChild(s);
      setTimeout(() => s.remove(), 3000);
    }
  }

  /* ---------- Language / i18n ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('#langPill button').forEach((b) => b.classList.toggle('active', b.dataset.lang === state.lang));
    renderCard();
    renderStats(false);
    if (quiz) renderQuiz();
  }

  /* ---------- Stats ---------- */
  const RING = 213.63;
  function renderStats(bump) {
    const n = Math.min(state.mastered.length, GOAL);
    $('#goalCount').textContent = `${n}/${GOAL}`;
    const ring = $('#goalRing');
    ring.style.strokeDashoffset = RING * (1 - n / GOAL);
    ring.classList.toggle('done', n >= GOAL);
    $('#streakNum').textContent = state.streak;
    $('#pointsNum').textContent = state.points;
    if (bump) ['#goalCount', '#streakNum', '#pointsNum'].forEach((s) => {
      const el = $(s); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    });
  }

  /* ---------- Flashcard ---------- */
  function renderCard() {
    const w = word();
    const [name, desc] = tr(w);
    const card = $('#card');
    card.style.setProperty('--a1', w.a1);
    card.style.setProperty('--a2', w.a2);
    $$('.face', card).forEach((f) => { f.style.setProperty('--a1', w.a1); f.style.setProperty('--a2', w.a2); });
    $('#cardFront').innerHTML = `
      <div class="badges"><span class="badge unit">${t(w.unit)}</span><span class="badge ${w.level}">${t(w.level)}</span></div>
      <div class="term">${w.term}</div>
      <div class="phon">${w.phon}</div>
      <div class="native">${name}</div>
      <div class="tap">↻ ${t('flipHint')}</div>`;
    $('#cardBack').innerHTML = `
      <div class="native">${name}</div>
      <div class="explain">${desc}</div>
      <div class="visual">${w.visual}</div>
      <div><div class="sentence-label">${t('interviewLine')}</div><div class="sentence">${w.sentence}</div></div>`;
    $('#cardCounter').textContent = `${t('card')} ${state.idx + 1} / ${WORDS.length}`;
  }
  function go(delta) {
    state.idx = (state.idx + delta + WORDS.length) % WORDS.length;
    $('#card').classList.remove('flipped');
    resetStudio();
    renderCard();
    save();
  }
  const flip = () => $('#card').classList.toggle('flipped');
  $('#card').addEventListener('click', flip);
  $('#card').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  $('#prevBtn').addEventListener('click', () => go(-1));
  $('#nextBtn').addEventListener('click', () => go(1));

  /* ---------- Equalizer bars ---------- */
  function buildEq(el, n) {
    for (let i = 0; i < n; i++) {
      const b = document.createElement('i');
      b.style.setProperty('--d', (Math.random() * 0.6).toFixed(2) + 's');
      b.style.setProperty('--h', (0.35 + Math.random() * 0.65).toFixed(2));
      el.appendChild(b);
    }
  }
  buildEq($('#eqListen'), 12);
  buildEq($('#eqMic'), 28);

  /* ---------- Text to speech ---------- */
  let voices = [];
  const loadVoices = () => { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; };
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

  function speak(text, rate, onEnd) {
    if (!window.speechSynthesis) { toast('Speech not supported in this browser.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = rate;
    const v = voices.find((x) => x.lang === 'en-IN') || voices.find((x) => x.lang.startsWith('en'));
    if (v) u.voice = v;
    u.onstart = () => $('#eqListen').classList.add('on');
    u.onend = u.onerror = () => { $('#eqListen').classList.remove('on'); if (onEnd) onEnd(); };
    speechSynthesis.speak(u);
  }
  $('#listenBtn').addEventListener('click', () => speak(word().term, state.slow ? 0.7 : 1));
  $$('#speedToggle button').forEach((b) => b.addEventListener('click', () => {
    state.slow = b.dataset.speed === '0.7';
    $$('#speedToggle button').forEach((x) => x.classList.toggle('active', x === b));
    save();
  }));

  /* ---------- Pronunciation scoring ---------- */
  function lev(a, b) {
    const m = a.length, n = b.length;
    const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[m][n];
  }
  // distance <= 2 counts as a match, so regional accents are not rejected unfairly
  function scoreSpeech(alternatives) {
    const target = word().term.toLowerCase();
    let best = { d: 99, heard: alternatives[0] || '' };
    alternatives.forEach((alt) => {
      const clean = alt.toLowerCase().replace(/[^a-z\s]/g, '').trim();
      const tries = clean.split(/\s+/).concat(clean.replace(/\s+/g, ''));
      tries.forEach((w) => { const d = lev(w, target); if (d < best.d) best = { d, heard: alt }; });
    });
    const pct = best.d <= 2 ? 95 - best.d * 5 : Math.max(25, 70 - (best.d - 2) * 10);
    return { pct, heard: best.heard };
  }

  /* ---------- Gauge ---------- */
  const G = 339.29;
  let gaugeRaf;
  function setGauge(pct) {
    const fg = $('#gaugeFg');
    const color = pct >= 85 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#F43F5E';
    fg.style.stroke = color;
    fg.style.strokeDashoffset = G * (1 - pct / 100);
    $('.gauge').classList.toggle('win', pct >= 85);
    const el = $('#gaugeNum');
    const from = parseInt(el.textContent, 10) || 0;
    const start = performance.now();
    cancelAnimationFrame(gaugeRaf);
    const tick = (now) => {
      const p = Math.min((now - start) / 1100, 1);
      el.textContent = Math.round(from + (pct - from) * (1 - Math.pow(1 - p, 3))) + '%';
      if (p < 1) gaugeRaf = requestAnimationFrame(tick);
    };
    gaugeRaf = requestAnimationFrame(tick);
  }
  function resetStudio() {
    stopRec();
    setGauge(0);
    $('#heardLine').textContent = '';
    $('#feedback').textContent = '';
    $('#feedback').className = 'feedback';
  }

  function showResult(pct, heard) {
    setGauge(pct);
    $('#heardLine').textContent = heard ? `${t('heard')}: "${heard}"` : '';
    const fb = $('#feedback');
    if (pct >= 85) {
      fb.textContent = `${t('match')}: ${pct}%  ·  ${t('great')}`;
      fb.className = 'feedback good';
      masterWord();
    } else {
      fb.textContent = t('tryAgain');
      fb.className = 'feedback try';
    }
  }
  function masterWord() {
    const w = word();
    confetti();
    if (!state.mastered.includes(w.id)) {
      state.mastered.push(w.id);
      state.points += 20;
      touchStreak();
      save();
      setTimeout(() => renderStats(true), 700);
    }
  }

  /* ---------- Speech recognition ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, recording = false;

  function setRecUI(on) {
    recording = on;
    $('#eqMic').classList.toggle('on', on);
    $('#micBtn').classList.toggle('rec', on);
    $('#micLabel').textContent = on ? t('stopRec') : t('speak');
    if (on) $('#heardLine').textContent = t('listening');
  }
  function openFallback() { $('#fallback').open = true; toast(t('micOff')); }
  function stopRec() { if (rec && recording) { try { rec.stop(); } catch (e) { /* ignore */ } } setRecUI(false); }

  function startRec() {
    if (!SR) { openFallback(); return; }
    rec = new SR();
    rec.lang = 'en-IN';
    rec.maxAlternatives = 5;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const alts = [...e.results[0]].map((r) => r.transcript);
      const { pct, heard } = scoreSpeech(alts);
      showResult(pct, heard);
    };
    rec.onerror = (e) => {
      if (['not-allowed', 'service-not-allowed', 'audio-capture', 'network'].includes(e.error)) openFallback();
    };
    rec.onend = () => setRecUI(false);
    try { rec.start(); setRecUI(true); } catch (e) { openFallback(); }
  }
  $('#micBtn').addEventListener('click', () => (recording ? stopRec() : startRec()));
  if (!SR) $('#fallback').open = true;

  /* Fallback controls */
  $('#checkBtn').addEventListener('click', () => {
    const v = $('#typeInput').value.trim();
    if (!v) return;
    const { pct, heard } = scoreSpeech([v]);
    showResult(pct, heard);
  });
  $('#typeInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#checkBtn').click(); });
  $('#simBtn').addEventListener('click', () => {
    $('#eqMic').classList.add('on');
    setTimeout(() => { $('#eqMic').classList.remove('on'); showResult(95, word().term); }, 1400);
  });

  /* ---------- Quiz ---------- */
  let quiz = null;
  function newQuiz() {
    const picked = shuffle(WORDS).slice(0, 5);
    quiz = {
      i: 0, correct: 0, answered: false, done: false,
      qs: picked.map((w, n) => ({ w, type: n % 2 === 0 ? 'meaning' : 'blank' }))
    };
    quiz.qs.forEach((q) => {
      const others = shuffle(WORDS.filter((x) => x.id !== q.w.id)).slice(0, 3);
      q.options = shuffle([q.w, ...others]);
    });
  }
  function renderQuiz() {
    const box = $('#quizBox');
    if (!quiz) newQuiz();
    if (quiz.done) {
      box.innerHTML = `<div class="q-result"><div class="trophy">🏆</div><h3>${t('quizDone')}</h3>
        <p>${quiz.correct} ${t('outOf')} ${quiz.qs.length}  ·  +${quiz.correct * 10} ${t('points')}</p>
        <p style="margin-top:16px"><button class="btn primary" id="againBtn">${t('again')}</button></p></div>`;
      $('#againBtn').addEventListener('click', () => { newQuiz(); renderQuiz(); });
      return;
    }
    const q = quiz.qs[quiz.i];
    const stem = q.type === 'meaning'
      ? `<div class="q-text">${t('qMeaning')}</div><div class="q-word">${q.w.term}</div>`
      : `<div class="q-text">${t('qBlank')}</div><div class="q-word" style="font-size:1.2rem;color:inherit">${q.w.sentence.replace(new RegExp(q.w.term, 'i'), '_____')}</div>`;
    const opts = q.options.map((o) => `<button class="opt" data-id="${o.id}">${q.type === 'meaning' ? tr(o)[1] : o.term}</button>`).join('');
    box.innerHTML = `
      <div class="q-top"><span>${t('tabQuiz')} ${quiz.i + 1}/${quiz.qs.length}</span><span>✅ ${quiz.correct}</span></div>
      <div class="q-bar"><i style="width:${(quiz.i / quiz.qs.length) * 100}%"></i></div>
      ${stem}<div class="opts" style="margin-top:14px">${opts}</div>
      <div class="q-msg" id="qMsg"></div>
      <div class="q-actions"><button class="btn primary small" id="qNext" hidden>${quiz.i === quiz.qs.length - 1 ? t('finish') : t('next')}</button></div>`;
    quiz.answered = false;
    $$('.opt', box).forEach((b) => b.addEventListener('click', () => answerQuiz(b, q)));
    $('#qNext').addEventListener('click', nextQuiz);
  }
  function answerQuiz(btn, q) {
    if (quiz.answered) return;
    quiz.answered = true;
    const ok = btn.dataset.id === q.w.id;
    $$('.opt').forEach((b) => { b.disabled = true; if (b.dataset.id === q.w.id) b.classList.add('right'); });
    if (!ok) btn.classList.add('bad');
    else { quiz.correct++; confetti(); }
    const msg = $('#qMsg');
    msg.style.color = ok ? 'var(--emerald)' : 'var(--coral)';
    msg.textContent = ok ? t('correct') : `${t('wrong')} ${q.type === 'meaning' ? tr(q.w)[1] : q.w.term}`;
    $('#qNext').hidden = false;
  }
  function nextQuiz() {
    if (quiz.i === quiz.qs.length - 1) {
      quiz.done = true;
      state.points += quiz.correct * 10;
      touchStreak();
      save();
      renderStats(true);
    } else quiz.i++;
    renderQuiz();
  }

  /* ---------- Placement Buddy ---------- */
  function addBubble(text, who) {
    const b = document.createElement('div');
    b.className = 'bubble ' + who;
    b.textContent = text;
    $('#chatLog').appendChild(b);
    $('#chatLog').scrollTop = 1e6;
    return b;
  }
  function buddyReply(topic) {
    const typing = addBubble('•••', 'bot typing');
    setTimeout(() => { typing.remove(); addBubble(BUDDY[topic][li()], 'bot'); }, 700);
  }
  function detect(text) {
    const s = text.toLowerCase();
    if (/interview|ఇంటర్వ్యూ|इंटरव्यू|நேர்காணல|இன்டர்வியூ/.test(s)) return 'interview';
    if (/pronounc|speak|ఉచ్చారణ|उच्चारण|உச்சரிப்/.test(s)) return 'pron';
    if (/algorithm|అల్గా|एल्गो|அல்கா|வழிமுறை|క్రమసూత్ర/.test(s)) return 'algo';
    return 'fallback';
  }
  $$('#chips button').forEach((b) => b.addEventListener('click', () => {
    addBubble(b.textContent, 'me');
    buddyReply(b.dataset.topic);
  }));
  function sendChat() {
    const inp = $('#chatInput');
    const v = inp.value.trim();
    if (!v) return;
    addBubble(v, 'me');
    inp.value = '';
    buddyReply(detect(v));
  }
  $('#sendBtn').addEventListener('click', sendChat);
  $('#chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

  /* ---------- Tabs, language switch, reset ---------- */
  $$('.tab').forEach((tab) => tab.addEventListener('click', () => {
    $$('.tab').forEach((x) => x.classList.toggle('active', x === tab));
    $$('.panel').forEach((p) => p.classList.toggle('active', p.id === 'tab-' + tab.dataset.tab));
    if (tab.dataset.tab === 'quiz') renderQuiz();
  }));
  $$('#langPill button').forEach((b) => b.addEventListener('click', () => {
    state.lang = b.dataset.lang;
    save();
    applyI18n();
  }));
  $('#resetBtn').addEventListener('click', () => {
    const lang = state.lang;
    state = { ...defaults(), lang };
    save();
    quiz = null;
    resetStudio();
    $('#card').classList.remove('flipped');
    applyI18n();
    toast('✔');
  });

  /* ---------- Init ---------- */
  setGauge(0);
  applyI18n();
})();