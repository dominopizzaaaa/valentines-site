import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AskPage from "./pages/AskPage.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <MusicPlayer />

      <Routes>
        <Route path="/" element={<AskPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}
