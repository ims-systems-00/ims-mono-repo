const express = require("express");
const router = express.Router();
const {
  deleteFile,
  getSignedUrl,
  getDocumentPreview,
  getUploadUrl,
} = require("../../controllers/fileHandler");

// auth middlewares...

// upload documents associated with various modules (tested)
// must have the name and the parameter same , otherwise will reject ...

// download any files from ims storage server ...
// router.get("/", [], downloadFile);
// delete any files from ims server ...
router.delete("/", [], deleteFile);
// get any files signed link from ims server ...
router.get("/signed-url", [], getSignedUrl);
// get any files signed link from ims server ...
router.get("/signed-url/uploads", [], getUploadUrl);
// get document preview pdf from ims server ...
router.get("/document-preview", [], getDocumentPreview);

module.exports = router;
