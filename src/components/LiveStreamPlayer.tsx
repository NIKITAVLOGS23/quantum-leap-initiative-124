import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const PLAYLIST_API = "https://functions.poehali.dev/f53e4fe3-cb91-4242-9d46-36eb7f1f83da";
const VK_OID = "-204767982";
const VK_ID = "456239113";
const VK_EMBED_URL = `https://vk.com/video_ext.php?oid=${VK_OID}&id=${VK_ID}&hd=2&autoplay=1`;

interface Video {
  id: number;
  title: string;
  file_url: string;
  duration_seconds: number;
  video_type?: "file" | "link" | "vk" | "kinescope";
}

interface PlaylistResponse {
  videos: Video[];
  current_index: number;
  offset_seconds: number;
  finished: boolean;
}

interface Layer {
  key: number;
  video: Video;
  offsetStart: number;
}

interface VideoLayerProps {
  video: Video;
  isTop: boolean;
  isActiveVisual: boolean;
  offsetStart: number;
  muted: boolean;
  onEnded: () => void;
}

const VideoLayer = ({ video, isTop, isActiveVisual, offsetStart, muted, onEnded }: VideoLayerProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const isVk = video.video_type === "vk";
  const isKinescope = video.video_type === "kinescope";
  const isEmbed = isVk || isKinescope;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isEmbed) return;
    const el = ref.current;
    if (!el) return;
    const onLoadedMetadata = () => {
      if (offsetStart > 0) {
        el.currentTime = offsetStart;
      }
      el.muted = muted;
      el.play().catch(() => {});
    };
    el.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    el.load();
    return () => {
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEmbed) return;
    const el = ref.current;
    if (el) el.muted = muted;
  }, [muted, isEmbed]);

  return (
    <div className={`bento-player-crossfade ${isActiveVisual ? "is-active" : ""}`}>
      {isEmbed ? (
        <div className="bento-player-vk-wrap">
          <iframe
            className="bento-player-video"
            src={`${video.file_url}${video.file_url.includes("?") ? "&" : "?"}autoplay=1`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title={video.title || "GOLDTV — прямой эфир"}
          />
          <div className="bento-player-vk-shield bento-player-vk-shield--top" />
          <div className="bento-player-vk-shield bento-player-vk-shield--bl" />
          <div className="bento-player-vk-shield bento-player-vk-shield--br" />
        </div>
      ) : (
        <video
          ref={ref}
          className="bento-player-video"
          src={video.file_url}
          playsInline
          muted={muted}
          controls={!isMobile}
          onEnded={isTop ? onEnded : undefined}
        />
      )}
    </div>
  );
};

const LiveStreamPlayer = () => {
  const layerSeqRef = useRef(0);
  const startedRef = useRef(false);
  const firstIndexRef = useRef<number | null>(null);
  const vkOffsetUsedRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialOffset, setInitialOffset] = useState(0);
  const [muted, setMuted] = useState(true);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    fetch(`${PLAYLIST_API}?action=playlist`)
      .then((res) => res.json())
      .then((data: PlaylistResponse) => {
        setVideos(data.videos || []);
        if (data.videos && data.videos.length > 0) {
          setCurrentIndex(data.current_index);
          firstIndexRef.current = data.current_index;
          setInitialOffset(data.offset_seconds || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1 >= videos.length ? 0 : prev + 1));
  };

  const current = videos[currentIndex];
  const isEmbedVideo = current?.video_type === "vk" || current?.video_type === "kinescope";

  useEffect(() => {
    if (!current) return;
    const key = ++layerSeqRef.current;
    const offsetStart = !startedRef.current ? initialOffset : 0;
    startedRef.current = true;
    setLayers((prev) => [...prev, { key, video: current, offsetStart }]);
    const raf = requestAnimationFrame(() => setActiveKey(key));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, videos.length]);

  useEffect(() => {
    if (activeKey === null) return;
    const timer = setTimeout(() => {
      setLayers((prev) => prev.filter((l) => l.key === activeKey));
    }, 800);
    return () => clearTimeout(timer);
  }, [activeKey]);

  useEffect(() => {
    if (!isEmbedVideo || !current) return;
    const offset =
      currentIndex === firstIndexRef.current && !vkOffsetUsedRef.current ? initialOffset : 0;
    vkOffsetUsedRef.current = true;
    const remaining = Math.max(current.duration_seconds - offset, 1);
    const timeout = setTimeout(handleEnded, remaining * 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmbedVideo, currentIndex]);

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

  const topKey = layers.length > 0 ? layers[layers.length - 1].key : null;

  return (
    <div className="bento-player-card bento-player-card--stream">
      <div ref={stageRef} className="bento-player-stage">
        {layers.map((l) => (
          <VideoLayer
            key={l.key}
            video={l.video}
            isTop={l.key === topKey}
            isActiveVisual={l.key === activeKey}
            offsetStart={l.offsetStart}
            muted={muted}
            onEnded={handleEnded}
          />
        ))}
        <button
          type="button"
          className="bento-player-fullscreen-btn"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Свернуть полноэкранный режим" : "Развернуть на весь экран"}
        >
          <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={18} />
        </button>
        <button
          type="button"
          className="bento-player-sound-btn"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Включить звук" : "Выключить звук"}
        >
          <Icon name={muted ? "VolumeX" : "Volume2"} size={20} />
        </button>
      </div>
    </div>
  );
};

export default LiveStreamPlayer;