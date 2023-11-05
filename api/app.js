const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',  // replace with your frontend application's URL
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

app.use('/auth', auth);
app.use('/levels', levels);

module.exports = app;