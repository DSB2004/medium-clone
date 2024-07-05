
-- DATABASE 
CREATE DATABASE DEV;

USE DEV;

-- TABLES

-- AUTH 
CREATE TABLE AUTH(
  EMAIL VARCHAR(100) PRIMARY KEY
  ,PASSWORD TEXT NOT NULL
  ,NAME VARCHAR(100) NOT NULL
);


-- USERS
CREATE TABLE USERS (
  NAME VARCHAR(100) NOT NULL,
  EMAIL VARCHAR(100) PRIMARY KEY,
  BIO TEXT,
  WORK_TYPE VARCHAR(100),
  PROFILE_PIC TEXT
);


-- SOCIAL LINKS
CREATE TABLE SOCIAL_LINKS(
  USER_EMAIL VARCHAR(100) NOT NULL,
  LINK TEXT NOT NULL,
  FOREIGN KEY (USER_EMAIL) REFERENCES USERS(EMAIL)
);


-- FOLLOWERS
CREATE TABLE FOLLOWERS (
  USER_EMAIL VARCHAR(100) NOT NULL,
  FOLLOWER_EMAIL VARCHAR(100) NOT NULL,
  FOREIGN KEY (USER_EMAIL) REFERENCES USERS(EMAIL),
  FOREIGN KEY (FOLLOWER_EMAIL) REFERENCES USERS(EMAIL),
  PRIMARY KEY (USER_EMAIL, FOLLOWER_EMAIL),
  UNIQUE(USER_EMAIL,FOLLOWER_EMAIL)
);


-- BLOGS

CREATE TABLE BLOGS(
  ID VARCHAR(100) PRIMARY KEY,
  USER_EMAIL VARCHAR(100) NOT NULL,
  HEADER VARCHAR(100) NOT NULL,
  INTRO VARCHAR(100) NOT NULL,
  INTRO_IMAGE TEXT NOT NULL,
  BODY TEXT, 
  CREATED_ON DATE CURRENT_DATE,
  FOREIGN KEY (USER_EMAIL) REFERENCES USERS(EMAIL)
);


-- LIKES

CREATE TABLE BLOG_LIKES(
  BLOG_ID VARCHAR(100) NOT NULL,
  USER_EMAIL VARCHAR(100) NOT NULL,
  FOREIGN KEY (USER_EMAIL) REFERENCES USERS(EMAIL),
  FOREIGN KEY (BLOG_ID) REFERENCES BLOGS(ID),
  PRIMARY KEY (USER_EMAIL, BLOG_ID),
  UNIQUE(USER_EMAIL,BLOG_ID)
);
-- COMMENTS
CREATE TABLE BLOG_COMMENTS(
  ID VARCHAR(100) PRIMARY KEY,
  BLOG_ID VARCHAR(100) NOT NULL,
  USER_EMAIL VARCHAR(100) NOT NULL,
  BODY TEXT,
  CREATED_ON DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (USER_EMAIL) REFERENCES USERS(EMAIL),
  FOREIGN KEY (BLOG_ID) REFERENCES BLOGS(ID)
);

-- BLOG SAVES
CREATE TABLE BLOG_SAVES(
  BLOG_ID VARCHAR(100) NOT NULL,
  USER_EMAIL VARCHAR(100) NOT NULL,
  FOREIGN KEY (USER_EMAIL) REFERENCES USERS(EMAIL),
  FOREIGN KEY (BLOG_ID) REFERENCES BLOGS(ID),
  PRIMARY KEY (USER_EMAIL, BLOG_ID),
  UNIQUE(USER_EMAIL,BLOG_ID)
);


-- IMAGES
CREATE TABLE BLOG_IMAGES(
  BLOG_ID VARCHAR(100) NOT NULL,
  IMAGE_LINK TEXT NOT NULL,
  FOREIGN KEY (BLOG_ID) REFERENCES BLOGS(ID)
);

-- SEARCH KEY 
CREATE TABLE SEARCH_KEY (
  BLOG_ID VARCHAR(100) NOT NULL,
  USER_EMAIL VARCHAR(100) NOT NULL,
  SEARCH_KEY VARCHAR(20) NOT NULL,
  UNIQUE(BLOG_ID,SEARCH_KEY),
  FOREIGN KEY (USER_EMAIL) REFERENCES USERS(EMAIL),
  FOREIGN KEY (BLOG_ID) REFERENCES BLOGS(ID)
);