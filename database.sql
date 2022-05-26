-- CREATE DATABASE taskmanagement;

-- set extension
CREATE TABLE IF NOT EXISTS users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  user_password VARCHAR(255) NOT NULL
);

--insert fake users
-- INSERT INTO users (user_name, user_email, user_password, user_first_name, user_last_name)
-- VALUES ('Lee123', 'leekers@gmail.com', 'password', 'Yung', 'Lee');