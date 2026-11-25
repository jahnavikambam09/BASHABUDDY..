import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "bhashabuddy.sqlite");

export const db = new sqlite3.Database(dbPath);

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS UserProfiles (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        preferred_lang TEXT DEFAULT 'te',
        daily_goal INTEGER DEFAULT 5,
        words_today INTEGER DEFAULT 2,
        streak_days INTEGER DEFAULT 3,
        total_points INTEGER DEFAULT 120
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS VocabularyUnits (
        word_id INTEGER PRIMARY KEY AUTOINCREMENT,
        unit_name TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        english_word TEXT UNIQUE NOT NULL,
        phonetic TEXT NOT NULL,
        meaning_te TEXT NOT NULL,
        meaning_hi TEXT NOT NULL,
        meaning_ta TEXT NOT NULL,
        example_sentence TEXT NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS PronunciationScores (
        score_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        word TEXT NOT NULL,
        spoken_text TEXT NOT NULL,
        accuracy_score INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS ProgressLogs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action_type TEXT NOT NULL,
        points_earned INTEGER DEFAULT 10,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Seed default student profile
      db.run(
        `INSERT OR IGNORE INTO UserProfiles (user_id, username, preferred_lang, daily_goal, words_today, streak_days, total_points)
         VALUES (1, 'Kambam Jahnavi', 'te', 5, 2, 3, 120)`
      );

      // Seed technical vocabulary deck
      const words = [
        ["Algorithms & Data Structures", "Medium", "Algorithm", "AL-guh-ri-thuhm", "క్రమసూత్ర పద్ధతి (సమస్యను పరిష్కరించే దశలవారీ విధానం)", "कलन विधि (समस्या हल करने के चरणबद्ध नियम)", "படிமுறை (சிக்கலைத் தீர்க்கும் படிப்படியான விதிகள்)", "Our sorting algorithm reduced search latency by 40%."],
        ["Algorithms & Data Structures", "Hard", "Recursion", "ri-KUR-zhuhn", "పునరావృతం (తనను తాను తిరిగి పిలుచుకునే ఫంక్షన్)", "पुनरावर्तन (स्वयं को कॉल करने वाला फ़ंक्शन)", "சுழல்நிலை (தன்னைத்தானே அழைக்கும் செயல்பாடு)", "Tree traversal is cleanly implemented using recursion."],
        ["Computer Networks", "Easy", "Latency", "LAY-tuhn-see", "జాప్యం (డేటా ప్రయాణించడానికి పట్టే సమయం)", "विलंबता (डेटा भेजने और उत्तर मिलने में लगने वाला समय)", "தாமதம் (தரவு பரிமாற்றத்தில் ஏற்படும் கால தாமதம்)", "Edge caching minimizes API latency for rural users."],
        ["System Software", "Easy", "Compiler", "kuhm-PY-ler", "కంపైలర్ (సోర్స్ కోడ్‌ను మెషిన్ కోడ్‌గా మార్చే సాఫ్ట్‌వేర్)", "संकलक (सोर्स कोड को मशीन कोड में बदलने वाला प्रोग्राम)", "தொகுப்பி (நிரல் குறியீட்டை இயந்திர மொழியாக மாற்றும் மென்பொருள்)", "The C compiler flagged a missing semicolon on line 12."],
        ["Object-Oriented Programming", "Hard", "Polymorphism", "pol-ee-MOR-fiz-uhm", "బహురూపత (ఒకే పేరుతో విభిన్న రకాలుగా పనిచేసే విధానం)", "बहुरूपता (एक ही नाम के विभिन्न रूपों में कार्य करने की क्षमता)", "பல்லுருவாக்கம் (ஒரே பெயரில் வெவ்வேறு செயல்களைச் செய்யும் திறன்)", "Method overriding demonstrates runtime polymorphism in Java."],
        ["Computer Networks", "Medium", "Bandwidth", "BAND-width", "బ్యాండ్‌విడ్త్ (నెట్‌వర్క్ ద్వారా ప్రసారమయ్యే గరిష్ట డేటా సామర్థ్యం)", "बैंडविड्थ (नेटवर्क की अधिकतम डेटा स्थानांतरण क्षमता)", "அலைக்கற்றை (பிணையத்தின் அதிகபட்ச தரவு பரிமாற்ற திறன்)", "Synthetic speech saves bandwidth in low-connectivity areas."]
      ];

      const stmt = db.prepare(`INSERT OR IGNORE INTO VocabularyUnits 
        (unit_name, difficulty, english_word, phonetic, meaning_te, meaning_hi, meaning_ta, example_sentence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

      for (const w of words) stmt.run(w);
      stmt.finalize((err) => (err ? reject(err) : resolve()));
    });
  });
}
