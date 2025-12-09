const adminLicenseRequest = require("../../services/licenseRequest/adminLicenseRequest");

exports.cancelLicenseRequest = async (req, res,next) => {
  let AdminLicenseRequestedManager = new adminLicenseRequest.AdminLicenseRequestedService(req.adminControl);
  try {
    let { id } = req.params;
    let request = await AdminLicenseRequestedManager.cancelRequest(id)
    res.status(200).json({
      message: `Licence request was canceled.`,
      request,
    });
  } catch (error) {
    next(error)
  }
};
exports.approveLicenseRequest = async (req, res,next) => {
    let AminLicenseRequestedManager = new adminLicenseRequest.AdminLicenseRequestedService(req.adminControl);
    try {
      let { id } = req.params;
      let request = await AminLicenseRequestedManager.approveRequest(id)
      res.status(200).json({
        message: `Licence request was approved.`,
        request,
      });
    } catch (error) {
      console.log(error)
      next(error)
    }
  };
