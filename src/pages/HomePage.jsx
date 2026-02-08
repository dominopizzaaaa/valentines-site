import { useNavigate } from "react-router-dom";
import { occasions, isUnlocked } from "../occasions";
import { useState } from "react";
import "./HomePage.css";

/* ---------- EMOJI SYSTEM ---------- */

function getOccasionEmoji(id) {
  const year = parseInt(id.match(/\d+/)?.[0] || "1", 10);
  const isValentines = id.includes("valentines");

  const emojiSets = [
    { max: 3, emojis: ["💘", "🥺", "🌷"] },
    { max: 7, emojis: ["💞", "🌸", "✨"] },
    { max: 15, emojis: ["❤️‍🔥", "🌹", "💫"] },
    { max: 30, emojis: ["💍", "🕊️", "🌺"] },
    { max: 50, emojis: ["🌳", "🧿", "🪷"] },
    { max: 80, emojis: ["♾️", "🌌", "🌠"] }
  ];

  const set =
    emojiSets.find((s) => year <= s.max) ??
    emojiSets[emojiSets.length - 1];

  // deterministic but varied
  const index = (year + (isValentines ? 1 : 2)) % set.emojis.length;
  return set.emojis[index];
}

/* ---------- CARD ---------- */

function OccasionCard({ o }) {
  const navigate = useNavigate();
  const unlocked = isUnlocked(o.date);

  const [imageError, setImageError] = useState(false);
  const hasImage = o.image && !imageError;

  const emoji = getOccasionEmoji(o.id);

  return (
    <div
      className={`occasion-card glass ${
        unlocked ? "unlocked" : "locked"
      } ${!hasImage ? "no-image" : ""}`}
      onClick={() => {
        if (unlocked && o.routes?.ask) {
          navigate(o.routes.ask);
        } else {
          navigate("/early");
        }
      }}
    >
      {/* IMAGE */}
      {hasImage && (
        <div className="occasion-media">
          <img
            src={o.image}
            alt={o.title}
            className="occasion-image"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="occasion-content">
        <div className="occasion-emoji">{emoji}</div>
        <h3 className="occasion-title">{o.title}</h3>
        <p className="occasion-date">{o.date}</p>
      </div>

      {/* SOFT GLOW */}
      {unlocked && <div className="hover-glow" />}
    </div>
  );
}

/* ---------- PAGE ---------- */

export default function HomePage() {
  return (
    <div className="home-page">
      <h1 className="home-title">our moments ✨</h1>

      <div className="occasion-grid">
        {occasions.map((o) => (
          <OccasionCard key={o.id} o={o} />
        ))}
      </div>
    </div>
  );
}
