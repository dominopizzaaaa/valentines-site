import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./AskPage.css";

const MAX_NO = 5;

const NO_LINES = [
  "pls say yes! 🥺",
  "wait why you press no",
  "what are you doing",
  "u rly dont want to be my valentine?",
  "one more time and im not gonna give u an option anymore.",
];

function CelebrationParticles() {
  const particles = useMemo(() => Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * window.innerWidth * 1.4,
    y: (Math.random() - 0.5) * window.innerHeight * 1.4,
    isHeart: i < 14,
    rotate: Math.random() * 360,
    scale: 0.6 + Math.random() * 0.8,
    delay: Math.random() * 0.4,
  })), []);

  return (
    <>
      {particles.map((p) =>
        p.isHeart ? (
          <motion.div
            key={`h-${p.id}`}
            className="celebration-heart"
            initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale * 1.3 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: p.delay }}
          >
            💖
          </motion.div>
        ) : (
          <motion.div
            key={`c-${p.id}`}
            className="celebration-confetti"
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
            transition={{ duration: 1.2, ease: "easeOut", delay: p.delay }}
          />
        )
      )}
    </>
  );
}

export default function AskPage() {
  const navigate = useNavigate();
  const [noCount, setNoCount] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [celebrate, setCelebrate] = useState(false);

  const noGone = noCount >= MAX_NO;
  const subtitle = NO_LINES[Math.min(noCount, NO_LINES.length - 1)];
  const noScale = Math.max(0.35, 1 - noCount * 0.13);

  function moveNoButton() {
    const pad = 24;
    const btnW = 130;
    const btnH = 52;
    setNoPos({
      x: pad + Math.random() * (window.innerWidth - btnW - pad * 2),
      y: pad + Math.random() * (window.innerHeight - btnH - pad * 2),
    });
  }

  function handleNo() {
    setEscaped(true);
    setNoCount((c) => c + 1);
    moveNoButton();
  }

  function handleYes() {
    setCelebrate(true);
    setTimeout(() => navigate("/1stvalentines/itinerary"), 1800);
  }

  return (
    <div className="ask-page">
      {/* Celebration burst */}
      <AnimatePresence>
        {celebrate && (
          <div className="celebrate-origin">
            <CelebrationParticles />
          </div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <motion.div
        className="ask-card glass"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Photo */}
        <div className="ask-photo-wrap">
          <img src="/us.jpg" alt="Us" className="ask-photo" />
          <div className="ask-photo-shine" />
        </div>

        {/* Text */}
        <div className="ask-text">
          <h1 className="ask-title">hi poop!</h1>
          <p className="ask-question">will u be my valentine? 💘</p>

          <AnimatePresence mode="wait">
            <motion.p
              key={subtitle}
              className="ask-subtitle"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              {subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="ask-actions">
          <motion.button
            className="btn btn-primary ask-yes"
            onClick={handleYes}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            Yes, always 💘
          </motion.button>

          {!escaped && !noGone && (
            <motion.button
              className="btn btn-ghost ask-no-inline"
              onClick={handleNo}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              No
            </motion.button>
          )}
        </div>

        {noGone && (
          <motion.p
            className="ask-plea"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            just say yes poopie 🥺
          </motion.p>
        )}
      </motion.div>

      {/* Escaped NO button */}
      <AnimatePresence>
        {escaped && !noGone && (
          <motion.button
            className="btn btn-ghost ask-no-floating"
            onClick={handleNo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: noPos.x, y: noPos.y, scale: noScale }}
            transition={{ type: "spring", stiffness: 480, damping: 22 }}
          >
            No
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
