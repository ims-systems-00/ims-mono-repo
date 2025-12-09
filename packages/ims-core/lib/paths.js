const path = require("path");
exports.pathsHelper = (directoryName) => ({
  relativeTo: (pathName) =>
    directoryName + "/" + path.relative(directoryName, pathName),
});
