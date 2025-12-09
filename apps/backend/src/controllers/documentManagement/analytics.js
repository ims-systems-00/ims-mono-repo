const AnalyticsService = require("../../services/analytics");
exports.overview = async (req, res, next) => {
  try {
    const analytics = new AnalyticsService(req.accessControl);
    let overview = await analytics.analyzeDocumentManagement();
    res.status(200).json({ message: "Overview retrival success.", overview });
  } catch (err) {
    next(err);
  }
};
