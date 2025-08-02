-- Fix replica identity for VerificationToken table
-- This allows DELETE operations on the table

ALTER TABLE "VerificationToken" REPLICA IDENTITY FULL;
