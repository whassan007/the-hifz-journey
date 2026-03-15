export const MOCK_QUESTIONS = {
  quiz: {
    type: "fillBlank",
    ayah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ ___",
    answer: "الرَّحِيمِ",
    options: ["الرَّحِيمِ", "الْعَظِيمِ", "الْكَرِيمِ", "الْحَكِيمِ"],
    translation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    hint: "تذكر صفة الرحمة التي تختص بالمؤمنين في الآخرة."
  },
  scramble: {
    type: "order",
    words: ["الْحَمْدُ", "لِلَّهِ", "رَبِّ", "الْعَالَمِينَ"],
    translation: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
  },
  match: {
    type: "match",
    pairs: [
      { arabic: "الرَّحْمَٰنِ", english: "الرحمن", id: '1' },
      { arabic: "الرَّحِيمِ", english: "الرحيم", id: '2' },
      { arabic: "مَالِكِ", "english": "مالك", id: '3' },
      { arabic: "يَوْمِ", english: "يوم", id: '4' }
    ]
  },
  tajweed: {
    type: "tajweed",
    ayah: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    rule: "إظهار",
    question: "ما هو حكم النون في كلمة نَعْبُدُ؟",
    options: ["إدغام", "إخفاء", "إقلاب", "إظهار"],
    answer: "إظهار",
    hint: "انظر إلى الحرف الذي بعد النون. هل هو من حروف الحلق؟"
  },
  vine_climb: {
    type: "vine_climb",
    words: ["قُلْ", "هُوَ", "اللَّهُ", "أَحَدٌ"],
    translation: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    levels: 1 // Single level for prototype
  },
  lantern_trail: {
    type: "lantern_trail",
    words: ["بِسْمِ", "اللَّهِ", "الرَّحْمَٰنِ", "الرَّحِيمِ"],
    cues: ["بـ", "ا", "ا", "ا"], // First letters
    translation: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
  },
  oasis_puzzle: {
    type: "oasis_puzzle",
    fragments: ["مَالِكِ يَوْمِ", "الدِّينِ", "الرَّحْمَٰنِ الرَّحِيمِ"], // scrambled chunks
    correctOrder: ["الرَّحْمَٰنِ الرَّحِيمِ", "مَالِكِ يَوْمِ", "الدِّينِ"],
    translation: "الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ"
  }
};
