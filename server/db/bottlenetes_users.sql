CREATE EXTENSION plpgsql;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;
SET search_path TO public;

CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create a trigger set_updated_at
-- WHEN: BEFORE any updates on the table users
-- WHERE: EACH ROW
-- HOW: Trigger the function update_updated_at_column

/*
$$ Marks the start of a function
New value at updated_at, assign it to the timestamp now()
Return the modified row
plpgsql === Procedural Language for PostGreSQL
*/
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function for user roles
CREATE OR REPLACE FUNCTION auth.role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.jwt.claim.role', true);
END;
$$ LANGUAGE plpgsql;

-- Remove all permissions
REVOKE ALL ON public.users FROM anon, authenticated;

-- Enable Row-Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow all access for Admins
CREATE POLICY "Allow full access for Admins" ON public.users
FOR ALL USING (auth.role() = 'admin');

-- Allow users with the same id to access their own data
CREATE POLICY "Allow admins and individual access to users" ON public.users
FOR SELECT USING (auth.uid() = id);

-- Allow users with the same id to edit their rows
CREATE POLICY "Allow edit access to authorized users" ON public.users
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users with the same id to remove their data
CREATE POLICY "Allow users to delete their own data" ON public.users
FOR DELETE USING (auth.uid() = id);

-- Deny all other access
CREATE POLICY "Deny all other access to users" ON public.users
FOR ALL USING (false);