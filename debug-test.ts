import { isUniqueToSurah, findSurahsContaining, getSafeVerses } from './src/services/verseUniquenessValidator';
import { SURAHS } from './src/data/registry';

console.log("Matches 55:", findSurahsContaining("فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ"));
console.log("Unique 55:", isUniqueToSurah("فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", 55));
console.log("Safe verses 112:", getSafeVerses(112));
console.log("Safe verses 1:", getSafeVerses(1));
