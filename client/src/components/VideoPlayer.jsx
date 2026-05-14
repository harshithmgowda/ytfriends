import { useMemo } from "react";
import YouTube from "react-youtube";

export const getYouTubeId = (input = "") => {
  if (!input) return "dQw4w9WgXcQ";
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

  const match = input.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || "dQw4w9WgXcQ";
};

const VideoPlayer = ({ videoUrl, onReady, onStateChange, className = "" }) => {
  const videoId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);

  return (
    <div className={`overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/30 ${className}`}>
      <YouTube
        videoId={videoId}
        onReady={onReady}
        onStateChange={onStateChange}
        opts={{
          width: "100%",
          height: "520",
          playerVars: {
            modestbranding: 1,
            rel: 0,
            controls: 1,
            iv_load_policy: 3
          }
        }}
      />
    </div>
  );
};

export default VideoPlayer;

