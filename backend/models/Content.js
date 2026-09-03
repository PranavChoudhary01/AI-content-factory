const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    grade: { type: String, required: true },
    type: {
      type: String,
      enum: ["notes", "worksheet", "flashcards", "mcqs", "mindmap", "ppt"],
      required: true,
    },
    result: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
