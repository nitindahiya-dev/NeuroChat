-- Your SQL goes here
ALTER TABLE groups ADD COLUMN members JSONB NOT NULL DEFAULT '[]';
