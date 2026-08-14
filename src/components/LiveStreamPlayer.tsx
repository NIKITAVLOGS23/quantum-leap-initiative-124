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
  video_type?: "file" | "link" | "vk";
}

interface PlaylistResponse {
  videos: Video[];
  current_index: number;
  offset_seconds: number;
  finished: boolean;
}

const LiveStreamPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstIndexRef = useRef<number | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialOffset, setInitialOffset] = useState(0);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const unmute = () => {
      setMuted(false);
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        video.play().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", unmute, { once: true });
    window.addEventListener("keydown", unmute, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unmute);
      window.removeEventListener("keydown", unmute);
    };
  }, []);

  useEffect(() => {
    fetch(`${PLAYLIST_API}?action=playlist`)
      .then((res) => res.json())
      .then((data: PlaylistResponse) => {
        setVideos(data.videos || []);
        if (data.videos && data.videos.length > 0) {
          setCurrentIndex(data.current_index);
          firstIndexRef.current = data.current_index;
          setInitialOffset(data.offset_seconds || 0);
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
    setCurrentIndex((prev) => (prev + 1 >= videos.length ? 0 : prev + 1));
  };

  const current = videos[currentIndex];
  const isVk = current?.video_type === "vk";

  useEffect(() => {
    const video = videoRef.current;
    if (video && videos.length > 0 && !isVk) {
      video.muted = muted;
      video.load();
      video.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, videos.length, isVk]);

  useEffect(() => {
    if (!isVk || !current) return;
    const offset = currentIndex === firstIndexRef.current ? initialOffset : 0;
    const remaining = Math.max(current.duration_seconds - offset, 1);
    const timeout = setTimeout(handleEnded, remaining * 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVk, currentIndex]);

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
      {isVk ? (
        <div className="bento-player-vk-wrap">
          <iframe
            key={current?.id}
            className="bento-player-video"
            src={`${current?.file_url}&autoplay=1`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title={current?.title || "GOLDTV — прямой эфир"}
          />
          <div className="bento-player-vk-shield bento-player-vk-shield--top" />
          <div className="bento-player-vk-shield bento-player-vk-shield--bl" />
          <div className="bento-player-vk-shield bento-player-vk-shield--br" />
        </div>
      ) : (
        <video
          ref={videoRef}
          className="bento-player-video"
          src={current?.file_url}
          autoPlay
          playsInline
          muted={muted}
          controls
          onEnded={handleEnded}
        />
      )}
    </div>
  );
};

export default LiveStreamPlayer;