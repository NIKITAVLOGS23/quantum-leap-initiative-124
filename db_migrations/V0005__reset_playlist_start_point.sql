UPDATE t_p99124966_quantum_leap_initiat.playlist_videos
SET created_at = NOW()
WHERE created_at = (SELECT MIN(created_at) FROM t_p99124966_quantum_leap_initiat.playlist_videos);