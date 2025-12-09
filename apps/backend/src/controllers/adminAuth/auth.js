const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { Auth } = require("../../services/adminAuth");
const { StatusCodes } = require("http-status-codes");
exports.login = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { email, password } = req.body;
    const authService = new Auth();
    const authResponse = await authService.authenticateIdentity({
      availableToken: cookies.__imsrt__,
      email,
      password,
      userAgent: req.get("user-agent") || "",
    });
    if (cookies.__imsrt__) {
      logger.info("found cookie in login. clearing now...");
      res.clearCookie("__imsrt__", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }
    res.cookie("__imsrt__", authResponse.adminRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    return res.status(StatusCodes.OK).json({
      message: "Login successful.",
      details: { ...authResponse },
    });
  } catch (error) {
    next(error);
  }
};
exports.adminRefreshToken = async (req, res, next) => {
  try {
    const adminRefreshToken =
      req.cookies.__imsrt__ || req.header("x-admin-refreshtoken");
    const authService = new Auth();
    const newTokens = await authService.handleRefreshToken(adminRefreshToken);
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("__imsrt__", newTokens.adminRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    return res.status(StatusCodes.OK).json({
      message: "New pair of newTokens granted.",
      details: { tokenRefresh: true, ...newTokens },
    });
  } catch (error) {
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const adminRefreshToken =
      req.cookies.__imsrt__ || req.header("x-admin-refreshtoken");
    const authService = new Auth();
    const admin = await authService.invalidateRefreshToken(adminRefreshToken);
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(StatusCodes.OK).json({
      message: "Provided token pair invalidated.",
    });
  } catch (error) {
    next(error);
  }
};
