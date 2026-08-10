const VK_OID = "-204767982";
const VK_ID = "456239111";

const EMBED_URL = `https://vk.com/video_ext.php?oid=${VK_OID}&id=${VK_ID}&hd=2&autoplay=1`;

const LiveStreamPlayer = () => {
  return (
    <div className="bento-player-card bento-player-card--stream">
      <iframe
        className="bento-player-video"
        src={EMBED_URL}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        title="GOLDTV — прямой эфир"
      />
    </div>
  );
};

export default LiveStreamPlayer;
