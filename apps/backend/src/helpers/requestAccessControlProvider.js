function RequestUserAccessControlProvider(
  user = {},
  group = {},
  session = {},
  groupPolicy = {},
  rolePolicy = {},
  managedUsers = [],
  timeZone = "Europe/London",
  externalID = {}
) {
  this.user = user;
  this.group = group;
  this.session = session;
  this.groupPolicy = groupPolicy;
  this.rolePolicy = rolePolicy;
  this.timeZone = timeZone;
  this.managedUsers = managedUsers;
  this.externalID = externalID;
  this.name = "not needed will remove later";
  this.setUser = function (user) {
    this.user = user;
  };
  this.setGroup = function (group) {
    this.group = group;
  };
  this.setSession = function (session) {
    this.session = session;
  };
  this.setGrouppolicy = function (policy) {
    this.groupPolicy = policy;
  };
  this.setRolepolicy = function (policy) {
    this.rolePolicy = policy;
  };
  this.setTimeZone = function (timeZone) {
    this.timeZone = timeZone;
  };
  this.setManagedUsers = function (managedUsers) {
    this.managedUsers = managedUsers;
  };
  this.setExternalID = function (externalID) {
    this.externalID = externalID;
  };
}
module.exports = {
  RequestUserAccessControlProvider,
};
