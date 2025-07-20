# Database Schema Documentation

## Overview
This document describes the current database schema for the VO2Max Training App. The application uses Supabase as the backend database with PostgreSQL.

## Current Schema (Latest)

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public._prisma_migrations (
  id character varying NOT NULL,
  checksum character varying NOT NULL,
  finished_at timestamp with time zone,
  migration_name character varying NOT NULL,
  logs text,
  rolled_back_at timestamp with time zone,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  applied_steps_count integer NOT NULL DEFAULT 0,
  CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id)
);

CREATE TABLE public.biomarkers (
  id text NOT NULL,
  date timestamp without time zone NOT NULL,
  hemoglobin double precision,
  ferritin double precision,
  crp double precision,
  glucose double precision,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  userId uuid NOT NULL,
  CONSTRAINT biomarkers_pkey PRIMARY KEY (id),
  CONSTRAINT biomarkers_userid_fkey FOREIGN KEY (userId) REFERENCES public.user_profiles(id)
);

CREATE TABLE public.pdf_chunks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  filename text,
  chunk_index integer,
  chunk_text text,
  embedding USER-DEFINED,
  CONSTRAINT pdf_chunks_pkey PRIMARY KEY (id)
);

CREATE TABLE public.protocols (
  id text NOT NULL,
  name text NOT NULL,
  vo2maxGain text NOT NULL,
  timeToResults text NOT NULL,
  protocolDuration text NOT NULL,
  fitnessLevel text NOT NULL,
  sportModality text NOT NULL,
  researchPopulation text NOT NULL,
  researchers text NOT NULL,
  institution text NOT NULL,
  location text NOT NULL,
  year text NOT NULL,
  doi text NOT NULL,
  description text,
  howToPerform text,
  intensityControl text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT protocols_pkey PRIMARY KEY (id)
);

CREATE TABLE public.rag_settings (
  key text NOT NULL,
  value text,
  CONSTRAINT rag_settings_pkey PRIMARY KEY (key)
);

CREATE TABLE public.session_metrics (
  id text NOT NULL,
  date timestamp without time zone NOT NULL,
  maxHR integer,
  avgHR integer,
  sessionType text,
  notes text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  userId uuid NOT NULL,
  CONSTRAINT session_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT session_metrics_userid_fkey FOREIGN KEY (userId) REFERENCES public.user_profiles(id)
);

CREATE TABLE public.user_details (
  id uuid NOT NULL,
  age integer,
  weight double precision,
  height double precision,
  race text,
  medical_conditions text,
  medications text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  sex text,
  CONSTRAINT user_details_pkey PRIMARY KEY (id),
  CONSTRAINT user_details_id_fkey FOREIGN KEY (id) REFERENCES public.user_profiles(id)
);

CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  email text,
  name text,
  picture text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_admin boolean DEFAULT false,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_protocols (
  id text NOT NULL,
  protocolId text NOT NULL,
  startDate timestamp without time zone NOT NULL,
  endDate timestamp without time zone,
  isActive boolean NOT NULL DEFAULT true,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  userId uuid NOT NULL,
  CONSTRAINT user_protocols_pkey PRIMARY KEY (id),
  CONSTRAINT user_protocols_userid_fkey FOREIGN KEY (userId) REFERENCES public.user_profiles(id),
  CONSTRAINT user_protocols_protocolId_fkey FOREIGN KEY (protocolId) REFERENCES public.protocols(id)
);

CREATE TABLE public.weekly_metrics (
  id text NOT NULL,
  date timestamp without time zone NOT NULL,
  restingHeartRate integer,
  vo2max double precision,
  notes text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  userId uuid NOT NULL,
  CONSTRAINT weekly_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_metrics_userid_fkey FOREIGN KEY (userId) REFERENCES public.user_profiles(id)
);
```

## Key Tables

### User Management
- **`user_profiles`**: Core user information with admin status
- **`user_details`**: Extended user profile data (age, weight, height, etc.)

### Training Data
- **`weekly_metrics`**: Weekly VO2Max and fitness tracking
- **`session_metrics`**: Individual training session data
- **`biomarkers`**: Blood test results and health markers

### Protocols
- **`protocols`**: Training protocol definitions
- **`user_protocols`**: User assignments to training protocols

### RAG System
- **`pdf_chunks`**: Document chunks for RAG system
- **`rag_settings`**: Configuration for RAG pipeline

## Important Notes

1. **Admin Access**: The `is_admin` column in `user_profiles` determines admin privileges
2. **Foreign Keys**: All user-related tables reference `user_profiles.id`
3. **Timestamps**: Most tables use `createdAt`/`updatedAt` for tracking changes
4. **RAG Integration**: The `pdf_chunks` table stores document embeddings for the RAG system

## Migration Scripts

- `scripts/add-admin-column.sql`: Adds admin column to existing databases
- `scripts/set-admin-status.sql`: Sets admin privileges for specific users 