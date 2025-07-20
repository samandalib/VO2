-- Add function to get unique document count efficiently
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_unique_document_count()
RETURNS TABLE (count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(DISTINCT filename) as count
  FROM public.pdf_chunks;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION get_unique_document_count() TO authenticated; 