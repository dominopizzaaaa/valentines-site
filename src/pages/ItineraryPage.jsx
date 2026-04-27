import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { itinerary1stValentines } from "../data/itinerary-1stvalentines";
import "./ItineraryPage.css";

const STORAGE_KEY = "valentine_itinerary_v2";

/* ─── helpers ─── */

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return itinerary1stValentines;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : itinerary1stValentines;
  } catch {
    return itinerary1stValentines;
  }
}

function toMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function dayPart(time) {
  const m = toMinutes(time);
  if (m < 12 * 60) return "Morning";
  if (m < 17 * 60) return "Afternoon";
  return "Evening";
}

function buildTimeline(items) {
  const sorted = [...items].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  const blocks = [];
  let lastPart = null;
  for (const item of sorted) {
    const part = dayPart(item.time);
    if (part !== lastPart) {
      blocks.push({ type: "sep", id: `sep-${part}`, label: part });
      lastPart = part;
    }
    blocks.push({ type: "item", id: item.id, item });
  }
  return blocks;
}

/* ─── sub-components ─── */

function Lightbox({ src, title, onClose }) {
  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          className="lb-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="lb-card"
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lb-header">
              <span className="lb-title">{title}</span>
              <button className="lb-close" onClick={onClose}>✕</button>
            </div>
            <img className="lb-img" src={src} alt={title} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function EventCard({ item, onDelete, onZoom }) {
  return (
    <motion.div
      className="ev-row"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="ev-time">{item.time}</div>

      <div className="ev-card">
        {item.image ? (
          <button
            className="ev-img-btn"
            onClick={() => onZoom(item.image, item.title)}
            aria-label="Preview image"
          >
            <div
              className="ev-img-bg"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <img
              className="ev-img"
              src={item.image}
              alt={item.title}
              loading="lazy"
            />
            <div className="ev-zoom-hint">🔍</div>
          </button>
        ) : (
          <div className="ev-no-img">📷</div>
        )}

        <div className="ev-body">
          <p className="ev-title">{item.title}</p>
          {item.note && <p className="ev-note">{item.note}</p>}
          <button
            className="ev-delete"
            onClick={() => onDelete(item.id)}
            aria-label="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AddEventForm({ onAdd, onClose }) {
  const [time, setTime] = useState("12:00");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  function submit() {
    const t = title.trim();
    if (!t) return;
    onAdd({ id: String(Date.now()), time, title: t, note: note.trim(), image: null });
    setTitle("");
    setNote("");
  }

  return (
    <div className="add-panel">
      <h2 className="add-panel-title">Add an event</h2>

      <div className="add-grid">
        <div className="add-field">
          <label className="add-label">Time</label>
          <input
            className="add-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="add-field">
          <label className="add-label">Title</label>
          <input
            className="add-input"
            placeholder="e.g., Bubble tea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        <div className="add-field add-full">
          <label className="add-label">Note</label>
          <input
            className="add-input"
            placeholder="optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
      </div>

      <div className="add-actions">
        <button className="btn btn-primary" onClick={submit}>Add</button>
        <button className="btn btn-ghost" onClick={onClose}>Close envelope</button>
      </div>
    </div>
  );
}

/* ─── main page ─── */

export default function ItineraryPage() {
  const [revealed, setRevealed] = useState(false);
  const [items, setItems] = useState(loadItems);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const timeline = useMemo(() => buildTimeline(items), [items]);

  function addItem(item) {
    setItems((prev) => [...prev, item]);
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="it-page">
      <div className="it-shell glass">
        {/* Header */}
        <div className="it-header">
          <div>
            <h1 className="it-title">14 Feb Itinerary</h1>
            <p className="it-sub">u can edit anything, u r the boss! ❤️</p>
          </div>
          <div className="it-header-actions">
            <button className="btn btn-ghost btn-small" onClick={() => setItems(itinerary1stValentines)}>
              Reset
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            /* ── SEALED ── */
            <motion.div
              key="sealed"
              className="sealed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="sealed-grid">
                <div className="sealed-copy">
                  <span className="sealed-tag">💌 Classified</span>
                  <h2 className="sealed-heading">Open it!</h2>
                  <p className="sealed-desc">planned by me hehe</p>
                </div>
                <div className="sealed-photo">
                  <div className="polaroid">
                    <img src="/us2.jpg" alt="Us" className="polaroid-img" />
                    <p className="polaroid-caption">🤍</p>
                  </div>
                </div>
              </div>

              <motion.div
                className="envelope"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
              >
                <div className="env-flap" />
                <div className="env-body">
                  <div className="env-seal">💌</div>
                  <p className="env-text">Tap to open your plan</p>
                  <button className="btn btn-primary" onClick={() => setRevealed(true)}>
                    Open
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* ── OPEN ── */
            <motion.div
              key="open"
              className="open"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="timeline">
                {timeline.map((b) =>
                  b.type === "sep" ? (
                    <div key={b.id} className="tl-sep">
                      <span className="tl-sep-line" />
                      <span className="tl-sep-label">{b.label}</span>
                      <span className="tl-sep-line" />
                    </div>
                  ) : (
                    <EventCard
                      key={b.id}
                      item={b.item}
                      onDelete={removeItem}
                      onZoom={(src, title) => setLightbox({ src, title })}
                    />
                  )
                )}
              </div>

              <div className="it-divider" />

              <AddEventForm onAdd={addItem} onClose={() => setRevealed(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Lightbox
        src={lightbox?.src}
        title={lightbox?.title}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
