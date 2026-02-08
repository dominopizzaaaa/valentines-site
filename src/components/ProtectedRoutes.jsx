import { Navigate } from "react-router-dom";
import { isUnlocked } from "../occasions";

export default function ProtectedRoute({ date, children }) {
  if (!isUnlocked(date)) {
    return <Navigate to="/early" replace />;
  }
  return children;
}
