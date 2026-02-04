import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./AskPage.css";

export default function AskPage() {
  const navigate = useNavigate();

  // CONFIG
  const MAX_NO = 5;

  // Subtitle text that changes on each NO
  const subtitleTexts = [
    "pls say yes! 🥺",
    "wait why you press no",
    "what are you doing",
    "u rly dont want to be my valentine?",
    "one more time and im not gonna give u an option anymore."
  ];

  const [noCount, setNoCount] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [celebrate, setCelebrate] = useState(false);

  const noGone = noCount >= MAX_NO;

  const subtitle =
    subtitleTexts[Math.min(noCount, subtitleTexts.length - 1)];

  const noScale = useMemo(() => {
    return Math.max(0.4, 1 - noCount * 0.12);
  }, [noCount]);

  function moveNoButton() {
    const padding = 20;
    const btnSize = 140;

    const maxX = window.innerWidth - btnSize - padding;
    const maxY = window.innerHeight - btnSize - padding;

    setNoPos({
      x: Math.random() * maxX + padding,
      y: Math.random() * maxY + padding
    });
  }

  function handleNo() {
    setEscaped(true);
    setNoCount((c) => c + 1);
    moveNoButton();
  }

  function handleYes() {
    setCelebrate(true);
    setTimeout(() => {
      navigate("/itinerary");
    }, 1800);
  }

  return (
    <div className="ask-page">
      <div className="bg-glow" />

      {/* 🎉 Confetti + Hearts */}
      <AnimatePresence>
        {celebrate && (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="confetti"
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  opacity: 1
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}

            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                className="heart"
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  opacity: 1
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight - 200,
                  opacity: 0
                }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              >
                💖
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main card */}
      <div className="ask-card glass">
        <img src="/us.jpg" alt="Us" className="ask-photo" />

        <h1 className="ask-title">hi poop! will u be my valentine?</h1>

        <motion.p
          key={subtitle}
          className="ask-subtitle"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {subtitle}
        </motion.p>

        <div className="ask-actions">
          <button className="btn btn-primary" onClick={handleYes}>
            Yes 💘
          </button>

          {!escaped && !noGone && (
            <button className="btn btn-danger" onClick={handleNo}>
              No
            </button>
          )}
        </div>

        {noGone && (
          <motion.div
            className="ask-plea"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            just say yes poopie 🥺
          </motion.div>
        )}
      </div>

      {/* Escaped NO button (always says "No") */}
      {escaped && !noGone && (
        <motion.button
          className="btn btn-danger ask-no-fixed"
          onClick={handleNo}
          animate={{
            x: noPos.x,
            y: noPos.y,
            scale: noScale
          }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          No
        </motion.button>
      )}
    </div>
  );
}
