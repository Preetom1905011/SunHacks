const express = require('express');
const router = express.Router()
const passport = require('passport');

router.get('/github',
  passport.authenticate('github', { scope: [ 'repo' ] }));

router.get('/github/callback', 
  passport.authenticate('github', {
    successRedirect: '../../levels/get-username',
    failureRedirect: '/error' })
);

module.exports = router