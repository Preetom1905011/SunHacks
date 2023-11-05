const express = require('express');
const router = express.Router()
const passport = require('passport');

router.get('/github',
  passport.authenticate('github', { scope: [ 'repo', 'delete_repo', 'codespace' ] }));

router.get('/github/callback', 
  passport.authenticate('github', {
    successRedirect: '../../levels/create-codespace',
    failureRedirect: '/error' })
);

module.exports = router