ALTER TABLE playlist_videos ADD COLUMN IF NOT EXISTS video_type VARCHAR(10) NOT NULL DEFAULT 'file';
UPDATE playlist_videos SET video_type = 'link' WHERE is_external = true AND video_type = 'file';