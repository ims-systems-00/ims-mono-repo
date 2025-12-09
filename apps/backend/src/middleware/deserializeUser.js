const { Token, TokenStorageService } = require("../services/tokenManagement");
const {
  RequestUserAccessControlProvider,
} = require("../helpers/requestAccessControlProvider");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

const deserializeUser = async (req, res, next) => {
  let tokenStorageService = new TokenStorageService(req.accessControl);
  const reqAccessControl = new RequestUserAccessControlProvider();
  req.accessControl = reqAccessControl;
  if (process.env.NODE_ENV === "administration") {
    return next();
  }
  const limitedClientID = req.header("x-auth-limited-cid");
  const limitedAccessToken = req.header("x-auth-limited-accesstoken");
  if (limitedAccessToken) {
    try {
      const tokenInfo = await tokenStorageService.getToken({
        _id: limitedClientID,
      });
      if (tokenInfo.value === limitedAccessToken) {
        const { valid, decoded, expired } = await Token.verify(
          tokenInfo.value,
          process.env.JWT_KEY
        );
        if (valid && decoded) {
          reqAccessControl.setExternalID({
            email: decoded.email,
            organizationId: decoded.organizationId,
          });
          reqAccessControl.setUser({
            _id: null,
            organizationId: decoded.organizationId,
          });
          return next();
        }
        if (expired) {
          /**
           * Delete expired token and block limited access to resource.
           */
          await tokenStorageService.deleteToken(tokenInfo._id);
        }
      }
    } catch (error) {
      logger.info(error.message);
      return res
        .status(400)
        .json({ message: "Limited access token authorisation error" });
    }
  }
  const accessToken = req.cookies.__imsat__ || req.header("x-auth-accesstoken");
  if (!accessToken)
    return res
      .status(401)
      .json({ message: "No access token, authorization denied" });

  try {
    const { expired: acessTokenExpired, decoded: decodedAccessToken } =
      await Token.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (decodedAccessToken && !acessTokenExpired) {
      reqAccessControl.setUser(decodedAccessToken.user);
      reqAccessControl.setTimeZone(decodedAccessToken.timeZone);
      return next();
    }
    if (req.cookies.__imsrt__ && (!decodedAccessToken || acessTokenExpired)) {
      return res.status(401).json({ message: "Invalid access token." });
    }
    return res
      .status(440)
      .json({ message: "User unauthorized or login expired" });
  } catch (err) {
    console.error(err);
    res.status(440).json({ message: "User unauthorized or login expired" });
  }
};

module.exports = { deserializeUser };
