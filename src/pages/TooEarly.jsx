// src/pages/TooEarly.jsx
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import "./TooEarly.css";

export default function TooEarly() {
  const fireflies = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2.2,
        dur: 4 + Math.random() * 4
      })),
    []
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.6 + Math.random() * 1.2,
        d: 2 + Math.random() * 3.2,
        delay: Math.random() * 2.5
      })),
    []
  );

  return (
    <div className="tooearly-page">
      {/* ambient layers */}
      <div className="tooearly-bg" />

      {/* drifting aurora ribbons */}
      <motion.div
        className="aurora a1"
        animate={{ x: [0, 30, -10, 0], y: [0, -18, 12, 0], rotate: [0, 6, -4, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora a2"
        animate={{ x: [0, -22, 16, 0], y: [0, 14, -10, 0], rotate: [0, -5, 3, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* twinkling stars */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="star"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          initial={{ opacity: 0.25, scale: s.s }}
          animate={{ opacity: [0.2, 0.85, 0.3], scale: [s.s, s.s * 1.25, s.s] }}
          transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}

      {/* floating fireflies */}
      <AnimatePresence>
        {fireflies.map((f) => (
          <motion.div
            key={f.id}
            className="firefly"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0.0, 0.9, 0.15, 0.75, 0.0],
              x: [0, 18, -10, 14, 0],
              y: [0, -22, 12, -10, 0],
              scale: [0.7, 1.05, 0.85, 1.1, 0.7]
            }}
            transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
          />
        ))}
      </AnimatePresence>

      {/* main card */}
      <motion.div
        className="tooearly-card glass"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="tooearly-top">
          <motion.div
            className="hourglass-wrap"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="hourglass">⏳</div>

            {/* tiny falling sand dots */}
            <motion.div
              className="sand"
              animate={{ y: [0, 26, 0], opacity: [0.0, 1, 0.0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="sand s2"
              animate={{ y: [0, 26, 0], opacity: [0.0, 1, 0.0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
            />
          </motion.div>

          <div className="tooearly-headlines">
            <h1 className="tooearly-title">poop you’re too early!</h1>
            <p className="tooearly-sub">
              cant wait alr ah hehehehe<br />
              good things take time poopy!! 💭
            </p>
          </div>
        </div>

        <div className="tooearly-actions">
          <Link className="btn btn-primary" to="/">
            go back
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
