const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Ranks
  ["name: 'Seeker'", "name: 'باحث'"],
  ["name: 'Student'", "name: 'طالب'"],
  ["name: 'Hafiz'", "name: 'حافظ'"],
  ["name: 'Scholar'", "name: 'عالم'"],
  ["name: 'Mufassir'", "name: 'مفسر'"],

  // Biomes
  ["getBiomeName = (biome: Biome) => {", "getBiomeName = (biome: Biome) => {\n  const names = { jungle: 'غابة', ocean: 'محيط', desert: 'صحراء', palace: 'قصر', dream: 'حلم' };\n  return names[biome] || biome;"],
  ["return biome.charAt(0).toUpperCase() + biome.slice(1);", ""],

  // Labels in Map
  ["{surah.verses} Verses • {isCompleted ? 'Mastered' : 'Locked'}", "{surah.verses} آيات • {isCompleted ? 'متقن' : 'مغلق'}"],

  // Badges
  ["name: 'First Step', desc: 'Complete your first Surah'", "name: 'الخطوة الأولى', desc: 'أكمل السورة الأولى'"],
  ["name: 'Consistent', desc: '3-day streak'", "name: 'مستمر', desc: 'سلسلة 3 أيام'"],
  ["name: 'Devoted', desc: '7-day streak'", "name: 'مخلص', desc: 'سلسلة 7 أيام'"],
  ["name: 'Young Scholar', desc: 'Complete 5 Surahs'", "name: 'طالب علم', desc: 'أكمل 5 سور'"],
  ["name: 'Perfection', desc: 'Score 100% on any quiz'", "name: 'إتقان', desc: 'احصل على 100% في أي اختبار'"],
  ["name: 'Master of Tawhid', desc: 'Complete Al-Ikhlas'", "name: 'سيد التوحيد', desc: 'أكمل سورة الإخلاص'"],
  ["name: 'Lightning', desc: 'Answer in under 3 seconds'", "name: 'صاعقة', desc: 'أجب في أقل من 3 ثوان'"],
  ["name: 'Explorer', desc: 'Visit 3 biomes'", "name: 'مستكشف', desc: 'زر 3 مناطق'"],

  // Profile
  ["Trophy Cabinet", "خزانة الجوائز"],
  ["XP &nbsp;•&nbsp; {user.hikmah} Hikmah &nbsp;•&nbsp; {user.completed.length} Surahs", "نقاط &nbsp;•&nbsp; {user.hikmah} حكمة &nbsp;•&nbsp; {user.completed.length} سور"],

  // Home Stats
  ["label: 'XP'", "label: 'النقاط'"],
  ["label: 'Streak'", "label: 'استمرار'"],
  ["label: 'Rank'", "label: 'الرتبة'"],
  ["label: 'Hikmah'", "label: 'الحكمة'"],

  // Daily Challenge
  ["<p className=\"text-accent text-xs font-bold uppercase tracking-widest mb-2\">Daily Challenge</p>", "<p className=\"text-accent text-xs font-bold uppercase tracking-widest mb-2\">التحدي اليومي</p>"],
  ["<h2 className=\"text-xl font-bold mb-1\">Surah {currentSurahData.name}</h2>", "<h2 className=\"text-xl font-bold mb-1\">سورة {currentSurahData.arabic}</h2>"], // Switched to arabic name
  ["<p className=\"text-sm text-white/70 mb-4\">Earn 2x XP today!</p>", "<p className=\"text-sm text-white/70 mb-4\">احصل على ضعف النقاط اليوم!</p>"],
  ["Start Challenge →", "ابدأ التحدي ←"],
  ["Salaam, {user.name}!", "سلام، {user.name}!"],

  // Modes
  ["<h3 className=\"text-lg font-bold mb-4\">Learning Modes</h3>", "<h3 className=\"text-lg font-bold mb-4\">أنماط التعلم</h3>"],
  ["name: 'Verse Quiz', desc: 'Fill the blanks'", "name: 'اختبار الآية', desc: 'أكمل الفراغ'"],
  ["name: 'Word Scramble', desc: 'Arrange the ayah'", "name: 'ترتيب الكلمات', desc: 'رتب الآية'"],
  ["name: 'Ayah Match', desc: 'Arabic ↔ English'", "name: 'مطابقة الآية', desc: 'عربي ↔ إنجليزي'"],
  ["name: 'Tajweed Lab', desc: 'Pronunciation drill'", "name: 'معمل التجويد', desc: 'تدريب النطق'"],

  // Map & Profile Header
  ["<h2 className=\"text-2xl font-bold flex items-center gap-2\">\n                <span>🗺️</span> Your Journey\n              </h2>", "<h2 className=\"text-2xl font-bold flex items-center gap-2\">\n                <span>🗺️</span> رحلتك\n              </h2>"],
  
  // App Container RTL
  ["<div className={`min-h-[100dvh] ${getBiomeGradients(activeBiome)} text-white font-sans flex flex-col relative transition-colors duration-1000`}>", "<div dir=\"rtl\" className={`min-h-[100dvh] ${getBiomeGradients(activeBiome)} text-white font-sans flex flex-col relative transition-colors duration-1000`}>"],

  // Game Engine
  ["Ma sha Allah!", "ما شاء الله!"],
  ["You completed Surah {surah.name}", "لقد أكملت سورة {surah.arabic}"],
  ["<span className=\"font-bold text-lg\">Perfect</span>", "<span className=\"font-bold text-lg\">ممتاز</span>"],
  ["<span className=\"text-xs text-white/50 uppercase tracking-widest mt-1\">Score</span>", "<span className=\"text-xs text-white/50 uppercase tracking-widest mt-1\">النتيجة</span>"],
  ["<span className=\"text-xs text-white/50 uppercase tracking-widest mt-1\">XP Earned</span>", "<span className=\"text-xs text-white/50 uppercase tracking-widest mt-1\">النقاط المكتسبة</span>"],
  ["Continue Journey →", "متابعة الرحلة ←"],

  ["<p className=\"text-xs font-bold text-accent uppercase tracking-widest mb-4\">Tajweed Challenge</p>", "<p className=\"text-xs font-bold text-accent uppercase tracking-widest mb-4\">تحدي التجويد</p>"],
  ["💡</span> Tafsir Hint</h4>", "💡</span> تلميح التفسير</h4>"],
  ["Got it, continue", "فهمت، تابع"],

  ["Tap words in correct order", "اضغط على الكلمات بالترتيب الصحيح"],
  ["<span className=\"text-white/30 truncate\">Drop zone</span>", "<span className=\"text-white/30 truncate\">منطقة الإسقاط</span>"],
  ["Match Arabic to English", "طابق الكلمات بمعانيها"],

  // Nav
  ["label: 'Home'", "label: 'الرئيسية'"],
  ["label: 'Journey'", "label: 'الرحلة'"],
  ["label: 'Profile'", "label: 'الشخصي'"],

  // Fix biome + name display inside the game header
  ["<span>{getBiomeName(surah.biome)} • {surah.name}</span>", "<span>{getBiomeName(surah.biome)} • سورة {surah.arabic}</span>"]
];

for (const [search, replace] of replacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.tsx updated');
