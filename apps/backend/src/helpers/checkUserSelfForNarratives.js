exports.checkUserSelf = (to_be_user, ref_user, fallbackString = "yourself") => {
  if (!to_be_user || !ref_user) throw new Error("Users required");
  return to_be_user._id !== ref_user._id ? to_be_user.name : fallbackString;
};
