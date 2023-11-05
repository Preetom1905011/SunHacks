const express = require('express');
const router = express.Router()
const passport = require('passport');

router.get('/github',
  passport.authenticate('github', { scope: [ 'repo', 'codespace' ] }));

router.get('/github/callback', 
  passport.authenticate('github', {
    successRedirect: '../../',
    failureRedirect: '/error' })
);

module.exports = router