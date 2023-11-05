const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Octokit } = require('@octokit/rest')
const { Webhooks } = require("@octokit/webhooks");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const corsOptions = {
  origin: 'http://localhost:3000',  // replace with your frontend application's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.BACKEND_URL +"/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;  // Store the access token
  return done(null, profile);
}
));

// Set up session management using the secret from the .env file
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

function getOctokit(req) {
  return new Octokit({
    auth: req.user.accessToken,
  });
}
app.get('/get-username', (req, res) => {
  const octokit = getOctokit(req);

  octokit.rest.users.getAuthenticated()
    .then(response => {
      console.log("userName sent")
      res.send(`Your GitHub username is ${response.data.login}`);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Failed to retrieve GitHub username');
    });
});

app.get('/make-test-issue', (req, res) => {
  const octokit = getOctokit(req);

  octokit.rest.issues.create({
    owner: "rtwoo",
    repo: "soda-roster-approval",
    title: "Hello from Backend"
  }).then(response => {
    res.send(response);
  });
});

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'repo' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/get-username');
  });
  
async function handleUserFlow(req, res) {
  const webhooks = new Webhooks({
    secret: process.env.WEBHOOK_SECRET,
  });
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
        url: 'https://13.56.80.187:5000/webhook',
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
}

// app.use(bodyParser.json());
// app.use(webhooks.middleware);

app.get('/handle-user-flow', handleUserFlow);

module.exports = app;