import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <div className="card glass">
        <h1 className="title">404</h1>
        <p className="subtitle">Wrong page bestie.</p>
        <Link className="btn btn-primary" to="/">
          Go back
        </Link>
      </div>
    </div>
  );
}
