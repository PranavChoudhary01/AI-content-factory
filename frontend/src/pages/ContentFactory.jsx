import React, { useState } from "react";
import { BookOpen, FileText, Layers, CheckSquare, GitBranch, Presentation, Loader2, RotateCw } from "lucide-react";
import client from "../api/client";
import ResultRenderer from "../components/ResultRenderer";

const CONTENT_TYPES = [
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "worksheet", label: "Worksheet", icon: FileText },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "mcqs", label: "MCQs", icon: CheckSquare },
  { id: "mindmap", label: "Mind map", icon: GitBranch },
  { id: "ppt", label: "PPT outline", icon: Presentation },
];

const STAGES = ["Topic", "Context", "Generate", "Format"];
const GRADES = ["6th", "7th", "8th"];

export default function ContentFactory() {
  const [topic, setTopic] = useState("Fractions");
  const [grade, setGrade] = useState("7th");
  const [type, setType] = useState("notes");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setStage(0);

    const tick = (i) => new Promise((res) => setTimeout(() => { setStage(i); res(); }, 400));
    await tick(1);
    await tick(2);

    try {
      const { data } = await client.post("/content/generate", { topic, grade, type });
      await tick(3);
      setResult(data.result);
    } catch (err) {
      setStage(3);
      setError(err.response?.data?.message || "Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-semibold text-text-primary font-display mb-1">AI Content Factory</h1>
      <p className="text-sm text-text-muted mb-8">
        Pick a topic, grade and format — content is generated and saved to your history.
      </p>

      <div className="flex items-center mb-8">
        {STAGES.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: stage >= i ? "#5FD8B8" : "#1D2D50",
                  boxShadow: stage === i ? "0 0 0 4px rgba(95,216,184,0.18)" : "none",
                }}
              />
              <span className={`text-[10px] uppercase tracking-wide ${stage >= i ? "text-mint" : "text-text-muted"}`}>
                {s}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className="flex-1 h-[1px] mx-2 mb-4" style={{ background: stage > i ? "#5FD8B8" : "#1D2D50" }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wide block mb-2 text-text-muted">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Fractions, Photosynthesis"
              className="w-full px-3 py-2 rounded-md text-sm bg-surface border border-border text-text-primary"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide block mb-2 text-text-muted">Grade</label>
            <div className="flex gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className="px-3 py-1.5 rounded-md text-xs border"
                  style={{
                    background: grade === g ? "#F2B705" : "#0F2A4D",
                    color: grade === g ? "#3A2900" : "#AEBBCF",
                    borderColor: grade === g ? "#F2B705" : "#274C77",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide block mb-2 text-text-muted">Content type</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setType(id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-left border"
                  style={{
                    background: type === id ? "#173B36" : "#0F2A4D",
                    color: type === id ? "#5FD8B8" : "#AEBBCF",
                    borderColor: type === id ? "#5FD8B8" : "#274C77",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium bg-amber text-[#3A2900] disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RotateCw size={16} />}
            {loading ? "Generating..." : "Generate content"}
          </button>

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <div className="rounded-xl p-5 min-h-[380px] bg-panel border border-line">
          {!result && !loading && !error && (
            <div className="h-full flex items-center justify-center text-sm text-text-muted min-h-[340px]">
              Generate button dabao, output yaha aayega
            </div>
          )}
          {loading && (
            <div className="h-full flex items-center justify-center gap-2 text-sm text-text-secondary min-h-[340px]">
              <Loader2 size={16} className="animate-spin" /> {STAGES[stage]} chal raha hai...
            </div>
          )}
          {result && !loading && <ResultRenderer type={type} result={result} />}
        </div>
      </div>
    </div>
  );
}
