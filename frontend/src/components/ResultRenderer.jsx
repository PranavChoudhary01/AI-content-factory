import React, { useState } from "react";

function FlashcardGrid({ cards }) {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c, i) => (
        <button
          key={i}
          onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
          className="text-left p-4 rounded-lg border min-h-[110px] flex items-center"
          style={{ background: flipped[i] ? "#173B36" : "#0F2A4D", borderColor: "#274C77" }}
        >
          <div>
            <div className="text-[10px] tracking-wide uppercase mb-2 text-mint">
              {flipped[i] ? "Answer" : "Question"} · tap to flip
            </div>
            <div className="text-sm text-text-primary">{flipped[i] ? c.back : c.front}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function MindMap({ data }) {
  return (
    <div>
      <div className="inline-block px-4 py-2 rounded-md font-medium mb-4 bg-amber text-[#3A2900]">
        {data.topic}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {data.branches?.map((b, i) => (
          <div key={i} className="p-3 rounded-lg border border-border bg-surface">
            <div className="text-sm font-medium mb-2 text-mint">{b.title}</div>
            <ul className="text-sm space-y-1 text-text-secondary">
              {b.points?.map((p, j) => (
                <li key={j}>· {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultRenderer({ type, result }) {
  if (!result) return null;

  if (type === "notes") {
    return <div className="whitespace-pre-wrap text-sm leading-7 text-text-primary">{result}</div>;
  }

  if (type === "worksheet") {
    return (
      <ol className="space-y-3 list-decimal list-inside text-sm text-text-primary">
        {result.map((q, i) => (
          <li key={i} className="pl-1">
            {q.question} <span className="text-xs text-mint">[{q.marks} marks]</span>
          </li>
        ))}
      </ol>
    );
  }

  if (type === "flashcards") return <FlashcardGrid cards={result} />;

  if (type === "mcqs") {
    return (
      <div className="space-y-4">
        {result.map((q, i) => (
          <div key={i} className="p-3 rounded-lg border border-border bg-surface">
            <div className="text-sm font-medium mb-2 text-text-primary">
              {i + 1}. {q.question}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, j) => (
                <div
                  key={j}
                  className="text-xs px-2 py-1.5 rounded border"
                  style={{
                    borderColor: j === q.answerIndex ? "#5FD8B8" : "#274C77",
                    color: j === q.answerIndex ? "#5FD8B8" : "#AEBBCF",
                  }}
                >
                  {String.fromCharCode(65 + j)}. {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "mindmap") return <MindMap data={result} />;

  if (type === "ppt") {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {result.map((s, i) => (
          <div key={i} className="p-3 rounded-lg border border-border bg-surface">
            <div className="text-[10px] uppercase tracking-wide mb-1 text-amber">Slide {i + 1}</div>
            <div className="text-sm font-medium mb-2 text-text-primary">{s.slideTitle}</div>
            <ul className="text-xs space-y-1 text-text-secondary">
              {s.bullets?.map((b, j) => (
                <li key={j}>· {b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
