import { useEffect, useRef, useState } from "react";

const PLAYLIST_API = "https://functions.poehali.dev/f53e4fe3-cb91-4242-9d46-36eb7f1f83da";
const VK_OID = "-204767982";
const VK_ID = "456239111";
const VK_EMBED_URL = `https://vk.com/video_ext.php?oid=${VK_OID}&id=${VK_ID}&hd=2&autoplay=1`;

interface Video {
  id: number;
  title: string;
  file_url: string;
  duration_seconds: number;
}

interface PlaylistResponse {
  videos: Video[];
  current_index: number;
  offset_seconds: number;
}

const LiveStreamPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const syncedRef = useRef(false);

  useEffect(() => {
    fetch(`${PLAYLIST_API}?action=playlist`)
      .then((res) => res.json())
      .then((data: PlaylistResponse) => {
        setVideos(data.videos || []);
        if (data.videos && data.videos.length > 0) {
          setCurrentIndex(data.current_index);
          syncedRef.current = false;
          requestAnimationFrame(() => {
            const video = videoRef.current;
            if (video) {
              video.currentTime = data.offset_seconds;
              video.play().catch(() => {});
            }
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && videos.length > 0) {
      video.load();
      video.play().catch(() => {});
    }
  }, [currentIndex, videos.length]);

  if (loading) {
    return (
      <div className="bento-player-card bento-player-card--stream">
        <div className="bento-player-overlay">
          <div className="bento-player-icon">📺</div>
          <h3>Подключаемся к эфиру…</h3>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bento-player-card bento-player-card--stream">
        <iframe
          className="bento-player-video"
          src={VK_EMBED_URL}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          title="GOLDTV — прямой эфир"
        />
      </div>
    );
  }

  return (
    <div className="bento-player-card bento-player-card--stream">
      <video
        ref={videoRef}
        className="bento-player-video"
        src={videos[currentIndex]?.file_url}
        autoPlay
        playsInline
        controls
        onEnded={handleEnded}
      />
    </div>
  );
};

export default LiveStreamPlayer;
