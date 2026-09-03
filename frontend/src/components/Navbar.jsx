import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-line bg-panel">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <Sparkles size={16} className="text-amber" />
          <span className="text-xs tracking-[0.2em] uppercase text-amber">LearnKins</span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm">
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

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-xs text-text-muted">Hi, {user.name?.split(" ")[0]}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 text-amber hover:text-amber/80">
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
