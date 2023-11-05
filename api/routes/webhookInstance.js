const { Webhooks } = require("@octokit/webhooks");

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET,
});

module.exports = webhooks;
