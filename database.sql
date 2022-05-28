-- CREATE DATABASE taskmanagement;
-- psql -U postgres -d taskmanagement -a -f database.sql
-- \i database.sql
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS invitation CASCADE;
DROP TABLE IF EXISTS member CASCADE;
DROP TABLE IF EXISTS task CASCADE;
DROP TABLE IF EXISTS taskAlloted CASCADE;
DROP TABLE IF EXISTS doingTask CASCADE;
DROP TABLE IF EXISTS doingTaskAlloted CASCADE;
DROP TABLE IF EXISTS completedTask CASCADE;
DROP TABLE IF EXISTS completedTaskAlloted CASCADE;

-- users table
CREATE TABLE IF NOT EXISTS users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  user_password VARCHAR(255) NOT NULL
);

-- project and its owner table
CREATE TABLE IF NOT EXISTS project(
  project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name VARCHAR(255) NOT NULL,
  project_description TEXT NOT NULL,
  user_id_FK uuid NOT NULL,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE
);


-- invitation table
CREATE TABLE IF NOT EXISTS invitation(
  invitation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp default current_timestamp,
  invitation_by_user_id_FK uuid NOT NULL,
  invitation_to_user_id_FK uuid NOT NULL,
  project_id_FK uuid NOT NULL,
  CONSTRAINT invitation_by_user_id_FK
    FOREIGN KEY(invitation_by_user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT invitation_to_user_id_FK
    FOREIGN KEY(invitation_to_user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT project_id_FK
    FOREIGN KEY(project_id_FK)
    REFERENCES project(project_id)
    ON DELETE CASCADE
);

-- project member table
CREATE TABLE IF NOT EXISTS member(
  member_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_FK uuid NOT NULL,
  project_id_FK uuid NOT NULL,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT project_id_FK
    FOREIGN KEY(project_id_FK)
    REFERENCES project(project_id)
    ON DELETE CASCADE
);

-- task table and its under which project
CREATE TABLE IF NOT EXISTS task(
  task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_name VARCHAR(255) NOT NULL,
  task_description TEXT NOT NULL,
  task_type INT NOT NULL DEFAULT 1,
  task_priority INT NOT NULL DEFAULT 3,
  project_id_FK uuid NOT NULL,
  CONSTRAINT project_id_FK
    FOREIGN KEY(project_id_FK)
    REFERENCES project(project_id)
    ON DELETE CASCADE
);

-- task allocation
CREATE TABLE IF NOT EXISTS taskAlloted(
  taskAlloted_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp default current_timestamp,
  user_id_FK uuid NOT NULL, 
  task_id_FK uuid NOT NULL,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT task_id_FK
    FOREIGN KEY(task_id_FK)
    REFERENCES task(task_id)
    ON DELETE CASCADE
);
