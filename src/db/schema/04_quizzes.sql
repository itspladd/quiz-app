DROP TABLE IF EXISTS quizzes CASCADE;

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(30) NOT NULL,
  description VARCHAR(60) NOT NULL,
  coverphoto_url VARCHAR(255),
  views INTEGER DEFAULT 0,
  creation_time TIMESTAMP DEFAULT NOW(),
  public BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE
);