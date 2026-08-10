import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Icon from "@/components/ui/icon";

const STREAM_URL = "https://functions.poehali.dev/2260d021-d0a2-400c-9820-aed4f0c0acd1?file=stream.m3u8";

const LiveStreamPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "live" | "offline">("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const handlePlaying = () => setStatus("live");
    video.addEventListener("playing", handlePlaying);

    if (Hls.isSupported()) {
      hls = new Hls({ liveSyncDuration: 6 });
      hls.loadSource(STREAM_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setStatus("offline");
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => setStatus("offline"));
    } else {
      setStatus("offline");
    }

    return () => {
      video.removeEventListener("playing", handlePlaying);
      hls?.destroy();
    };
  }, []);

  return (
    <div className="bento-player-card bento-player-card--stream">
      {status !== "live" && (
        <div className="bento-player-overlay">
          <div className="bento-player-icon">📺</div>
          <h3>{status === "loading" ? "Подключаемся к эфиру…" : "Эфир временно недоступен"}</h3>
          <p>
            {status === "loading"
              ? "Секунду, идёт загрузка потока"
              : "Мы уже знаем и скоро всё починим — попробуйте обновить страницу"}
          </p>
        </div>
      )}
      <video
        ref={videoRef}
        className="bento-player-video"
        playsInline
        autoPlay
        muted
        controls
        style={{ display: status === "live" ? "block" : "none" }}
      />
      {status === "live" && (
        <button
          className="bento-player-unmute"
          onClick={(e) => {
            const video = videoRef.current;
            if (!video) return;
            video.muted = !video.muted;
            e.currentTarget.blur();
          }}
        >
          <Icon name="Volume2" size={16} />
          Звук
        </button>
      )}
    </div>
  );
};

export default LiveStreamPlayer;