const eventsHandlers = {
  ...require("./handlers/task-linked"),
  ...require("./handlers/task-created"),
  ...require("./handlers/task-completed"),
  ...require("./handlers/task-new-users-added"),
  ...require("./handlers/task-acceptance"),
  ...require("./handlers/task-in-progress"),
};
module.exports = eventsHandlers;
