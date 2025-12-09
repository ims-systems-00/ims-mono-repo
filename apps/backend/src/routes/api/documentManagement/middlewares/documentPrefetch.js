const { DocumentService } = require("../../../../services/documentManagement");
exports.documentPrefetch = async (req, res, next) => {
  let documentService = new DocumentService(req.accessControl);
  let [prefetchError, document] = await documentService.getDocument(
    req.params.id
  );
  if (prefetchError)
    return res.status(400).json({
      message: "Document prefetch failed with the given id",
    });
  res.locals.document = document;
  next();
};
