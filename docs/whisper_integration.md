# Whisper API Integration Plan (Recitation Engine)

## Objective
To allow users to recite verses out loud, capture the audio, transcribe it intelligently, and evaluate their tajweed/recitation accuracy against the Quranic text.

## Flow Architecture
1. **Frontend Capture**: 
   - User holds the "Mic" button in `GameEngine.tsx` (Recitation Mode).
   - Use `MediaRecorder` API to capture the audio stream as `.webm` or `.m4a`.
2. **Pre-processing (Client-Side)**:
   - Trim silences to reduce payload.
   - Limit recording length to a max of 30 seconds per verse to prevent API timeouts.
3. **Backend Middleware (Vercel Edge Function)**:
   - Accept the audio blob.
   - Inject the expected Arabic transliteration as `prompt` context to guide the Whisper model.
   - Send to OpenAI's Whisper API (`whisper-1`).
4. **Evaluation Engine (Backend)**:
   - Compare the Whisper transcription against the standard Uthmani text.
   - Use string-distance algorithms (e.g. Levenshtein distance on normalized Arabic text) to identify mistaken words.
   - Calculate an accuracy percentage.
5. **Frontend Feedback**:
   - Highlight missed or mispronounced words in red.
   - Determine `qualityScore` (0-5) based on accuracy and speed.
   - If accurate, trigger `audioEngine.playChime()` and `triggerHaptic()`.

## Adab / Spiritual Constraints
- Do not grade subjective melodic elements (Maqamat) to avoid discouraging learners.
- Only assess distinct verbal accuracy (Hifz correctness).
- Error feedback should be private and gentle.
