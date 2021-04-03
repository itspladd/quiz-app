DROP TABLE IF EXISTS results CASCADE;

CREATE TABLE results (
  id SERIAL PRIMARY KEY NOT NULL,
  session_id INTEGER REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  quizzes_started INTEGER DEFAULT 0
);