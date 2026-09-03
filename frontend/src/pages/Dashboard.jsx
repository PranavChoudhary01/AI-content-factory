import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, ArrowRight } from "lucide-react";
import client from "../api/client";

export default function Dashboard() {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/content/history")
      .then((res) => setRecent(res.data.slice(0, 5)))
      .catch(() => setRecent([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold text-text-primary font-display mb-1">Dashboard</h1>
      <p className="text-sm text-text-muted mb-8">Quick access to content generation and history.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          to="/factory"
          className="p-5 rounded-xl border border-line bg-panel hover:border-mint transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-text-primary mb-1">Generate content</p>
            <p className="text-xs text-text-muted">Notes, worksheets, MCQs and more</p>
          </div>
          <ArrowRight size={16} className="text-mint" />
        </Link>
        <Link
          to="/history"
          className="p-5 rounded-xl border border-line bg-panel hover:border-mint transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-text-primary mb-1">View history</p>
            <p className="text-xs text-text-muted">Everything you've generated so far</p>
          </div>
          <ArrowRight size={16} className="text-mint" />
        </Link>
      </div>

      <h2 className="text-sm uppercase tracking-wide text-text-muted mb-3">Recent activity</h2>
      {loading && <p className="text-sm text-text-muted">Loading...</p>}
      {!loading && recent.length === 0 && (
        <p className="text-sm text-text-muted">Nothing generated yet. Head to the content factory to get started.</p>
      )}
      <div className="space-y-2">
        {recent.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 p-3 rounded-lg border border-line bg-panel"
          >
            <FileText size={16} className="text-mint shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{item.topic}</p>
              <p className="text-xs text-text-muted capitalize">{item.type} · grade {item.grade}</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Clock size={12} />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
