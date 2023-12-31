const express = require('express');
const session = require('express-session');
const { createNodeMiddleware } = require("@octokit/webhooks");
const cors = require('cors');
const passport = require('passport');

const app = express();

const webhooks = require('./routes/webhookInstance');

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
  
app.use(cors(corsOptions));
  
const GitHubStrategy = require('passport-github').Strategy;
  
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}:${process.env.PORT}/auth/github/callback`
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
  
passport.serializeUser((user, done) => {
  done(null, user);
});
  
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const auth = require('./routes/auth')
const levels = require('./routes/levels')
const webhook = require('./routes/webhook')

app.use('/auth', auth);
app.use('/levels', levels);

app.use('/webhook', webhook);
app.use(createNodeMiddleware(webhooks, { path: '/webhook' }));

const { Octokit } = require('@octokit/rest')
app.use('/', (req, res) => {
  
  if (req.user == undefined)
    res.json('Not logged in')

  const octokit = new Octokit({
    auth: req.user.accessToken,
  });
  
  octokit.rest.users.getAuthenticated()
  .then(response => {
    console.log("userName sent")
    res.send(`Your GitHub username is ${response.data.login}`);
  })
  .catch(error => {
      console.error(error);
      res.status(500).send('Failed to retrieve GitHub username');
  });
})

module.exports = app;



