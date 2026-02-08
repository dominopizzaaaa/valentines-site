import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const auraRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  function togglePlay() {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  function handleMouseMove(e) {
    const aura = auraRef.current;
    if (!aura) return;

    const rect = aura.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxDist = rect.width / 2;
    const vol = Math.max(0.15, Math.min(1, 1 - dist / maxDist));

    setVolume(vol);
  }

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop />

      <div
        ref={auraRef}
        className={`music-aura ${playing ? "playing" : ""}`}
        onClick={togglePlay}
        onMouseMove={playing ? handleMouseMove : undefined}
        title={playing ? "Click to pause" : "Click to play"}
      >
        <span className="music-symbol">
          {playing ? "♪" : "▶"}
        </span>
      </div>
    </>
  );
}
