import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ lessonId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !videoRef.current) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const hlsUrl = `${baseUrl}/stream/${lessonId}/index.m3u8?token=${token}`;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        },
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          // If HLS fails (e.g. m3u8 not found), try direct MP4 fallback
          console.warn("HLS failed, trying fallback...");
          const mp4Url = `${baseUrl}/stream/${lessonId}/video.mp4?token=${token}`;
      video.src = mp4Url; // Direct MP4 fallback
        }
      });
    } 
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
    } else {
      video.src = hlsUrl;
    }
  }, [lessonId]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black shadow-lg aspect-video">
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
