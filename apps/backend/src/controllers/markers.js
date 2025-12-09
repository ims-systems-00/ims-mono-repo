const MarkerService = require("../services/marker");
exports.markForDelete = async (req, res) => {
  let module = req.header("x-moduleType");
  let marker = new MarkerService(req.accessControl, module);
  let updateResult = await marker.markForDelete({ ...req.query });
  return res
    .status(200)
    .json({ message: "Data were marked for delete.", updateResult });
};
exports.markAsDelete = async (req, res) => {
  let module = req.header("x-moduleType");
  let marker = new MarkerService(req.accessControl, module);
  let updateResult = await marker.markAsDelete({ ...req.query });
  return res.status(200).json({ message: "Data were deleted.", updateResult });
};
