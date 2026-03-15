import fs from 'fs';
import path from 'path';

const GROUND_TRUTH = [
  { id: 1, transliteration: "Al-Fatiha", englishMeaning: "The Opening", juzNumber: 1, verseCount: 7, revelationType: "Meccan", bismillah: true },
  { id: 2, transliteration: "Al-Baqarah", englishMeaning: "The Cow", juzNumber: 1, verseCount: 286, revelationType: "Medinan", bismillah: true },
  { id: 3, transliteration: "Ali Imran", englishMeaning: "Family of Imran", juzNumber: 3, verseCount: 200, revelationType: "Medinan", bismillah: true },
  { id: 4, transliteration: "An-Nisa", englishMeaning: "The Women", juzNumber: 4, verseCount: 176, revelationType: "Medinan", bismillah: true },
  { id: 5, transliteration: "Al-Maidah", englishMeaning: "The Table Spread", juzNumber: 6, verseCount: 120, revelationType: "Medinan", bismillah: true },
  { id: 6, transliteration: "Al-Anam", englishMeaning: "The Cattle", juzNumber: 7, verseCount: 165, revelationType: "Meccan", bismillah: true },
  { id: 7, transliteration: "Al-Araf", englishMeaning: "The Heights", juzNumber: 8, verseCount: 206, revelationType: "Meccan", bismillah: true },
  { id: 8, transliteration: "Al-Anfal", englishMeaning: "The Spoils of War", juzNumber: 9, verseCount: 75, revelationType: "Medinan", bismillah: true },
  { id: 9, transliteration: "At-Tawbah", englishMeaning: "The Repentance", juzNumber: 10, verseCount: 129, revelationType: "Medinan", bismillah: false },
  { id: 10, transliteration: "Yunus", englishMeaning: "Jonah", juzNumber: 11, verseCount: 109, revelationType: "Meccan", bismillah: true },
  { id: 11, transliteration: "Hud", englishMeaning: "Hud", juzNumber: 11, verseCount: 123, revelationType: "Meccan", bismillah: true },
  { id: 12, transliteration: "Yusuf", englishMeaning: "Joseph", juzNumber: 12, verseCount: 111, revelationType: "Meccan", bismillah: true },
  { id: 13, transliteration: "Ar-Ra'd", englishMeaning: "The Thunder", juzNumber: 13, verseCount: 43, revelationType: "Medinan", bismillah: true },
  { id: 14, transliteration: "Ibrahim", englishMeaning: "Abraham", juzNumber: 13, verseCount: 52, revelationType: "Meccan", bismillah: true },
  { id: 15, transliteration: "Al-Hijr", englishMeaning: "The Rocky Tract", juzNumber: 14, verseCount: 99, revelationType: "Meccan", bismillah: true },
  { id: 16, transliteration: "An-Nahl", englishMeaning: "The Bee", juzNumber: 14, verseCount: 128, revelationType: "Meccan", bismillah: true },
  { id: 17, transliteration: "Al-Isra", englishMeaning: "The Night Journey", juzNumber: 15, verseCount: 111, revelationType: "Meccan", bismillah: true },
  { id: 18, transliteration: "Al-Kahf", englishMeaning: "The Cave", juzNumber: 15, verseCount: 110, revelationType: "Meccan", bismillah: true },
  { id: 19, transliteration: "Maryam", englishMeaning: "Mary", juzNumber: 16, verseCount: 98, revelationType: "Meccan", bismillah: true },
  { id: 20, transliteration: "Ta-Ha", englishMeaning: "Ta-Ha", juzNumber: 16, verseCount: 135, revelationType: "Meccan", bismillah: true },
  { id: 21, transliteration: "Al-Anbiya", englishMeaning: "The Prophets", juzNumber: 17, verseCount: 112, revelationType: "Meccan", bismillah: true },
  { id: 22, transliteration: "Al-Hajj", englishMeaning: "The Pilgrimage", juzNumber: 17, verseCount: 78, revelationType: "Medinan", bismillah: true },
  { id: 23, transliteration: "Al-Muminun", englishMeaning: "The Believers", juzNumber: 18, verseCount: 118, revelationType: "Meccan", bismillah: true },
  { id: 24, transliteration: "An-Nur", englishMeaning: "The Light", juzNumber: 18, verseCount: 64, revelationType: "Medinan", bismillah: true },
  { id: 25, transliteration: "Al-Furqan", englishMeaning: "The Criterion", juzNumber: 18, verseCount: 77, revelationType: "Meccan", bismillah: true },
  { id: 26, transliteration: "Ash-Shuara", englishMeaning: "The Poets", juzNumber: 19, verseCount: 227, revelationType: "Meccan", bismillah: true },
  { id: 27, transliteration: "An-Naml", englishMeaning: "The Ant", juzNumber: 19, verseCount: 93, revelationType: "Meccan", bismillah: true },
  { id: 28, transliteration: "Al-Qasas", englishMeaning: "The Stories", juzNumber: 20, verseCount: 88, revelationType: "Meccan", bismillah: true },
  { id: 29, transliteration: "Al-Ankabut", englishMeaning: "The Spider", juzNumber: 20, verseCount: 69, revelationType: "Meccan", bismillah: true },
  { id: 30, transliteration: "Ar-Rum", englishMeaning: "The Romans", juzNumber: 21, verseCount: 60, revelationType: "Meccan", bismillah: true },
  { id: 31, transliteration: "Luqman", englishMeaning: "Luqman", juzNumber: 21, verseCount: 34, revelationType: "Meccan", bismillah: true },
  { id: 32, transliteration: "As-Sajdah", englishMeaning: "The Prostration", juzNumber: 21, verseCount: 30, revelationType: "Meccan", bismillah: true },
  { id: 33, transliteration: "Al-Ahzab", englishMeaning: "The Combined Forces", juzNumber: 21, verseCount: 73, revelationType: "Medinan", bismillah: true },
  { id: 34, transliteration: "Saba", englishMeaning: "Sheba", juzNumber: 22, verseCount: 54, revelationType: "Meccan", bismillah: true },
  { id: 35, transliteration: "Fatir", englishMeaning: "Originator", juzNumber: 22, verseCount: 45, revelationType: "Meccan", bismillah: true },
  { id: 36, transliteration: "Ya-Sin", englishMeaning: "Ya Sin", juzNumber: 22, verseCount: 83, revelationType: "Meccan", bismillah: true },
  { id: 37, transliteration: "As-Saffat", englishMeaning: "Those who set the Ranks", juzNumber: 23, verseCount: 182, revelationType: "Meccan", bismillah: true },
  { id: 38, transliteration: "Sad", englishMeaning: "The Letter \"Saad\"", juzNumber: 23, verseCount: 88, revelationType: "Meccan", bismillah: true },
  { id: 39, transliteration: "Az-Zumar", englishMeaning: "The Troops", juzNumber: 23, verseCount: 75, revelationType: "Meccan", bismillah: true },
  { id: 40, transliteration: "Ghafir", englishMeaning: "The Forgiver", juzNumber: 24, verseCount: 85, revelationType: "Meccan", bismillah: true },
  { id: 41, transliteration: "Fussilat", englishMeaning: "Explained in Detail", juzNumber: 24, verseCount: 54, revelationType: "Meccan", bismillah: true },
  { id: 42, transliteration: "Ash-Shura", englishMeaning: "The Consultation", juzNumber: 25, verseCount: 53, revelationType: "Meccan", bismillah: true },
  { id: 43, transliteration: "Az-Zukhruf", englishMeaning: "The Ornaments of Gold", juzNumber: 25, verseCount: 89, revelationType: "Meccan", bismillah: true },
  { id: 44, transliteration: "Ad-Dukhan", englishMeaning: "The Smoke", juzNumber: 25, verseCount: 59, revelationType: "Meccan", bismillah: true },
  { id: 45, transliteration: "Al-Jathiyah", englishMeaning: "The Crouching", juzNumber: 25, verseCount: 37, revelationType: "Meccan", bismillah: true },
  { id: 46, transliteration: "Al-Ahqaf", englishMeaning: "The Wind-Curved Sandhills", juzNumber: 26, verseCount: 35, revelationType: "Meccan", bismillah: true },
  { id: 47, transliteration: "Muhammad", englishMeaning: "Muhammad", juzNumber: 26, verseCount: 38, revelationType: "Medinan", bismillah: true },
  { id: 48, transliteration: "Al-Fath", englishMeaning: "The Victory", juzNumber: 26, verseCount: 29, revelationType: "Medinan", bismillah: true },
  { id: 49, transliteration: "Al-Hujurat", englishMeaning: "The Rooms", juzNumber: 26, verseCount: 18, revelationType: "Medinan", bismillah: true },
  { id: 50, transliteration: "Qaf", englishMeaning: "The Letter \"Qaf\"", juzNumber: 26, verseCount: 45, revelationType: "Meccan", bismillah: true },
  { id: 51, transliteration: "Adh-Dhariyat", englishMeaning: "The Winnowing Winds", juzNumber: 26, verseCount: 60, revelationType: "Meccan", bismillah: true },
  { id: 52, transliteration: "At-Tur", englishMeaning: "The Mount", juzNumber: 27, verseCount: 49, revelationType: "Meccan", bismillah: true },
  { id: 53, transliteration: "An-Najm", englishMeaning: "The Star", juzNumber: 27, verseCount: 62, revelationType: "Meccan", bismillah: true },
  { id: 54, transliteration: "Al-Qamar", englishMeaning: "The Moon", juzNumber: 27, verseCount: 55, revelationType: "Meccan", bismillah: true },
  { id: 55, transliteration: "Ar-Rahman", englishMeaning: "The Beneficent", juzNumber: 27, verseCount: 78, revelationType: "Medinan", bismillah: true },
  { id: 56, transliteration: "Al-Waqiah", englishMeaning: "The Inevitable", juzNumber: 27, verseCount: 96, revelationType: "Meccan", bismillah: true },
  { id: 57, transliteration: "Al-Hadid", englishMeaning: "The Iron", juzNumber: 27, verseCount: 29, revelationType: "Medinan", bismillah: true },
  { id: 58, transliteration: "Al-Mujadila", englishMeaning: "The Pleading Woman", juzNumber: 28, verseCount: 22, revelationType: "Medinan", bismillah: true },
  { id: 59, transliteration: "Al-Hashr", englishMeaning: "The Exile", juzNumber: 28, verseCount: 24, revelationType: "Medinan", bismillah: true },
  { id: 60, transliteration: "Al-Mumtahanah", englishMeaning: "She that is to be examined", juzNumber: 28, verseCount: 13, revelationType: "Medinan", bismillah: true },
  { id: 61, transliteration: "As-Saf", englishMeaning: "The Ranks", juzNumber: 28, verseCount: 14, revelationType: "Medinan", bismillah: true },
  { id: 62, transliteration: "Al-Jumuah", englishMeaning: "The Congregation, Friday", juzNumber: 28, verseCount: 11, revelationType: "Medinan", bismillah: true },
  { id: 63, transliteration: "Al-Munafiqun", englishMeaning: "The Hypocrites", juzNumber: 28, verseCount: 11, revelationType: "Medinan", bismillah: true },
  { id: 64, transliteration: "At-Taghabun", englishMeaning: "The Mutual Disillusion", juzNumber: 28, verseCount: 18, revelationType: "Medinan", bismillah: true },
  { id: 65, transliteration: "At-Talaq", englishMeaning: "The Divorce", juzNumber: 28, verseCount: 12, revelationType: "Medinan", bismillah: true },
  { id: 66, transliteration: "At-Tahrim", englishMeaning: "The Prohibition", juzNumber: 28, verseCount: 12, revelationType: "Medinan", bismillah: true },
  { id: 67, transliteration: "Al-Mulk", englishMeaning: "The Sovereignty", juzNumber: 29, verseCount: 30, revelationType: "Meccan", bismillah: true },
  { id: 68, transliteration: "Al-Qalam", englishMeaning: "The Pen", juzNumber: 29, verseCount: 52, revelationType: "Meccan", bismillah: true },
  { id: 69, transliteration: "Al-Haqqah", englishMeaning: "The Reality", juzNumber: 29, verseCount: 52, revelationType: "Meccan", bismillah: true },
  { id: 70, transliteration: "Al-Maarij", englishMeaning: "The Ascending Stairways", juzNumber: 29, verseCount: 44, revelationType: "Meccan", bismillah: true },
  { id: 71, transliteration: "Nuh", englishMeaning: "Noah", juzNumber: 29, verseCount: 28, revelationType: "Meccan", bismillah: true },
  { id: 72, transliteration: "Al-Jinn", englishMeaning: "The Jinn", juzNumber: 29, verseCount: 28, revelationType: "Meccan", bismillah: true },
  { id: 73, transliteration: "Al-Muzzammil", englishMeaning: "The Enshrouded One", juzNumber: 29, verseCount: 20, revelationType: "Meccan", bismillah: true },
  { id: 74, transliteration: "Al-Muddaththir", englishMeaning: "The Cloaked One", juzNumber: 29, verseCount: 56, revelationType: "Meccan", bismillah: true },
  { id: 75, transliteration: "Al-Qiyamah", englishMeaning: "The Resurrection", juzNumber: 29, verseCount: 40, revelationType: "Meccan", bismillah: true },
  { id: 76, transliteration: "Al-Insan", englishMeaning: "The Man", juzNumber: 29, verseCount: 31, revelationType: "Medinan", bismillah: true },
  { id: 77, transliteration: "Al-Mursalat", englishMeaning: "The Emissaries", juzNumber: 29, verseCount: 50, revelationType: "Meccan", bismillah: true },
  { id: 78, transliteration: "An-Naba", englishMeaning: "The Tidings", juzNumber: 30, verseCount: 40, revelationType: "Meccan", bismillah: true },
  { id: 79, transliteration: "An-Naziat", englishMeaning: "Those who drag forth", juzNumber: 30, verseCount: 46, revelationType: "Meccan", bismillah: true },
  { id: 80, transliteration: "Abasa", englishMeaning: "He Frowned", juzNumber: 30, verseCount: 42, revelationType: "Meccan", bismillah: true },
  { id: 81, transliteration: "At-Takwir", englishMeaning: "The Overthrowing", juzNumber: 30, verseCount: 29, revelationType: "Meccan", bismillah: true },
  { id: 82, transliteration: "Al-Infitar", englishMeaning: "The Cleaving", juzNumber: 30, verseCount: 19, revelationType: "Meccan", bismillah: true },
  { id: 83, transliteration: "Al-Mutaffifin", englishMeaning: "The Defrauding", juzNumber: 30, verseCount: 36, revelationType: "Meccan", bismillah: true },
  { id: 84, transliteration: "Al-Inshiqaq", englishMeaning: "The Sundering", juzNumber: 30, verseCount: 25, revelationType: "Meccan", bismillah: true },
  { id: 85, transliteration: "Al-Buruj", englishMeaning: "The Mansions of the Stars", juzNumber: 30, verseCount: 22, revelationType: "Meccan", bismillah: true },
  { id: 86, transliteration: "At-Tariq", englishMeaning: "The Nightcommer", juzNumber: 30, verseCount: 17, revelationType: "Meccan", bismillah: true },
  { id: 87, transliteration: "Al-Ala", englishMeaning: "The Most High", juzNumber: 30, verseCount: 19, revelationType: "Meccan", bismillah: true },
  { id: 88, transliteration: "Al-Ghashiyah", englishMeaning: "The Overwhelming", juzNumber: 30, verseCount: 26, revelationType: "Meccan", bismillah: true },
  { id: 89, transliteration: "Al-Fajr", englishMeaning: "The Dawn", juzNumber: 30, verseCount: 30, revelationType: "Meccan", bismillah: true },
  { id: 90, transliteration: "Al-Balad", englishMeaning: "The City", juzNumber: 30, verseCount: 20, revelationType: "Meccan", bismillah: true },
  { id: 91, transliteration: "Ash-Shams", englishMeaning: "The Sun", juzNumber: 30, verseCount: 15, revelationType: "Meccan", bismillah: true },
  { id: 92, transliteration: "Al-Layl", englishMeaning: "The Night", juzNumber: 30, verseCount: 21, revelationType: "Meccan", bismillah: true },
  { id: 93, transliteration: "Ad-Duha", englishMeaning: "The Morning Hours", juzNumber: 30, verseCount: 11, revelationType: "Meccan", bismillah: true },
  { id: 94, transliteration: "Ash-Sharh", englishMeaning: "The Relief", juzNumber: 30, verseCount: 8, revelationType: "Meccan", bismillah: true },
  { id: 95, transliteration: "At-Tin", englishMeaning: "The Fig", juzNumber: 30, verseCount: 8, revelationType: "Meccan", bismillah: true },
  { id: 96, transliteration: "Al-Alaq", englishMeaning: "The Clot", juzNumber: 30, verseCount: 19, revelationType: "Meccan", bismillah: true },
  { id: 97, transliteration: "Al-Qadr", englishMeaning: "The Power", juzNumber: 30, verseCount: 5, revelationType: "Meccan", bismillah: true },
  { id: 98, transliteration: "Al-Bayyinah", englishMeaning: "The Clear Proof", juzNumber: 30, verseCount: 8, revelationType: "Medinan", bismillah: true },
  { id: 99, transliteration: "Az-Zalzalah", englishMeaning: "The Earthquake", juzNumber: 30, verseCount: 8, revelationType: "Medinan", bismillah: true },
  { id: 100, transliteration: "Al-Adiyat", englishMeaning: "The Courser", juzNumber: 30, verseCount: 11, revelationType: "Meccan", bismillah: true },
  { id: 101, transliteration: "Al-Qariah", englishMeaning: "The Calamity", juzNumber: 30, verseCount: 11, revelationType: "Meccan", bismillah: true },
  { id: 102, transliteration: "At-Takathur", englishMeaning: "The Rivalry in world increase", juzNumber: 30, verseCount: 8, revelationType: "Meccan", bismillah: true },
  { id: 103, transliteration: "Al-Asr", englishMeaning: "The Declining Day", juzNumber: 30, verseCount: 3, revelationType: "Meccan", bismillah: true },
  { id: 104, transliteration: "Al-Humazah", englishMeaning: "The Traducer", juzNumber: 30, verseCount: 9, revelationType: "Meccan", bismillah: true },
  { id: 105, transliteration: "Al-Fil", englishMeaning: "The Elephant", juzNumber: 30, verseCount: 5, revelationType: "Meccan", bismillah: true },
  { id: 106, transliteration: "Quraysh", englishMeaning: "Quraysh", juzNumber: 30, verseCount: 4, revelationType: "Meccan", bismillah: true },
  { id: 107, transliteration: "Al-Maun", englishMeaning: "The Small Kindnesses", juzNumber: 30, verseCount: 7, revelationType: "Meccan", bismillah: true },
  { id: 108, transliteration: "Al-Kawthar", englishMeaning: "The Abundance", juzNumber: 30, verseCount: 3, revelationType: "Meccan", bismillah: true },
  { id: 109, transliteration: "Al-Kafirun", englishMeaning: "The Disbelievers", juzNumber: 30, verseCount: 6, revelationType: "Meccan", bismillah: true },
  { id: 110, transliteration: "An-Nasr", englishMeaning: "The Divine Support", juzNumber: 30, verseCount: 3, revelationType: "Medinan", bismillah: true },
  { id: 111, transliteration: "Al-Masad", englishMeaning: "The Palm Fiber", juzNumber: 30, verseCount: 5, revelationType: "Meccan", bismillah: true },
  { id: 112, transliteration: "Al-Ikhlas", englishMeaning: "The Sincerity", juzNumber: 30, verseCount: 4, revelationType: "Meccan", bismillah: true },
  { id: 113, transliteration: "Al-Falaq", englishMeaning: "The Daybreak", juzNumber: 30, verseCount: 5, revelationType: "Meccan", bismillah: true },
  { id: 114, transliteration: "An-Nas", englishMeaning: "The Mankind", juzNumber: 30, verseCount: 6, revelationType: "Meccan", bismillah: true }
];

const OLD_DATA = [
  { id: 114, name: "An-Nas", arabic: "الناس", biome: 'dream', difficulty: 1 },
  { id: 113, name: "Al-Falaq", arabic: "الفلق", biome: 'palace', difficulty: 1 },
  { id: 112, name: "Al-Ikhlas", arabic: "الإخلاص", biome: 'desert', difficulty: 1 },
  { id: 111, name: "Al-Masad", arabic: "المسد", biome: 'ocean', difficulty: 1 },
  { id: 110, name: "An-Nasr", arabic: "النصر", biome: 'jungle', difficulty: 1 },
  { id: 109, name: "Al-Kafirun", arabic: "الكافرون", biome: 'dream', difficulty: 1 },
  { id: 108, name: "Al-Kawthar", arabic: "الكوثر", biome: 'palace', difficulty: 1 },
  { id: 107, name: "Al-Ma'un", arabic: "الماعون", biome: 'desert', difficulty: 1 },
  { id: 106, name: "Quraysh", arabic: "قريش", biome: 'ocean', difficulty: 1 },
  { id: 105, name: "Al-Fil", arabic: "الفيل", biome: 'jungle', difficulty: 1 },
  { id: 104, name: "Al-Humazah", arabic: "الهمزة", biome: 'dream', difficulty: 1 },
  { id: 103, name: "Al-'Asr", arabic: "العصر", biome: 'palace', difficulty: 1 },
  { id: 102, name: "At-Takathur", arabic: "التكاثر", biome: 'desert', difficulty: 1 },
  { id: 101, name: "Al-Qari'ah", arabic: "القارعة", biome: 'ocean', difficulty: 1 },
  { id: 100, name: "Al-'Adiyat", arabic: "العاديات", biome: 'jungle', difficulty: 1 },
  { id: 99, name: "Az-Zalzalah", arabic: "الزلزلة", biome: 'dream', difficulty: 1 },
  { id: 98, name: "Al-Bayyinah", arabic: "البينة", biome: 'palace', difficulty: 1 },
  { id: 97, name: "Al-Qadr", arabic: "القدر", biome: 'desert', difficulty: 1 },
  { id: 96, name: "Al-'Alaq", arabic: "العلق", biome: 'ocean', difficulty: 1 },
  { id: 95, name: "At-Tin", arabic: "التين", biome: 'jungle', difficulty: 1 },
  { id: 94, name: "Ash-Sharh", arabic: "الشرح", biome: 'dream', difficulty: 1 },
  { id: 93, name: "Ad-Duha", arabic: "الضحى", biome: 'palace', difficulty: 1 },
  { id: 92, name: "Al-Layl", arabic: "الليل", biome: 'desert', difficulty: 2 },
  { id: 91, name: "Ash-Shams", arabic: "الشمس", biome: 'ocean', difficulty: 1 },
  { id: 90, name: "Al-Balad", arabic: "البلد", biome: 'jungle', difficulty: 1 },
  { id: 89, name: "Al-Fajr", arabic: "الفجر", biome: 'dream', difficulty: 2 },
  { id: 88, name: "Al-Ghashiyah", arabic: "الغاشية", biome: 'palace', difficulty: 2 },
  { id: 87, name: "Al-A'la", arabic: "الأعلى", biome: 'desert', difficulty: 1 },
  { id: 86, name: "At-Tariq", arabic: "الطارق", biome: 'ocean', difficulty: 1 },
  { id: 85, name: "Al-Buruj", arabic: "البروج", biome: 'jungle', difficulty: 2 },
  { id: 84, name: "Al-Inshiqaq", arabic: "الانشقاق", biome: 'dream', difficulty: 2 },
  { id: 83, name: "Al-Mutaffifin", arabic: "المطففين", biome: 'palace', difficulty: 2 },
  { id: 82, name: "Al-Infitar", arabic: "الانفطار", biome: 'desert', difficulty: 1 },
  { id: 81, name: "At-Takwir", arabic: "التكوير", biome: 'ocean', difficulty: 2 },
  { id: 80, name: "'Abasa", arabic: "عبس", biome: 'jungle', difficulty: 3 },
  { id: 79, name: "An-Nazi'at", arabic: "النازعات", biome: 'dream', difficulty: 3 },
  { id: 78, name: "An-Naba", arabic: "النبأ", biome: 'palace', difficulty: 2 },
  { id: 77, name: "Al-Mursalat", arabic: "المرسلات", biome: 'desert', difficulty: 3 },
  { id: 76, name: "Al-Insan", arabic: "الإنسان", biome: 'ocean', difficulty: 2 },
  { id: 75, name: "Al-Qiyamah", arabic: "القيامة", biome: 'jungle', difficulty: 2 },
  { id: 74, name: "Al-Muddaththir", arabic: "المدثر", biome: 'dream', difficulty: 3 },
  { id: 73, name: "Al-Muzzammil", arabic: "المزمل", biome: 'palace', difficulty: 1 },
  { id: 72, name: "Al-Jinn", arabic: "الجن", biome: 'desert', difficulty: 2 },
  { id: 71, name: "Nuh", arabic: "نوح", biome: 'ocean', difficulty: 2 },
  { id: 70, name: "Al-Ma'arij", arabic: "المعارج", biome: 'jungle', difficulty: 3 },
  { id: 69, name: "Al-Haqqah", arabic: "الحاقة", biome: 'dream', difficulty: 3 },
  { id: 68, name: "Al-Qalam", arabic: "القلم", biome: 'palace', difficulty: 3 },
  { id: 67, name: "Al-Mulk", arabic: "الملك", biome: 'desert', difficulty: 2 },
  { id: 66, name: "At-Tahrim", arabic: "التحريم", biome: 'ocean', difficulty: 1 },
  { id: 65, name: "At-Talaq", arabic: "الطلاق", biome: 'jungle', difficulty: 1 },
  { id: 64, name: "At-Taghabun", arabic: "التغابن", biome: 'dream', difficulty: 1 },
  { id: 63, name: "Al-Munafiqun", arabic: "المنافقون", biome: 'palace', difficulty: 1 },
  { id: 62, name: "Al-Jumu'ah", arabic: "الجمعة", biome: 'desert', difficulty: 1 },
  { id: 61, name: "As-Saf", arabic: "الصف", biome: 'ocean', difficulty: 1 },
  { id: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", biome: 'jungle', difficulty: 1 },
  { id: 59, name: "Al-Hashr", arabic: "الحشر", biome: 'dream', difficulty: 2 },
  { id: 58, name: "Al-Mujadila", arabic: "المجادلة", biome: 'palace', difficulty: 2 },
  { id: 57, name: "Al-Hadid", arabic: "الحديد", biome: 'desert', difficulty: 2 },
  { id: 56, name: "Al-Waqi'ah", arabic: "الواقعة", biome: 'ocean', difficulty: 5 },
  { id: 55, name: "Ar-Rahman", arabic: "الرحمن", biome: 'jungle', difficulty: 4 },
  { id: 54, name: "Al-Qamar", arabic: "القمر", biome: 'dream', difficulty: 3 },
  { id: 53, name: "An-Najm", arabic: "النجم", biome: 'palace', difficulty: 4 },
  { id: 52, name: "At-Tur", arabic: "الطور", biome: 'desert', difficulty: 3 },
  { id: 51, name: "Adh-Dhariyat", arabic: "الذاريات", biome: 'ocean', difficulty: 3 },
  { id: 50, name: "Qaf", arabic: "ق", biome: 'jungle', difficulty: 3 },
  { id: 49, name: "Al-Hujurat", arabic: "الحجرات", biome: 'dream', difficulty: 1 },
  { id: 48, name: "Al-Fath", arabic: "الفتح", biome: 'palace', difficulty: 2 },
  { id: 47, name: "Muhammad", arabic: "محمد", biome: 'desert', difficulty: 2 },
  { id: 46, name: "Al-Ahqaf", arabic: "الأحقاف", biome: 'ocean', difficulty: 2 },
  { id: 45, name: "Al-Jathiyah", arabic: "الجاثية", biome: 'jungle', difficulty: 2 },
  { id: 44, name: "Ad-Dukhan", arabic: "الدخان", biome: 'dream', difficulty: 3 },
  { id: 43, name: "Az-Zukhruf", arabic: "الزخرف", biome: 'palace', difficulty: 5 },
  { id: 42, name: "Ash-Shura", arabic: "الشورى", biome: 'desert', difficulty: 3 },
  { id: 41, name: "Fussilat", arabic: "فصلت", biome: 'ocean', difficulty: 3 },
  { id: 40, name: "Ghafir", arabic: "غافر", biome: 'jungle', difficulty: 5 },
  { id: 39, name: "Az-Zumar", arabic: "الزمر", biome: 'dream', difficulty: 4 },
  { id: 38, name: "Sad", arabic: "ص", biome: 'palace', difficulty: 5 },
  { id: 37, name: "As-Saffat", arabic: "الصافات", biome: 'desert', difficulty: 5 },
  { id: 36, name: "Ya-Sin", arabic: "يس", biome: 'ocean', difficulty: 5 },
  { id: 35, name: "Fatir", arabic: "فاطر", biome: 'jungle', difficulty: 3 },
  { id: 34, name: "Saba", arabic: "سبإ", biome: 'dream', difficulty: 3 },
  { id: 33, name: "Al-Ahzab", arabic: "الأحزاب", biome: 'palace', difficulty: 4 },
  { id: 32, name: "As-Sajdah", arabic: "السجدة", biome: 'desert', difficulty: 2 },
  { id: 31, name: "Luqman", arabic: "لقمان", biome: 'ocean', difficulty: 2 },
  { id: 30, name: "Ar-Rum", arabic: "الروم", biome: 'jungle', difficulty: 3 },
  { id: 29, name: "Al-'Ankabut", arabic: "العنكبوت", biome: 'dream', difficulty: 4 },
  { id: 28, name: "Al-Qasas", arabic: "القصص", biome: 'palace', difficulty: 5 },
  { id: 27, name: "An-Naml", arabic: "النمل", biome: 'desert', difficulty: 5 },
  { id: 26, name: "Ash-Shu'ara", arabic: "الشعراء", biome: 'ocean', difficulty: 5 },
  { id: 25, name: "Al-Furqan", arabic: "الفرقان", biome: 'jungle', difficulty: 4 },
  { id: 24, name: "An-Nur", arabic: "النور", biome: 'dream', difficulty: 4 },
  { id: 23, name: "Al-Mu'minun", arabic: "المؤمنون", biome: 'palace', difficulty: 5 },
  { id: 22, name: "Al-Hajj", arabic: "الحج", biome: 'desert', difficulty: 4 },
  { id: 21, name: "Al-Anbiya", arabic: "الأنبياء", biome: 'ocean', difficulty: 5 },
  { id: 20, name: "Ta-Ha", arabic: "طه", biome: 'jungle', difficulty: 5 },
  { id: 19, name: "Maryam", arabic: "مريم", biome: 'dream', difficulty: 5 },
  { id: 18, name: "Al-Kahf", arabic: "الكهف", biome: 'palace', difficulty: 5 },
  { id: 17, name: "Al-Isra", arabic: "الإسراء", biome: 'desert', difficulty: 5 },
  { id: 16, name: "An-Nahl", arabic: "النحل", biome: 'ocean', difficulty: 5 },
  { id: 15, name: "Al-Hijr", arabic: "الحجر", biome: 'jungle', difficulty: 5 },
  { id: 14, name: "Ibrahim", arabic: "إبراهيم", biome: 'dream', difficulty: 3 },
  { id: 13, name: "Ar-Ra'd", arabic: "الرعد", biome: 'palace', difficulty: 3 },
  { id: 12, name: "Yusuf", arabic: "يوسف", biome: 'desert', difficulty: 5 },
  { id: 11, name: "Hud", arabic: "هود", biome: 'ocean', difficulty: 5 },
  { id: 10, name: "Yunus", arabic: "يونس", biome: 'jungle', difficulty: 5 },
  { id: 9, name: "At-Tawbah", arabic: "التوبة", biome: 'dream', difficulty: 5 },
  { id: 8, name: "Al-Anfal", arabic: "الأنفال", biome: 'palace', difficulty: 4 },
  { id: 7, name: "Al-A'raf", arabic: "الأعراف", biome: 'desert', difficulty: 5 },
  { id: 6, name: "Al-An'am", arabic: "الأنعام", biome: 'ocean', difficulty: 5 },
  { id: 5, name: "Al-Ma'idah", arabic: "المائدة", biome: 'jungle', difficulty: 5 },
  { id: 4, name: "An-Nisa", arabic: "النساء", biome: 'dream', difficulty: 5 },
  { id: 3, name: "Ali 'Imran", arabic: "آل عمران", biome: 'palace', difficulty: 5 },
  { id: 2, name: "Al-Baqarah", arabic: "البقرة", biome: 'desert', difficulty: 5 },
  { id: 1, name: "Al-Fatiha", arabic: "الفاتحة", biome: 'ocean', difficulty: 1 },
];

const biomes = ['ocean', 'palace', 'desert', 'jungle', 'dream'];
const getFallbackArabic = (id) => `سورة ${id}`; // placeholder

const registry = GROUND_TRUTH.map(gt => {
    let old = OLD_DATA.find(o => o.id === gt.id);
    let arabic = old && old.arabic ? old.arabic : getFallbackArabic(gt.id);
    return {
        id: gt.id,
        name: gt.transliteration,
        arabic: arabic,
        verses: gt.verseCount,
        verseCount: gt.verseCount,
        juzNumber: gt.juzNumber,
        revelationType: gt.revelationType,
        englishMeaning: gt.englishMeaning,
        bismillah: gt.bismillah,
        biome: old ? old.biome : biomes[gt.id % 5],
        difficulty: old ? old.difficulty : Math.ceil(gt.verseCount / 50)
    };
});

let out = `import type { SurahNode } from '../types';

export const SURAH_REGISTRY: SurahNode[] = [\n`;

registry.forEach(r => {
    out += `  { \n`;
    out += `    id: ${r.id}, \n`;
    out += `    name: "${r.name.replace(/"/g, '\\"')}", \n`;
    out += `    arabic: "${r.arabic}", \n`;
    out += `    verses: ${r.verseCount}, \n`;
    out += `    verseCount: ${r.verseCount}, \n`;
    out += `    juzNumber: ${r.juzNumber}, \n`;
    out += `    revelationType: "${r.revelationType}", \n`;
    out += `    bismillah: ${r.bismillah}, \n`;
    out += `    englishMeaning: "${r.englishMeaning.replace(/"/g, '\\"')}",\n`;
    out += `    biome: "${r.biome}", \n`;
    out += `    difficulty: ${r.difficulty} \n`;
    out += `  },\n`;
});

out += `];\n\n`;

out += `export const getSurahById = (id: number): SurahNode | undefined => {\n`;
out += `  return SURAH_REGISTRY.find(s => s.id === id);\n`;
out += `};\n\n`;

out += `export const getProgressMapNodes = (): SurahNode[] => {\n`;
out += `  return [...SURAH_REGISTRY].sort((a, b) => b.id - a.id);\n`;
out += `};\n\n`;

out += `export const generateQuestion = (surahId: number) => {\n`;
out += `  const surah = getSurahById(surahId);\n`;
out += `  if (!surah) return null;\n`;
out += `  return {\n`;
out += `     surahId,\n`;
out += `     question: "Which Juz is " + surah.name + " in?",\n`;
out += `     answer: surah.juzNumber.toString()\n`;
out += `  }\n`;
out += `};\n`;

fs.writeFileSync('./src/data/registry.ts', out);
console.log('Successfully generated complete registry!');
