-- Your SQL goes here
CREATE TABLE timelines (
  id INTEGER NOT NULL PRIMARY KEY,
  accountID INTEGER,
  serverDomain VARCHAR NOT NULL,
  channel VARCHAR NOT NULL
);