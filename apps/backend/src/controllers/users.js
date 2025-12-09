const UserModel = require("../models/mongodb/system/users&auth/user");
const { models } = require("../models");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { IamPolicy } = require("../services/iamPolicy");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const SessionModel = require("../models/mongodb/system/users&auth/session");
const { RegistrationService, AuthService } = require("../services/account");
const { UserService } = require("../services/user");
const { sendMail } = require("../email/sendMail");
const LicenseManagementService = require("../services/licenseManager");
const { trimQuery } = require("../validations/utils");
const { imsPaginationFormated, Filters } = require("../services/utility");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

exports.authCreatePermission = async (req, res, next) => {
  try {
    return res
      .status(400)
      .json({ message: "authCreatePermission depricated api" });
  } catch (err) {
    next(err);
  }
};
exports.createUser = async (req, res, next) => {
  let registrationService = new RegistrationService(req.accessControl);
  let userService = new UserService(req.accessControl);
  let [createError, user] = await userService.createUser({
    ...req.body,
    createdBy: req.accessControl?.user?._id,
  });
  if (createError)
    return res
      .status(400)
      .json({ message: createError.message || "User created failed." });
  registrationService.startUserVerification(user);
  res.status(200).json({ message: "User create successful", user });
  next();
};
exports.useUserLicense = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.changeImsSystemsAccessStatus = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { id } = req.params;
    let { status, group } = req.query;
    let user = await User.findOne({ _id: id });

    // if (!group) {
    let expiryDate =
      user.systemAccess.period === "Full time"
        ? null
        : Date.now() + parseInt(user.systemAccess.period) * 86400000;
    user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "systemAccess.status": status,
          "systemAccess.expires": status === "Active" ? expiryDate : null,
        },
      },
      { new: true }
    ).select("-password -emailVerificationToken -resetToken -phoneOtp");
    res
      .status(200)
      .json({ message: "Access status changed success fully", user });
    let populateduser = await User.populateAll(user);
    if (status === "Active") {
      sendMail("welcome-to-ims", user.email, {
        name: populateduser.name,
        tenant: req.accessControl.name,
        by: populateduser.created.by,
        role: populateduser.accessPolicies[0].role.name,
        group: populateduser.accessPolicies[0].group.name,
        loginLink: `${process.env.CLIENT_URL}/auth/login`,
      });
    }
    if (status === "Blocked") {
      sendMail("access-revoked", user.email, {
        name: populateduser.name,
        tenant: req.accessControl.name,
        by: populateduser.created.by,
      });
    }
  } catch (err) {
    next(err);
  }
};
async function changeExpiredAccess(req, res, next) {
  let User = UserModel(req.accessControl);
  let Session = SessionModel(req.accessControl);
  try {
    let { id } = req.params;
    let { status } = req.query;
    let user = await User.findOne({ _id: id });
    let expiryDate =
      user.systemAccess.period === "Full time"
        ? null
        : Date.now() + parseInt(user.systemAccess.period) * 86400000;
    user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "systemAccess.status": status,
          "systemAccess.expires": status === "Active" ? expiryDate : null,
        },
      },
      { new: true }
    ).select("-password -emailVerificationToken -resetToken -phoneOtp");
    let populateduser = await User.populateAll(user);
    if (status === "Active") {
      sendMail("welcome-to-ims", user.email, {
        name: populateduser.name,
        tenant: req.accessControl.name,
        by: populateduser.created.by,
        role: populateduser.accessPolicies[0].role.name,
        group: populateduser.accessPolicies[0].group.name,
        loginLink: `${process.env.CLIENT_URL}/auth/login`,
      });
    }
    if (status === "Blocked") {
      await Session.deleteMany({ user: id });
      sendMail("access-revoked", user.email, {
        name: populateduser.name,
        tenant: req.accessControl.name,
        by: populateduser.created.by,
      });
    }
  } catch (err) {
    next(err);
  }
}
exports.updateExpiredUsersStatus = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { users } = req.body;
    await Promise.all(
      users.map((user) => {
        req.params.id = user._id;
        req.query.status = "Blocked";
        changeExpiredAccess(req, res);
      })
    );
    res.status(200).json({ message: "Expired users blocked successfully" });
  } catch (err) {
    next(err);
  }
};
exports.getUserWithBasicInfo = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  let Membership = models.memberships(req.accessControl);
  try {
    let { id } = req.params;
    let user = await User.findOne({ _id: id }).select(
      "-password -salary -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    user = await User.populateAll(user);
    let membership = await Membership.findOne({
      organization: req.accessControl.user.organizationId,
      invitedUserId: id,
    }).populate([
      { path: "groups", select: "name type" },
      { path: "lineManagers", select: "name email" },
    ]);
    res.status(200).json({
      message: "User retrived succesfully",
      user: {
        ...user._doc,
        membership,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.getUserWithClassifiedInfo = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  let Membership = models.memberships(req.accessControl);
  try {
    let { id } = req.params;
    let user = await User.findOne({ _id: id }).select(
      "-password -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    user = await User.populateAll(user);
    let membership = await Membership.findOne({
      organization: req.accessControl.user.organizationId,
      invitedUserId: id,
    }).populate([
      { path: "groups", select: "name type" },
      { path: "lineManagers", select: "name email" },
    ]);
    res.status(200).json({
      message: "User retrived succesfully",
      user: {
        ...user._doc,
        membership,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateUserInfo = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { id } = req.params;
    let { firstName, lastName } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: firstName + " " + lastName,
          firstName: firstName,
          lastName: lastName,
        },
      },
      { new: true }
    ).select(
      "-password -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    user = await User.populateAll(user);
    res.status(200).json({ message: "User info updated successfully", user });
  } catch (err) {
    next(err);
  }
};
exports.addWorkingLocation = async (req, res, next) => {
  try {
    let { id } = req.params;
    let userService = new UserService(req.accessControl);
    let user = await userService.addWorkingLocation(id, req.body);
    return res
      .status(200)
      .json({ message: "Location updated successfully", user });
  } catch (err) {
    next(err);
  }
};
exports.removeWorkingLocation = async (req, res) => {
  try {
    let { id, location_id } = req.params;
    let userService = new UserService(req.accessControl);
    let user = await userService.removeWorkingLocation(id, location_id);
    return res
      .status(200)
      .json({ message: "Location updated successfully", user });
  } catch (err) {
    next(err);
  }
};
exports.changeProfileImage = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { id } = req.params;
    let { profileImageInfo } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          profileImageInfo,
          profileImageSrc:
            process.env.PUBLIC_RESOURCE_BASE_URL + "/" + profileImageInfo.Key,
        },
      },
      { new: true }
    ).select(
      "-password -salary -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    user = await User.populateAll(user);
    res.status(200).json({ message: "User info updated successfully", user });
  } catch (err) {
    next(err);
  }
};

exports.changeSignature = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { id } = req.params;
    let { signatureInfo } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          signatureInfo,
        },
      },
      { new: true }
    ).select(
      "-password -salary -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    user = await User.populateAll(user);
    res.status(200).json({ message: "Signature updated successfully", user });
  } catch (err) {
    next(err);
  }
};

exports.changePreferences = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { id } = req.params;
    let { darkMode, activeTheme } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "preferences.darkMode": darkMode,
          "preferences.activeTheme": activeTheme,
        },
      },
      { new: true }
    ).select(
      "-password -salary -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    res.status(200).json({ message: "User info updated successfully", user });
  } catch (err) {
    next(err);
  }
};
exports.getProfileImage = async (req, res, next) => {
  try {
    res.status(200).send("");
  } catch (err) {
    next(err);
  }
};
exports.getAllUsers = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { roleName, page, size } = trimQuery(req.query);
    const options = {
      page,
      limit: size,
      sort: { name: 1 },
    };
    let filter = new Filters(req, {
      searchFields: ["name", "email", "jobTitle", "workPlace"],
      strictObjectIdMatch: true,
    })
      .build()
      .query();
    let query = {
      "systemAccess.status": "Active",
      ...filter,
    };
    let users = [];

    /**
     * aggregate
     */
    const aggregate = User.aggregate();
    aggregate
      .lookup({
        from: "memberships",
        localField: "_id",
        foreignField: "invitedUserId",
        as: "membership",
      })
      .match({
        ...query,
        "membership.organization": new mongoose.Types.ObjectId(
          req.accessControl.user.organizationId
        ),
      })
      .project({
        password: 0,
        emailVerificationToken: 0,
        resetToken: 0,
        phoneOtp: 0,
        refreshTokens: 0,
      });
    /**
     * aggregate
     */
    const pagination = await User.aggregatePaginate(aggregate, options);
    users = pagination.docs;
    res.status(200).json({
      message: "All users retrived successfully",
      pagination: imsPaginationFormated(pagination),
      users,
    });
  } catch (err) {
    next(err);
  }
};
exports.getAllActiveUsers = async (req, res, next) => {
  this.getAllUsers(req, res, next);
};
exports.getAllUsersByGroup = async (req, res, next) => {
  this.getAllUsers(req, res, next);
};
exports.getAllActiveUsersByGroup = async (req, res, next) => {
  this.getAllUsers(req, res, next);
};
/**
 * This never deletes the users from the system rather it creates the illusion for delete
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 *
 */
exports.deleteUser = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    let { id } = req.params;
    let user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ message: "No user found." });
    user = await User.findOneAndUpdate(
      { _id: id },
      {
        name: user.name + " (Deactivated)",
        email: `(${user._id}) [${user.email}] (Deactivated)`,
        accessPolicies: [],
        systemAccess: {
          status: "Deactivated",
          updatedOn: Date.now(),
        },
      }
    );
    return res.status(200).json({ message: "User deleted successfully", user });
  } catch (err) {
    next(err);
  }
};
exports.authUserRoleLicense = async (req, res, next) => {
  try {
    let { groupId, role } = req.body;
    let license = new LicenseManagementService(
      req.accessControl.user.organizationId
    );
    /**
     * Role authorization has been paused after v2.4.1 release. all the authorization machanism is available
     * but are not in use.
     */
    // if (await license.authorizeUserRoleUsagePermissionInGroup(role, groupId)) return next()
    return next();
    res
      .status(400)
      .json({ message: "This license is unavailble for this group" });
  } catch (err) {
    next(err);
  }
};
exports.useRoleLicense = async (req, res, next) => {
  return res.status(200).json({
    message: "User added to a group successfully",
    user: req.licensedUser,
  });
  let User = UserModel(req.accessControl);
  let { id } = req.params;
  let { groupId, role } = req.body;
  let { user: requester } = req.accessControl;
  try {
    res.status(200).json({
      message: "User added to a group successfully",
      user: req.licensedUser,
    });
    let populateduser = await User.populateAll(req.licensedUser);
    await licenseManager.complianceToolUserslicenseLookUp(groupId);
    sendMail("new-role-granted", populateduser.email, {
      name: populateduser.name,
      tenant: req.accessControl.name,
      by: requester,
      role: populateduser.accessPolicies[
        populateduser.accessPolicies.length - 1
      ].role.name,
      group:
        populateduser.accessPolicies[populateduser.accessPolicies.length - 1]
          .group.name,
      loginLink: `${process.env.CLIENT_URL}/auth/login`,
    });
  } catch (error) {
    next(error);
  }
};
exports.freeRoleLicense = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.addUserToGroup = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  let Membership = models.memberships(req.accessControl);
  let Group = models.iamgroups(req.accessControl);
  try {
    let { groupId } = req.body;
    let { id } = req.params;
    let group = await Group.findOne({ _id: groupId });
    if (!group) return res.status(400).json({ message: "No group found." });
    let membership = await Membership.findOne({
      invitedUserId: id,
      groups: groupId,
      organization: req.accessControl.user.organizationId,
    });
    if (membership)
      return res
        .status(400)
        .json({ message: "User already added to this group" });
    membership = await Membership.findOneAndUpdate(
      {
        invitedUserId: id,
        organization: req.accessControl.user.organizationId,
      },
      {
        $push: {
          groups: groupId,
        },
      },
      { new: true }
    );
    let user = await User.findOne({ _id: id }).select(
      "-password  -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    const populateduser = await User.populateAll(user);
    group.totalMembers += 1;
    await group.save();
    await sendMail("new-role-granted", populateduser.email, {
      name: populateduser.firstName,
      tenant: req.accessControl.name,
      by: req.accessControl.user,
      role: "a member",
      group: group.name,
      loginLink: `${process.env.CLIENT_URL}/admin/groups/${groupId}`,
    });
    return res.status(StatusCodes.OK).json({
      message: "User added to group successfully",
      user: populateduser,
    });
  } catch (err) {
    next(err);
  }
};
exports.removeUserFromFroup = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  let Group = models.iamgroups(req.accessControl);
  let Membership = models.memberships(req.accessControl);
  try {
    let { id, group_id } = req.params;
    let membership = await Membership.findOneAndUpdate(
      {
        invitedUserId: id,
        organization: req.accessControl.user.organizationId,
      },
      {
        $pull: {
          groups: group_id,
        },
      },
      { new: true }
    );
    let user = await User.findOne({ _id: id });
    let group = await Group.findOne({ _id: group_id });
    sendMail("removed-from-bu", user.email, {
      name: user.name,
      tenant: req.accessControl.name,
      by: req.accessControl.user,
      group,
    });
    group.totalMembers -= 1;
    await group.save();
    if (id === req.accessControl.user._id)
      res.status(419).json({
        message: "Session expired while processing this request",
        user,
      });
    else
      res
        .status(200)
        .json({ message: "User removed from group successfully", user });
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  return res.status(200);
};
exports.changeOldPassword = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  try {
    const { password, oldPassword } = req.body;
    let existingUser = await User.findById(req.accessControl.user?._id);
    if (oldPassword === password) {
      return res
        .status(403)
        .json({ message: "You are trying to use current password." });
    }
    if (!existingUser) {
      return res.status(403).json({ message: "Invalid user" });
    }
    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid Credentials." });
    }
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    existingUser = await User.findOneAndUpdate(
      { _id: existingUser._id },
      {
        $set: {
          password: hashPassword,
          "systemPassword.status": "blocked",
        },
      },
      { new: true }
    ).select(
      "-password -salary -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    res
      .status(200)
      .json({ message: "Password changed successfully", user: existingUser });
  } catch (err) {
    next(err);
  }
};
exports.assignComplianceToolKit = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  let Session = SessionModel(req.accessControl);
  try {
    let { tools } = req.body;
    let { id } = req.params;
    let user = await User.findOne({ _id: id });
    await User.populateAll(user);
    let accessPolicies = user.accessPolicies.filter(
      (access) =>
        access.role.name.toString() === IMS_POLICIES.IMS_SUPER_ADMIN_USER ||
        access.role.name.toString() === IMS_POLICIES.IMS_HOS_USER ||
        access.role.name.toString() === IMS_POLICIES.IMS_AUDITOR_USER
    );
    let iamPolicy = new IamPolicy(req.accessControl);
    await Promise.all(
      accessPolicies.map((access) =>
        iamPolicy.grantComlianceToolAccess(tools, access.role.policy)
      )
    );
    await Session.deleteMany({ user: id });
    res
      .status(200)
      .json({ message: "Compliance tool assigned successfully", user });
  } catch (err) {
    next(err);
  }
};
exports.signPolicy = async (req, res) => {
  let User = UserModel(req.accessControl);
  try {
    let { id, policy_id } = req.params;
    let user = await User.findOne({ _id: id });
    if (!user) return res.status(403).json({ message: "User does not exit" });
    let authService = new AuthService(req.accessControl);
    await authService.invalidateRefreshToken(req.cookies.__imsrt__);
    let signature = await authService.switchAccess({ user, policy_id });
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("__imsrt__", signature.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 10,
    });
    res.status(200).json({
      message: "Signed in successfully.",
      ...signature,
    });
  } catch (err) {
    console.error(err);
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(500).json({ message: "Token sign failed" });
  }
};
exports.transferOwnership = async (req, res, next) => {
  try {
    let userService = new UserService(req.accessControl);
    let user = await userService.transferOwnership({
      initiator: req.accessControl.user._id,
      sourceUser: req.params.id,
      destinationUser: req.body.destinationUser,
    });
    res.status(200).json({ message: "Ownership will be transfered", user });
  } catch (err) {
    next(err);
  }
};
exports.ownershipChecks = async (req, res, next) => {
  try {
    let userService = new UserService(req.accessControl);
    let resp = await userService.startOwnershipChecks({
      user: req.params.id,
      initiator: req.accessControl.user,
    });
    res.status(200).json({
      message: "Ownership checks are in progress",
      user: resp.user,
      alreadyATransferInprogress: resp.alreadyATransferInprogress,
    });
  } catch (err) {
    next(err);
  }
};
