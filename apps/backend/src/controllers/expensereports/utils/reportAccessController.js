/**
 * Checks whether user either owns data or manages data owner, to ensure request
 * is authorized
 * @param {any} accessControl
 * @param {any} payloads
 * @returns {boolean}
 */
exports.authWalletAccess = (accessControl, payloads) => {
  const { userId } = payloads;
  const { managedUsers, user } = accessControl;
  if (managedUsers?.indexOf(userId?.toString()) !== -1 || user?._id?.toString() === userId?.toString())
    return true;
  else
    return false;
};
