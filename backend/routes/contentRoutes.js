const express = require("express");
const { generate, getHistory, deleteHistoryItem } = require("../controllers/contentController");

const router = express.Router();

router.post("/generate", generate);
router.get("/history", getHistory);
router.delete("/history/:id", deleteHistoryItem);

module.exports = router;
