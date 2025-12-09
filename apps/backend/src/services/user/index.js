const {
  asynchronously,
  imsPaginationFormated,
  DateUtils,
} = require("../utility");
const passWordGenerator = require("secure-random-password");
const bcrypt = require("bcryptjs");
const UserModel = require("../../models/mongodb/system/users&auth/user");
const handleOwnershipIntegrityQueue = require("./queue/handleOwnershipIntegrity.queue");
const ownershipChecksQueue = require("./queue/ownershipChecks.queue");
const { APIError } = require("../../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
class UserService {
  constructor(connection) {
    this.connection = connection;
    this.User = UserModel(connection);
  }
  async createUser(data) {
    let {
      type,
      firstName,
      lastName,
      email,
      password,
      workPlace,
      jobTitle,
      salary,
      accessPeriod,
      createdBy,
    } = data;
    email = email.toLowerCase();
    password = password
      ? password
      : passWordGenerator.randomPassword({
          length: 15,
          characters: [
            passWordGenerator.lower,
            passWordGenerator.upper,
            passWordGenerator.digits,
            passWordGenerator.symbols,
          ],
        });
    let [findError, user] = await asynchronously(this.User.findOne({ email }));
    if (user) return [{ message: "User Already exists" }, null];
    let [createError, newUser] = await asynchronously(
      this.User.create({
        type,
        name: firstName + " " + lastName,
        firstName: firstName,
        lastName: lastName,
        email,
        password,
        workPlace,
        jobTitle,
        salary,
        systemPassword: {
          status: password ? "blocked" : "active",
        },
        systemAccess: {
          period: accessPeriod,
          expires:
            accessPeriod === "Full time"
              ? null
              : Date.now() + parseInt(accessPeriod) * 86400000,
        },
        created: {
          by: createdBy,
          on: Date.now(),
        },
      })
    );
    if (createError) return [{ message: "User create falied." }, null];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let [finalizeError, savedUser] = await asynchronously(
      this.User.findOneAndUpdate(
        { _id: newUser._id },
        { password: hashedPassword },
        { new: true }
      )
    );
    if (finalizeError)
      return [{ message: "User save finalization failed." }, null];
    return asynchronously(this.User.populateAll(savedUser));
  }
  async addWorkingLocation(id, data) {
    let { type, address } = data;
    let user = await this.User.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          locations: { type, address },
        },
      },
      { new: true }
    ).select(
      "-password -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    return this.User.populateAll(user);
  }
  async removeWorkingLocation(id, localtion_id) {
    let user = await this.User.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          locations: { _id: localtion_id },
        },
      },
      { new: true }
    ).select(
      "-password -emailVerificationToken -resetToken -phoneOtp -refreshTokens"
    );
    return this.User.populateAll(user);
  }
  async transferOwnership(data) {
    let [initiator, sourceUser, destinationUser] = await Promise.all([
      this.User.findOne({ _id: data.initiator }),
      this.User.findOne({ _id: data.sourceUser }),
      this.User.findOne({ _id: data.destinationUser }),
    ]);
    if (!initiator)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Initiator not found"
      );
    if (!sourceUser)
      throw new Error(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Source user not found"
      );
    if (!destinationUser)
      throw new Error(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Destination user not found"
      );
    handleOwnershipIntegrityQueue.produce({
      accessControl: this.connection,
      initiator: initiator,
      sourceUser: sourceUser,
      destinationUser: destinationUser,
    });
    return sourceUser;
  }
  async startOwnershipChecks(data) {
    let [user] = await Promise.all([this.User.findOne({ _id: data.user })]);
    if (!user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User does not exist."
      );
    let alreadyATransferInprogress =
      await handleOwnershipIntegrityQueue.isRunning((data) => {
        return data.sourceUser?._id?.toString() === user?._id?.toString();
      });
    ownershipChecksQueue.produce({
      accessControl: this.connection,
      user,
      initiator: data.initiator,
    });
    return {
      alreadyATransferInprogress,
      user,
    };
  }
}
module.exports = { UserService };
