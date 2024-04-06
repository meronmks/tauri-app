-- Your SQL goes here
CREATE TABLE accounts (
  id INTEGER NOT NULL PRIMARY KEY,
  userID VARCHAR NOT NULL,
  displayName VARCHAR NOT NULL,
  userName VARCHAR NOT NULL,
  serverDomain VARCHAR NOT NULL,
  accessToken VARCHAR NOT NULL
);