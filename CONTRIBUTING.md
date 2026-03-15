# Contributing to Hifz

Welcome to Hifz! Thank you for contributing to this project. To maintain the integrity and educational value of our application, we have strict architectural rules regarding Quranic content.

## The Core Rule: Zero Hardcoded Quranic Content

**This is a systemic architectural mandate.** Every game, question type, review card, test, and UI component in the app must source all Quranic text dynamically from `surah-ground-truth.json`. 

No Arabic verse text, surah name, verse fragment, or word sequence may appear as a string literal anywhere in the codebase.

### The Absolute Guidelines:
- **If it is Quranic text** → it comes from the data layer, never from code.
- **If it is a surah name** → it comes from `surah-ground-truth.json`, never hardcoded.
- **If it is a verse** → it comes from `getSafeVerses(surahId)`, never a string literal.
- **If it is a word from a verse** → it is split from a verse fetched at runtime, never typed.
- **If it is UI text** → it comes from the `src/data/ui-text.json` dictionary, never hardcoded in your TSX files.

Our build system strictly enforces these rules using a custom ESLint plugin (`local/no-hardcoded-arabic`). A `husky` pre-commit hook runs on every commit, so **any hardcoded Arabic strings will cause your commit to be rejected.**

### How to use the Data Layer:
To fetch validated, unique verse content or valid Surah metadata, use the designated getters from `src/services/verseUniquenessValidator.ts` and `src/data/registry.ts`:

```typescript
import { getSafeVerses } from '../services/verseUniquenessValidator';
import { getSurahById } from '../data/registry';
```

With these rules, we ensure that every game and quiz is pedagogically meaningful and tied strictly to ground-truth content.
