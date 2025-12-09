const { Token } = require("../../services/tokenManagement");
const UserModel = require("../../models/mongodb/admin/users&auth/user");
const SessionModel = require("../../models/mongodb/admin/users&auth/session");
const _ = require("lodash");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

const admindb = process.env.ADMIN_DB;

const deserializeUser = async (req, res, next) => {
  let User = UserModel();
  let Session = SessionModel();
  if (process.env.NODE_ENV === "administration") return next();
  const accessToken = req.header("x-auth-accesstoken");
  const refreshToken = req.header("x-auth-refreshtoken");
  if (!accessToken)
    return res
      .status(401)
      .json({ message: "No access token, authorization denied" });

  try {
    const { expired: acessTokenExpired, decoded: decodedAccessToken } =
      await Token.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (decodedAccessToken) {
      req.accessControl = {
        user: decodedAccessToken.user,
      };
      return next();
    }
    if (acessTokenExpired && refreshToken) {
      const { expired: refreshTokenExpired, decoded: decodedRefreshToken } =
        await Token.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (refreshTokenExpired)
        return res
          .status(440)
          .json({ message: "User unauthorized or login expired" });
      if (decodedRefreshToken && decodedRefreshToken.session._id) {
        let session = await Session.findById(decodedRefreshToken.session._id);
        if (session && session.valid) {
          let user = await User.findById(session.user).select("-password");
          const accessPayload = {
            user: {
              _id: user._id,
              name: user.name,
            },
          };

          logger.info("We are giving a new token with this request...");

          let newAccessToken = await Token.signAccessToken(
            accessPayload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_TTL }
          );
          let newRefreshToken = await Token.signAccessToken(
            { session: { _id: session._id } },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_TTL }
          );

          return res.status(203).json({
            message: "New Access Token Granted",
            newAccessToken,
            newRefreshToken,
          });
        } else {
          await Session.findOneAndDelete({
            _id: decodedRefreshToken.session._id,
          });
          return res
            .status(440)
            .json({ message: "User unauthorized or login expired" });
        }
      } else {
        return res
          .status(440)
          .json({ message: "User unauthorized or login expired" });
      }
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
