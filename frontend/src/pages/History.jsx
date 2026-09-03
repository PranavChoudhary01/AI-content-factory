import React, { useEffect, useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Download } from "lucide-react";
import client from "../api/client";
import ResultRenderer from "../components/ResultRenderer";
import { exportContentToPdf } from "../utils/exportPdf";

export default function History() {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    client
      .get("/content/history")
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    await client.delete(`/content/history/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-10">
      <h1 className="text-2xl font-semibold text-text-primary font-display mb-1">History</h1>
      <p className="text-sm text-text-muted mb-8">Everything you've generated, saved automatically.</p>

      {loading && <p className="text-sm text-text-muted">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-text-muted">No content generated yet.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = openId === item._id;
          return (
            <div key={item._id} className="rounded-lg border border-line bg-panel overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <button
                  onClick={() => setOpenId(isOpen ? null : item._id)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  {isOpen ? <ChevronUp size={16} className="text-mint" /> : <ChevronDown size={16} className="text-text-muted" />}
                  <div>
                    <p className="text-sm text-text-primary">{item.topic}</p>
                    <p className="text-xs text-text-muted capitalize">
                      {item.type} · grade {item.grade} · {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                <button onClick={() => remove(item._id)} className="text-text-muted hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-line p-4">
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() =>
                        exportContentToPdf({ type: item.type, topic: item.topic, grade: item.grade, result: item.result })
                      }
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border text-mint hover:bg-mintDark"
                    >
                      <Download size={14} /> Export as PDF
                    </button>
                  </div>
                  <ResultRenderer type={item.type} result={item.result} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
