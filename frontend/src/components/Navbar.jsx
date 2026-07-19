import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-line bg-panel">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber" />
          <span className="text-xs tracking-[0.2em] uppercase text-amber">LearnKins</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/dashboard" className="text-text-secondary hover:text-text-primary">
            Dashboard
          </Link>
          <Link to="/factory" className="text-text-secondary hover:text-text-primary">
            Content factory
          </Link>
          <Link to="/history" className="text-text-secondary hover:text-text-primary">
            History
          </Link>
          <Link to="/admin" className="text-mint hover:text-mint/80">
            Stats
          </Link>
        </div>
      </div>
    </nav>
  );
}
