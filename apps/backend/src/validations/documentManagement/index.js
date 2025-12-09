module.exports = {
  repository: require("./repository"),
  documenttree: require("./documenttree"),
  signature: {
    ...require("./signatures"),
  },
  authorisation: {
    ...require("./authorisationStatus"),
    ...require("./addAuthoriser"),
  },
};
