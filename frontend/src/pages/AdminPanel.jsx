import React, { useEffect, useState } from "react";
import { FileText, BarChart3 } from "lucide-react";
import client from "../api/client";

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="max-w-5xl mx-auto px-5 py-10 text-sm text-text-muted">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-semibold text-text-primary font-display mb-1">Stats</h1>
      <p className="text-sm text-text-muted mb-8">Platform-wide content generation overview.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-panel border border-line flex items-center gap-3">
          <FileText size={18} className="text-amber" />
          <div>
            <p className="text-lg font-medium text-text-primary">{stats?.totalContent ?? 0}</p>
            <p className="text-xs text-text-muted">Content generated</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-panel border border-line">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-mint" />
            <p className="text-xs text-text-muted">By type</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats?.byType?.map((t) => (
              <span key={t.type} className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-secondary capitalize">
                {t.type}: {t.count}
              </span>
            ))}
            {(!stats?.byType || stats.byType.length === 0) && (
              <span className="text-xs text-text-muted">No data yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
