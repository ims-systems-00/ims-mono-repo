const jira = require("jira.js");
const UserModel = require("../models/mongodb/system/users&auth/user");
const { sendMail } = require("../email/sendMail");
const client = new jira.Version3Client({
  host: "https://imssystems.atlassian.net",
  authentication: {
    basic: {
      email: "reyad@imssystems.tech",
      apiToken: process.env.JIRA_API_TOKEN,
    },
  },
  newErrorHandling: true,
});
exports.createTicket = async (req, res, next) => {
  let { summary, description, type, contact } = req.body;
  let { user } = req.accessControl;
  const issue = {
    summary: summary,
    description: description,
    type: type,
    email: user.email,
    name: user.name,
    organizationName: user.organizationName + " " + user.organizationId,
    contact: contact,
    businessunit: user.groupId,
  };
  console.log(issue);
  try {
    await sendMail(
      "bug-report-forward",
      ["support@imssystems.tech", "reyad@imssystems.tech"],
      issue
    );
    await sendMail("bug-report-confirmation", user.email, {
      name: user.name,
    });
    return res.status(200).json({ message: "Issue created.", issue });
  } catch (err) {
    console.log(err)
    next(err);
  }
};
exports.getTickets = async (req, res, next) => {
  let User = UserModel(req.accessControl);
  let { user } = req.accessControl;
  const { startAt } = req.query;
  try {
    let reporter = await User.findOne({ _id: user._id });
    const issues = await client.issueSearch.searchForIssuesUsingJql({
      jql: "project = CS AND status = Reported AND tenant ~ localhost order by created DESC",
      startAt: startAt || 0,
      maxResults: 30,
    });
    return res.status(200).json({ message: "Issues retrived.", issues });
  } catch (err) {
    next(err);
  }
};
exports.getTicket = async (req, res, next) => {
  try {
    const issue = await client.issues.getIssue({ issueIdOrKey: req.params.id });
    res.status(200).json({ message: "Issues retrived successfully", issue });
  } catch (err) {
    next(err);
  }
};
