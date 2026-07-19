const Content = require("../models/Content");
const { generateContent } = require("../utils/groq");

async function generate(req, res) {
  try {
    const { topic, grade, type } = req.body;

    if (!topic || !grade || !type) {
      return res.status(400).json({ message: "topic, grade and type are required" });
    }

    const result = await generateContent(type, topic, grade);
    const saved = await Content.create({ topic, grade, type, result });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getHistory(req, res) {
  const items = await Content.find().sort({ createdAt: -1 }).limit(50);
  res.json(items);
}

async function deleteHistoryItem(req, res) {
  const item = await Content.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Not found" });
  }
  await item.deleteOne();
  res.json({ message: "Deleted" });
}

module.exports = { generate, getHistory, deleteHistoryItem };
