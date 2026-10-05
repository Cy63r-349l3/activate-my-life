-- ============================================================
-- ACTIVATE MY LIFE: Storage Upload Permissions Fix
-- Run this in your Supabase SQL Editor to allow avatar uploads
-- ============================================================

-- Allow anyone to view the avatars
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Allow logged in users to upload new avatars
CREATE POLICY "Users can upload avatars."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Allow logged in users to update their existing avatars
CREATE POLICY "Users can update their avatars."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
