import React, { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [volume, setVolume] = useState(0.4);

  // Apply volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Try autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryAutoplay = async () => {
      try {
        await audio.play();
        setPlaying(true);
        setReady(true);
      } catch {
        // Autoplay blocked
        setPlaying(false);
        setReady(false);

        // Resume on first user interaction
        const resume = async () => {
          try {
            await audio.play();
            setPlaying(true);
            setReady(true);
          } catch {}
          window.removeEventListener("click", resume);
        };

        window.addEventListener("click", resume);
      }
    };

    tryAutoplay();
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
        setReady(true);
      } catch {
        setReady(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
      setReady(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
        preload="auto"
      />

      <div className="music-widget glass">
        <div className="music-title">♪ Background music</div>

        <button className="btn btn-ghost" onClick={toggle}>
          {playing ? "Pause" : ready ? "Play" : "Tap to Play"}
        </button>

        <div className="music-row">
          <label className="music-label">Vol</label>
          <input
            className="music-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </>
  );
}
