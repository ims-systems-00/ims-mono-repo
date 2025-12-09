const { Filters } = require("../../services/utility");
const { trimQuery } = require("../../validations/utils");
const aiService = require("../../services/ai");
exports.createAIResponse = async (req, res,next) => {
  let aiResponsesCrudOps = new aiService.AIResponseCRUDOperations(req.accessControl);
  try {
    let aiResponse = await aiResponsesCrudOps.createAIResponse({
      ...req.body,
      createdBy: req.accessControl.user,
    });
    res.status(200).json({ message: "Ai response created.", aiResponse });
  } catch (err) {
    next(err)
  }
};
exports.getAIResponses = async (req, res, next) => {
  let aiResponsesCrudOps = new aiService.AIResponseCRUDOperations(req.accessControl);
  try {
    let { page, sort, size } = trimQuery(req.query);
    const options = { page: parseInt(page), limit: parseInt(size), sort };
    let filters = new Filters(req, {
      searchFields: ["reference", "title", "opportunityForImprovement"],
    })
      .build()
      .query();
    let query = { ...filters };
    const results = await aiResponsesCrudOps.listAIResponses(query, options);
    res.status(200).json({
      message: "Ai responses retrived.",
      pagination: results.pagination,
      aiResponses: results.aiResponses,
    });
  } catch (err) {
    next(err)
  }
};
exports.getAIResponse = async (req, res, next) => {
  let aiResponsesCrudOps = new aiService.AIResponseCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let aiResponse = await aiResponsesCrudOps.getAIResponse({ _id: id });
    res.status(200).json({ message: "Ai response retrived.", aiResponse });
  } catch (err) {
    next(err)
  }
};
exports.editAIResponse = async (req, res, next) => {
  let aiResponsesCrudOps = new aiService.AIResponseCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let aiResponse = await aiResponsesCrudOps.updateAIResponse(id, {
      ...req.body,
    });
    res.status(200).json({ message: "Ai response updated.", aiResponse });
  } catch (err) {
    next(err)
  }
};
exports.removeAIResponse = async (req, res, next) => {
  let aiResponsesCrudOps = new aiService.AIResponseCRUDOperations(req.accessControl);
  try {
    let { id } = req.params;
    let aiResponse = await aiResponsesCrudOps.deleteAIResponse(id, {
      user: req.accessControl.user,
    });
    res.status(200).json({ message: "Ai response deleted.", aiResponse });
  } catch (err) {
    next(err)
  }
};
