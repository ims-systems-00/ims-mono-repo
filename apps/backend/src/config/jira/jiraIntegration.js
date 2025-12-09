const JiraClient = require('jira-connector');
exports.getJira = () => new JiraClient({
    host: "imssystems.atlassian.net",
    basic_auth: {
        email: "riad@imssystems.tech",
        api_token: process.env.JIRA_API_TOKEN
    }
});