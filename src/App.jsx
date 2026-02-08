import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import AskPage from "./pages/AskPage.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import TooEarly from "./pages/TooEarly.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <MusicPlayer />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* 1st Valentines */}
        <Route path="/1stvalentines/ask" element={<AskPage />} />
        <Route path="/1stvalentines/itinerary" element={<ItineraryPage />} />

        {/* Locked page */}
        <Route path="/early" element={<TooEarly />} />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}
