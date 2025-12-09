const UserModel = require("../models/mongodb/system/users&auth/user");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../email/sendMail");
const { Token } = require("../services/tokenManagement");
const { RegistrationService, AuthService } = require("../services/v3Auth");
const { StatusCodes } = require("http-status-codes");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { URLSearchParams } = require("url");
const { KNOWN_HOSTS } = require("../helpers/knownHosts");

exports.startRegistration = async (req, res, next) => {
  try {
    const registrationService = new RegistrationService();
    const registration = await registrationService.startRegistration({
      ...req.body,
      clientUrl: req.headers.origin,
    });
    return res.status(StatusCodes.OK).json({
      message: "Registration Process Started.",
      ...registration,
    });
  } catch (error) {
    next(error);
  }
};
exports.signIn = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const userAgent = req.get("user-agent") || "";
    const { email, password, redirect_uri } = req.body;
    const authService = new AuthService(req.accessControl);
    let constructedRedirectURI = null;
    const isAuthorised = await authService.authenticateUserIdendityByEmail({
      email: email.toLowerCase(),
      password,
      userAgent,
      availableToken: cookies.__imsrt__,
    });
    if (!isAuthorised)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid credentials or user unauthorised.",
      });
    if (redirect_uri) {
      let parser = await authService.getRedirectWithOAuthCode({
        email,
        redirect_uri,
      });
      constructedRedirectURI = parser.redirect_uri;
    }
    const response = await authService.grantAccess({
      email: email.toLowerCase(),
      userAgent,
      availableToken: cookies.__imsrt__,
    });
    if (cookies.__imsat__) {
      logger.info("found __imsat__ cookie in login. clearing now...");
      res.clearCookie("__imsat__", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }
    res.cookie("__imsat__", response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    if (cookies.__imsrt__) {
      logger.info("found __imsrt__ cookie in login. clearing now...");
      res.clearCookie("__imsrt__", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }
    res.cookie("__imsrt__", response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    res.status(StatusCodes.OK).json({
      message: "Login successful.",
      ...response,
      redirectUri: constructedRedirectURI,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.__imsrt__ || req.header("x-auth-refreshtoken");
    const organizationId = req.header("x-org-id");
    const groupId = req.header("x-group-id");
    const authService = new AuthService(req.accessControl);
    const newTokens = await authService.handleRefreshToken(refreshToken, {
      organizationId,
      groupId,
    });
    res.clearCookie("__imsat__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("__imsat__", newTokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("__imsrt__", newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    return res.status(StatusCodes.OK).json({
      message: "New pair of newTokens granted.",
      tokenRefresh: true,
      ...newTokens,
    });
  } catch (error) {
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("__imsat__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    next(error);
  }
};
exports.signOut = async (req, res, next) => {
  const authService = new AuthService(req.accessControl);
  try {
    const refreshToken =
      req.cookies.__imsrt__ || req.header("x-auth-refreshtoken");
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("__imsorgt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("__imsat__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    await authService.invalidateRefreshToken(refreshToken);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Signed out successfully." });
  } catch (err) {
    next(err);
  }
};
exports.forgotPassword = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { email } = req.body;
    const clientUrl = req.headers.origin;
    email = email.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist." });
    const payload = {
      user: {
        _id: user._id,
      },
    };
    let token = await Token.signToken(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 1200 }
    );
    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { resetToken: token } }
    );
    let resetLink = `${
      clientUrl || process.env.CLIENT_URL
    }/auth/setup-password/${token}`;
    await sendMail("forgot-password", email, { name: user.name, resetLink });
    res.status(StatusCodes.OK).json({ message: "Email sent successfully" });
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let token = req.header("x-resetpassword-token");
    let { password } = req.body;
    const { expired, decoded } = await Token.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (expired || !decoded)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "This verification has been expired." });
    let { _id } = decoded.user;
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    let user = await User.findOne({ _id });
    if (user.resetToken === token) {
      let user = await User.findOneAndUpdate(
        { _id },
        {
          $set: {
            password: hashedPassword,
            "systemPassword.status": "blocked",
          },
        },
        { new: true }
      ).select(
        "-password -salary -emailVerificationToken -resetToken -phoneOtp"
      );
      await sendMail("password-changed", user.email, { name: user.name });
      return res
        .status(StatusCodes.OK)
        .json({ message: "Password reset successfully", user });
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token is not valid." });
    }
  } catch (err) {
    next(err);
  }
};

exports.resendEmailVarification = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  let registrationService = new RegistrationService(req.accessControl);
  try {
    let { id } = req.params;
    let user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ message: "User does not exist." });
    if (user.emailVerified.status !== "pending")
      return res.status(400).json({ message: "User already verified." });
    if (new Date(user.verificationEmailAfter) > new Date())
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Already an active link has been sent. Please wait for 2 minutes.",
      });
    user = await User.populateAll(user);
    await registrationService.startUserVerification({
      ...user,
      clientUrl: req.headers.origin,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Verification email sent.", user });
  } catch (err) {
    next(err);
  }
};
exports.verifyAccount = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let token = req.header("x-verification-token");
    const { expired, decoded } = await Token.verify(token, process.env.JWT_KEY);
    if (expired || !decoded)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "This verification has been expired." });
    let { email } = decoded;
    let user = await User.findOne({ email });
    if (user.emailVerificationToken === token) {
      let user = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            "systemPassword.status": "blocked",
            "emailVerified.status": "varified",
            "emailVerified.on": Date.now(),
            emailVerificationToken: null,
          },
        },
        { new: true }
      ).select(
        "-password -salary -emailVerificationToken -resetToken -phoneOtp"
      );
      return res
        .status(StatusCodes.OK)
        .json({ message: "Account verified successfully", user });
    } else {
      return res.status(400).json({ message: "Token is not valid." });
    }
  } catch (err) {
    next(err);
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const { response_type, client_id, redirect_uri, state } = req.query;
    const params = new URLSearchParams({ redirect_uri });
    let parsedUrl = "";
    if (process.env.NODE_ENV === "production") {
      parsedUrl = new URL(KNOWN_HOSTS.PROD.IMS_ACCOUNTS + "/auth/login");
    }
    if (process.env.NODE_ENV === "staging") {
      parsedUrl = new URL(KNOWN_HOSTS.STAGING.IMS_ACCOUNTS + "/auth/login");
    }
    if (process.env.NODE_ENV === "development") {
      parsedUrl = new URL(KNOWN_HOSTS.DEV.IMS_ACCOUNTS + "/auth/login");
    }
    parsedUrl.search = params.toString();
    return res
      .status(200)
      .json({ message: "Auth url retrived.", authUrl: parsedUrl });
  } catch (error) {
    next(error);
  }
};

exports.authCode = async (req, res, next) => {
  try {
    const {  redirect_uri } = req.query;
    const authService = new AuthService(req.accessControl);
    let parser = await authService.getRedirectWithOAuthCode({
      email: req.accessControl.user.email,
      redirect_uri,
    });
    return res.status(200).json({
      message: "Auth code with url retrived.",
      redirect_uri: parser.redirect_uri,
    });
  } catch (error) {
    next(error);
  }
};

exports.token = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const userAgent = req.get("user-agent") || "";
    const { authCode } = req.body;
    const authService = new AuthService(req.accessControl);
    const userEmail = await authService.authenticateUserIdendityByAuthCode({
      authCode,
    });
    if (!userEmail)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid 'authCode' or user unauthorised.",
      });
    const response = await authService.grantAccess({
      email: userEmail,
      userAgent,
      availableToken: cookies.__imsrt__,
    });
    if (cookies.__imsat__) {
      logger.info("found __imsat__ cookie in login. clearing now...");
      res.clearCookie("__imsat__", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }
    res.cookie("__imsat__", response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    if (cookies.__imsrt__) {
      logger.info("found __imsrt__ cookie in login. clearing now...");
      res.clearCookie("__imsrt__", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }
    res.cookie("__imsrt__", response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    res.status(StatusCodes.OK).json({
      message: "Login successful.",
      ...response,
    });
  } catch (error) {
    next(error);
  }
};

exports.txnEmailInvitation = async (req, res, next) => {
  try {
    const { token } = req.body;
    const authService = new AuthService(req.accessControl);
    const txnEmail = await authService.acceptTxnEmailInvitation(token);
    return res.status(StatusCodes.OK).json({
      message: "Txn email verified successfully.",
      txnEmail,
    });
  } catch (error) {
    next(error);
  }
};
