const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Octokit } = require('octokit');
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
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://learngit.courses/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken;
  return done(null, profile);
}
));

function getOctokit(req) {
  return new Octokit({
    auth: req.user.accessToken,
  });
}

app.get('/get-username', (req, res) => {
  const octokit = getOctokit(req);

  octokit.rest.users.getAuthenticated()
    .then(response => {
      console.log("userName sent");
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
    res.redirect('/get-username');
  });

module.exports = app;