import jsPDF from "jspdf";

const TYPE_LABELS = {
  notes: "Notes",
  worksheet: "Worksheet",
  flashcards: "Flashcards",
  mcqs: "MCQs",
  mindmap: "Mind Map",
  ppt: "PPT Outline",
};

function addWrapped(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

export function exportContentToPdf({ type, topic, grade, result }) {
  const doc = new jsPDF();
  const x = 15;
  let y = 20;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  y = addWrapped(doc, `${topic} \u2014 ${TYPE_LABELS[type] || type}`, x, y, 180, 8);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  y = addWrapped(doc, `Grade: ${grade}`, x, y + 2, 180, 6) + 6;

  doc.setFontSize(12);

  if (type === "notes") {
    y = addWrapped(doc, result, x, y, 180, 6);
  } else if (type === "worksheet") {
    result.forEach((q, i) => {
      y = addWrapped(doc, `${i + 1}. ${q.question} [${q.marks} marks]`, x, y, 180, 6) + 2;
    });
  } else if (type === "flashcards") {
    result.forEach((c, i) => {
      y = addWrapped(doc, `${i + 1}. Q: ${c.front}`, x, y, 180, 6);
      y = addWrapped(doc, `    A: ${c.back}`, x, y, 180, 6) + 2;
    });
  } else if (type === "mcqs") {
    result.forEach((q, i) => {
      y = addWrapped(doc, `${i + 1}. ${q.question}`, x, y, 180, 6);
      q.options.forEach((opt, j) => {
        const mark = j === q.answerIndex ? " (correct)" : "";
        y = addWrapped(doc, `    ${String.fromCharCode(65 + j)}. ${opt}${mark}`, x, y, 180, 6);
      });
      y += 2;
    });
  } else if (type === "mindmap") {
    y = addWrapped(doc, `Topic: ${result.topic}`, x, y, 180, 6) + 2;
    result.branches?.forEach((b) => {
      y = addWrapped(doc, `- ${b.title}`, x, y, 180, 6);
      b.points?.forEach((p) => {
        y = addWrapped(doc, `    \u2022 ${p}`, x, y, 180, 6);
      });
      y += 2;
    });
  } else if (type === "ppt") {
    result.forEach((s, i) => {
      y = addWrapped(doc, `Slide ${i + 1}: ${s.slideTitle}`, x, y, 180, 6);
      s.bullets?.forEach((b) => {
        y = addWrapped(doc, `    \u2022 ${b}`, x, y, 180, 6);
      });
      y += 2;
    });
  }

  const safeName = topic.replace(/[^a-z0-9]+/gi, "_");
  doc.save(`${safeName}_${type}.pdf`);
}
