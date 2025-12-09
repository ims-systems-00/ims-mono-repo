const { TokenStorageService } = require("../services/tokenManagement");

const invalidatePublicAccessToken = async (req, res, next) => {
  const cid = req.header("x-auth-limited-cid");
  const tokenStorageService = new TokenStorageService(req.accessControl);
  try {
    if (cid) {
      await tokenStorageService.deleteToken(cid);
    }
    return next();
  } catch (err) {
    console.error(err);
  }
};
module.exports = { invalidatePublicAccessToken };
