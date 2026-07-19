const Content = require("../models/Content");

async function getStats(req, res) {
  const [totalContent, byType] = await Promise.all([
    Content.countDocuments(),
    Content.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
  ]);

  res.json({
    totalContent,
    byType: byType.map((t) => ({ type: t._id, count: t.count })),
  });
}

module.exports = { getStats };
