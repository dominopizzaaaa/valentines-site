import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="page">
      <motion.div
        className="card glass"
        style={{ textAlign: "center", padding: "40px 32px" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: "8px" }}>🕳️</div>
        <h1 className="title" style={{ fontSize: "clamp(24px, 5vw, 40px)" }}>Wrong page bestie</h1>
        <p className="subtitle" style={{ marginBottom: "22px" }}>nothing here… yet 🥺</p>
        <Link className="btn btn-primary" to="/">go home</Link>
      </motion.div>
    </div>
  );
}
