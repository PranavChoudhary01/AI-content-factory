const PROMPT_BUILDERS = {
  notes: (topic, grade) =>
    `You are LearnKins' AI Content Factory, generating NCERT-aligned study material for a grade ${grade} student. Topic: "${topic}". Write clear, well-organized notes with 4-6 short headed sections. Return plain text only, no markdown fences.`,

  worksheet: (topic, grade) =>
    `You are LearnKins' AI Content Factory. Grade ${grade}, topic "${topic}". Create a worksheet of 6 practice questions with increasing difficulty. Return ONLY valid JSON, no markdown fences: [{"question": string, "marks": number}]`,

  flashcards: (topic, grade) =>
    `You are LearnKins' AI Content Factory. Grade ${grade}, topic "${topic}". Create 6 flashcards. Return ONLY valid JSON, no markdown fences: [{"front": string, "back": string}]`,

  mcqs: (topic, grade) =>
    `You are LearnKins' AI Content Factory. Grade ${grade}, topic "${topic}". Create 5 multiple choice questions. Return ONLY valid JSON, no markdown fences: [{"question": string, "options": [string,string,string,string], "answerIndex": number}]`,

  mindmap: (topic, grade) =>
    `You are LearnKins' AI Content Factory. Grade ${grade}, topic "${topic}". Create a mind map: main topic plus 3-4 branches, each with 2-3 sub-points. Return ONLY valid JSON, no markdown fences: {"topic": string, "branches": [{"title": string, "points": [string]}]}`,

  ppt: (topic, grade) =>
    `You are LearnKins' AI Content Factory. Grade ${grade}, topic "${topic}". Create a 6-slide presentation outline. Return ONLY valid JSON, no markdown fences: [{"slideTitle": string, "bullets": [string]}]`,
};

async function generateContent(type, topic, grade) {
  const buildPrompt = PROMPT_BUILDERS[type];
  if (!buildPrompt) {
    throw new Error(`Unsupported content type: ${type}`);
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: buildPrompt(topic, grade) }],
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "";

  if (type === "notes") return raw;

  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Model returned malformed JSON, try generating again");
  }
}

module.exports = { generateContent };
