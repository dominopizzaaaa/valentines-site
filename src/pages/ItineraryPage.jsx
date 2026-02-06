import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./ItineraryPage.css";

const STORAGE_KEY = "valentine_itinerary_v2";

const defaultItems = [
  {
    id: "1",
    time: "6:00",
    title: "Sunrise cycle!",
    note: "what we wanted to do! You ride my bicycle, I ride a rental one hehe",
    image: "/cycle.png",
  },
  {
    id: "2",
    time: "7:30",
    title: "Blanco Court prawn mee",
    note: "the one near your house!",
    image: "/prawn.png",
  },
  {
    id: "2.5",
    time: "9:00",
    title: "Intervals 🏃‍♀️",
    note: "burn some calories before we eat again hehe",
    image: "/intervals.jpg",
  },
  {
    id: "3",
    time: "9:30",
    title: "Nap @ ur hse!",
    note: "we defo need some sleep 😴",
    image: "/sleep.jpg",
  },
  {
    id: "4",
    time: "12:30",
    title: "Tamoya lunch",
    note: "free bc of u yay!",
    image: "/tamoya.jpg",
  },
  {
    id: "5",
    time: "16:30",
    title: "UltraGolf @ Sentosa",
    note: "hopefully not too hot at that time",
    image: "/golf.jpg",
  },
  {
    id: "6",
    time: "18:30",
    title: "Dinner @ Ristorante Luka",
    note: "i think you will like it hehe",
    image: "/luka.png",
  },
  {
    id: "7",
    time: "20:30",
    title: "Movie time @ ur hse (?)",
    note: "we can adjust this as you like",
    image: "/movie.jpg",
  },
];

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultItems;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultItems;
    return parsed;
  } catch {
    return defaultItems;
  }
}

const toMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const dayPartLabel = (time) => {
  const mins = toMinutes(time);
  if (mins < 12 * 60) return "Morning";
  if (mins < 17 * 60) return "Afternoon";
  return "Evening";
};

export default function ItineraryPage() {
  const [revealed, setRevealed] = useState(false);
  const [items, setItems] = useState(() => loadItems());

  const [draftTime, setDraftTime] = useState("12:00");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [draftImage, setDraftImage] = useState("");

  const [lightbox, setLightbox] = useState(null); // { src, title } | null

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  }, [items]);

  // Insert "Morning/Afternoon/Evening" separators automatically
  const timelineBlocks = useMemo(() => {
    const blocks = [];
    let lastPart = null;

    for (const it of sortedItems) {
      const part = dayPartLabel(it.time);
      if (part !== lastPart) {
        blocks.push({ type: "separator", id: `sep-${part}`, label: part });
        lastPart = part;
      }
      blocks.push({ type: "item", id: it.id, item: it });
    }

    return blocks;
  }, [sortedItems]);

  const addItem = () => {
    const title = draftTitle.trim();
    if (!title) return;

    const id = String(Date.now());
    const img = draftImage.trim();

    setItems((prev) => [
      ...prev,
      {
        id,
        time: draftTime,
        title,
        note: draftNote.trim(),
        image: img ? img : null,
      },
    ]);

    setDraftTitle("");
    setDraftNote("");
    setDraftImage("");
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const reset = () => {
    setItems(defaultItems);
  };

  return (
    <div className="it-page">
      <div className="it-glow" />

      <div className="it-shell card glass">
        {/* Header */}
        <div className="it-head">
          <div className="it-head-left">
            <h1 className="it-title">14 Feb Itinerary</h1>
            <p className="it-subtitle">
              u can edit anything, u r the boss! ❤️
            </p>
          </div>

          <div className="it-head-actions">
            <button className="btn btn-ghost" onClick={reset}>
              Reset
            </button>

            {revealed ? (
              <button className="btn btn-ghost" onClick={() => setRevealed(false)}>
                Close envelope
              </button>
            ) : null}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            /* ================= SEALED VIEW ================= */
            <motion.div
              key="sealed"
              className="sealed-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="cover-grid">
                <div className="cover-copy">
                  <div className="cover-pill">💌 Classified</div>
                  <h2 className="cover-title">Open it!</h2>
                  <p className="cover-desc">
                    planned by me hehe
                  </p>
                </div>

                <div className="cover-photo">
                  <div className="polaroid">
                    <img src="/us2.jpg" alt="Us" className="cover-img" />
                    <div className="polaroid-caption">🤍</div>
                  </div>
                </div>
              </div>

              <motion.div
                className="envelope"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="envelope-top" />
                <div className="envelope-body">
                  <div className="seal">💌</div>
                  <div className="sealed-text">Tap to open your plan</div>
                  <button className="btn btn-primary" onClick={() => setRevealed(true)}>
                    Open
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* ================= OPEN VIEW ================= */
            <motion.div
              key="open"
              className="open-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="timeline">
                {timelineBlocks.map((b) => {
                  if (b.type === "separator") {
                    return (
                      <div key={b.id} className="time-sep">
                        <span className="time-sep-line" />
                        <span className="time-sep-pill">{b.label}</span>
                        <span className="time-sep-line" />
                      </div>
                    );
                  }

                  const item = b.item;

                  return (
                    <motion.div
                      key={b.id}
                      className="timeline-row"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="time-badge">{item.time}</div>

                      <div className="event-card">
                        <div
                          className="media"
                          style={
                            item.image
                              ? { "--img": `url(${item.image})` }
                              : undefined
                          }
                        >
                          {item.image ? (
                            <button
                              className="media-btn"
                              onClick={() => setLightbox({ src: item.image, title: item.title })}
                              aria-label="Open image preview"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="media-img"
                                loading="lazy"
                              />
                              <div className="media-zoom">🔍</div>
                            </button>
                          ) : (
                            <div className="media-placeholder">
                              <div className="ph-icon">📷</div>
                            </div>
                          )}
                        </div>

                        <div className="event-body">
                          <div className="event-title">{item.title}</div>
                          <div className="event-note">{item.note}</div>

                          <button
                            className="delete"
                            onClick={() => removeItem(item.id)}
                            aria-label="Delete item"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="divider" />

              <div className="edit-panel">
                <h2 className="section-title">Add your own event</h2>

                <div className="form-grid">
                  <div className="field">
                    <label className="label">Time</label>
                    <input
                      className="input"
                      type="time"
                      value={draftTime}
                      onChange={(e) => setDraftTime(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Title</label>
                    <input
                      className="input"
                      placeholder="e.g., Bubble tea"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                    />
                  </div>

                  <div className="field span-2">
                    <label className="label">Note</label>
                    <input
                      className="input"
                      placeholder="e.g., your craving wins"
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={addItem}>
                    Add
                  </button>
                  <button className="btn btn-ghost" onClick={() => setRevealed(false)}>
                    Close envelope
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox (portal to body so it centers in the viewport) */}
        {createPortal(
          <AnimatePresence>
            {lightbox && (
              <motion.div
                className="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightbox(null)}
              >
                <motion.div
                  className="lightbox-card"
                  initial={{ scale: 0.98, y: 10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.98, y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="lightbox-top">
                    <div className="lightbox-title">{lightbox.title}</div>
                    <button className="lightbox-close" onClick={() => setLightbox(null)}>
                      ×
                    </button>
                  </div>
                  <img className="lightbox-img" src={lightbox.src} alt={lightbox.title} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </div>
  );
}
