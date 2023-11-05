const { Octokit } = require('@octokit/rest')
const { Webhooks } = require("@octokit/webhooks");


const express = require('express');
const router = express.Router()

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET,
});

function getOctokit(req) {
  return new Octokit({
    auth: req.user.accessToken,
  });
}

router.get( '/' , async(req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(403).send('Not authenticated');
  }

  const octokit = getOctokit(req);
  const owner = req.user.username;

  try {
    // Create repository
    const createRepoResponse = await octokit.rest.repos.createForAuthenticatedUser({
      name: 'test-repo',
    });
    const repo = createRepoResponse.data.name;

    // Create webhook
    const createWebhookResponse = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      config: {
        url: `${process.env.BACKEND_URL}/webhook`,
        content_type: 'json',
        secret: process.env.WEBHOOK_SECRET,
      },
      events: ['push', 'pull_request'],
    });
    const webhookId = createWebhookResponse.data.id;

    // Respond to push and pull_request webhook events
    webhooks.on("push", ({ id, name, payload }) => {
      console.log(`Push event received for ${payload.repository.url} to ${payload.ref}`);
      // Your code to handle push events
    });

    webhooks.on("pull_request", ({ id, name, payload }) => {
      console.log(`Pull_request event received for ${payload.repository.url}`);
      // Your code to handle pull_request events
    });

    // Delete repository (for simplicity, deleting after a delay of 5 minutes)
    setTimeout(async () => {
      await octokit.rest.repos.delete({
        owner,
        repo,
      });
      console.log('Repository deleted');
    }, 300000);

    res.send('Repository and webhook created, webhook is active, repository will be deleted after 5 minutes');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// router.use(createNodeMiddleware(webhooks, { path: '/webhook' }));

module.exports = router