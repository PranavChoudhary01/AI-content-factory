const Content = require("../models/Content");
const { generateContent } = require("../utils/groq");

function getDeviceId(req) {
  return req.headers["x-device-id"];
}

async function generate(req, res) {
  try {
    const { topic, grade, type } = req.body;
    const deviceId = getDeviceId(req);

    if (!deviceId) {
      return res.status(400).json({ message: "Missing device id" });
    }
    if (!topic || !grade || !type) {
      return res.status(400).json({ message: "topic, grade and type are required" });
    }

    const result = await generateContent(type, topic, grade);
    const saved = await Content.create({ deviceId, topic, grade, type, result });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getHistory(req, res) {
  const deviceId = getDeviceId(req);
  if (!deviceId) {
    return res.status(400).json({ message: "Missing device id" });
  }
  const items = await Content.find({ deviceId }).sort({ createdAt: -1 }).limit(50);
  res.json(items);
}

async function deleteHistoryItem(req, res) {
  const deviceId = getDeviceId(req);
  const item = await Content.findOne({ _id: req.params.id, deviceId });
  if (!item) {
    return res.status(404).json({ message: "Not found" });
  }
  await item.deleteOne();
  res.json({ message: "Deleted" });
}

module.exports = { generate, getHistory, deleteHistoryItem };
