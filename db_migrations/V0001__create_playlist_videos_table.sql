CREATE TABLE IF NOT EXISTS playlist_videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_key VARCHAR(500) NOT NULL,
    file_url TEXT NOT NULL,
    duration_seconds NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playlist_videos_sort_order ON playlist_videos (sort_order);
