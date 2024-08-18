import playIcon from "@/assets/play.svg";
import { useCallback, useRef, useState } from "react";

const LiveCam = () => {
  const ref = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(false);

  const playVideo = useCallback(() => {
    ref.current?.play().then(() => {
      setPlaying(false);
    });
  }, []);

  return (
    <div className="relative flex justify-center items-center">
      <video
        ref={ref}
        width="640"
        height="480"
        muted
        className="border bg-black"
      >
        <source
          src={`http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_CAM_PORT}`}
          type="video/mp4"
        />
        Your browser does not support the <code>video</code> element.
      </video>
      <button
        className={`absolute ${playing ? "hidden" : ""}`}
        onClick={() => playVideo()}
      >
        <img
          src={playIcon}
          alt="play"
          className="h-20 invert-[90%] hover:invert"
        />
      </button>
    </div>
  );
};

export default LiveCam;
