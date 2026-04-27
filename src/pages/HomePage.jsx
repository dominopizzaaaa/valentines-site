import { useNavigate } from "react-router-dom";
import { occasions, isUnlocked } from "../occasions";
import { useState } from "react";
import "./HomePage.css";

const EMOJI_SETS = [
  { max: 3,  emojis: ["💘", "🥺", "🌷"] },
  { max: 7,  emojis: ["💞", "🌸", "✨"] },
  { max: 15, emojis: ["❤️‍🔥", "🌹", "💫"] },
  { max: 30, emojis: ["💍", "🕊️", "🌺"] },
  { max: 50, emojis: ["🌳", "🧿", "🪷"] },
  { max: 80, emojis: ["♾️", "🌌", "🌠"] },
];

function cardEmoji(id) {
  const year = parseInt(id.match(/\d+/)?.[0] ?? "1", 10);
  const isValentines = id.includes("valentines");
  const set = EMOJI_SETS.find((s) => year <= s.max) ?? EMOJI_SETS.at(-1);
  return set.emojis[(year + (isValentines ? 1 : 2)) % set.emojis.length];
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function OccasionCard({ o }) {
  const navigate = useNavigate();
  const unlocked = isUnlocked(o.date);
  const [imgError, setImgError] = useState(false);
  const hasImg = o.image && !imgError;
  const emoji = cardEmoji(o.id);

  function handleClick() {
    if (unlocked && o.routes?.ask) {
      navigate(o.routes.ask);
    } else {
      navigate("/early");
    }
  }

  return (
    <div
      className={`oc-card glass ${unlocked ? "unlocked" : "locked"}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Lock badge */}
      {!unlocked && <div className="oc-lock">🔒</div>}

      {/* Image */}
      {hasImg ? (
        <div className="oc-img-wrap">
          <img
            src={o.image}
            alt={o.title}
            className="oc-img"
            onError={() => setImgError(true)}
          />
          <div className="oc-img-fade" />
        </div>
      ) : (
        <div className="oc-emoji-hero">{emoji}</div>
      )}

      {/* Info */}
      <div className="oc-info">
        {hasImg && <div className="oc-emoji-small">{emoji}</div>}
        <p className="oc-title">{o.title}</p>
        <p className="oc-date">{formatDate(o.date)}</p>
      </div>

      {/* Hover glow */}
      {unlocked && <div className="oc-glow" />}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">our moments</h1>
        <p className="home-sub">every one, forever ✨</p>
      </div>

      <div className="oc-grid">
        {occasions.map((o) => (
          <OccasionCard key={o.id} o={o} />
        ))}
      </div>
    </div>
  );
}
