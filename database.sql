-- CREATE DATABASE taskmanagement;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS invitaion;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS taskAlloted;
DROP TABLE IF EXISTS doingTask;
DROP TABLE IF EXISTS doingTaskAlloted;
DROP TABLE IF EXISTS completedTask;
DROP TABLE IF EXISTS completedTaskAlloted;

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
  user_id_FK uuid,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE
);


-- invitaion table
CREATE TABLE IF NOT EXISTS invitaion(
  invitation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp default current_timestamp,
  user_id_FK uuid,
  project_id_FK uuid,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
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
  user_id_FK uuid,
  project_id_FK uuid,
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
  project_id_FK uuid,
  CONSTRAINT project_id_FK
    FOREIGN KEY(project_id_FK)
    REFERENCES project(project_id)
    ON DELETE CASCADE
);

-- doing table and its under which project
CREATE TABLE IF NOT EXISTS doingTask(
  doingTask_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doingTask_name VARCHAR(255) NOT NULL,
  doingTask_description TEXT NOT NULL,
  project_id_FK uuid,
  CONSTRAINT project_id_FK
    FOREIGN KEY(project_id_FK)
    REFERENCES project(project_id)
    ON DELETE CASCADE
);

-- completed table and its under which project
CREATE TABLE IF NOT EXISTS completedTask(
  completedTask_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  completedTask_name VARCHAR(255) NOT NULL,
  completedTask_description TEXT NOT NULL,
  project_id_FK uuid,
  CONSTRAINT project_id_FK
    FOREIGN KEY(project_id_FK)
    REFERENCES project(project_id)
    ON DELETE CASCADE
);

-- task allocation
CREATE TABLE IF NOT EXISTS taskAlloted(
  taskAlloted_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp default current_timestamp,
  user_id_FK uuid, 
  task_id_FK uuid,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT task_id_FK
    FOREIGN KEY(task_id_FK)
    REFERENCES task(task_id)
    ON DELETE CASCADE
);

-- doingTask allocation
CREATE TABLE IF NOT EXISTS doingTaskAlloted(
  doingTaskAlloted_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp default current_timestamp,
  user_id_FK uuid, 
  doingTask_id_FK uuid,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT doingTask_id_FK
    FOREIGN KEY(doingTask_id_FK)
    REFERENCES doingTask(doingTask_id)
    ON DELETE CASCADE
);

-- completedTask allocation
CREATE TABLE IF NOT EXISTS completedTaskAlloted(
  completedTaskAlloted_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp timestamp default current_timestamp,
  user_id_FK uuid, 
  completedTask_id_FK uuid,
  CONSTRAINT user_id_FK
    FOREIGN KEY(user_id_FK)
	  REFERENCES users(user_id)
    ON DELETE CASCADE,
  CONSTRAINT completedTask_id_FK
    FOREIGN KEY(completedTask_id_FK)
    REFERENCES completedTask(completedTask_id)
    ON DELETE CASCADE
);