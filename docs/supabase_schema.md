# Hifz Journey — Database Schema (Supabase / Postgres)

## 1. `users` Table
Handles core profile tracking.
- `id`: UUID (Primary Key)
- `email`: VARCHAR (Unique)
- `display_name`: VARCHAR
- `gender`: ENUM ('male', 'female') - Used for strict architectural partition in social spheres.
- `xp`: INT (Default 0)
- `hikmah`: INT (Default 0)
- `streak`: INT (Default 0)
- `last_active`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ

## 2. `sm2_reviews` Table
Handles the Spaced Repetition logic.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> `users.id`)
- `surah_id`: INT
- `verse_number`: INT
- `ease_factor`: FLOAT (Default 2.5)
- `interval_days`: INT (Default 0)
- `repetition_count`: INT (Default 0)
- `next_review_date`: TIMESTAMPTZ
- `last_reviewed`: TIMESTAMPTZ
- `miss_count_total`: INT (Default 0)

## 3. `mistake_journal` Table
Used for the "Mistake Journal" feature in ReviewView.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> `users.id`)
- `surah_id`: INT
- `verse_number`: INT
- `question_type`: VARCHAR
- `user_answer`: TEXT
- `correct_answer`: TEXT
- `hint_shown`: TEXT
- `created_at`: TIMESTAMPTZ

## 4. `badges` Table
- `id`: UUID
- `user_id`: UUID (Foreign Key -> `users.id`)
- `badge_id`: VARCHAR
- `earned_at`: TIMESTAMPTZ

## Real-time Requirements
- Supabase Row Level Security (RLS) enabled on all tables.
- `users` table uses policies to only permit matching `auth.uid()`.
- Gender segregation policy heavily enforced on any future `leaderboard` views or `study_circles` schemas.
