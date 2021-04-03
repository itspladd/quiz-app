DROP TABLE IF EXISTS session_answers CASCADE;

CREATE TABLE session_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  session_id INTEGER REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE
);