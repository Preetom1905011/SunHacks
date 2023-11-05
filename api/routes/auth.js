const express = require('express');
const router = express.Router()
const passport = require('passport');

router.get('/github',
  passport.authenticate('github', { scope: [ 'repo', 'delete_repo', 'codespace' ] }));

router.get('/github/callback', 
  passport.authenticate('github', {
    failureRedirect: '/error' }),
    function (req, res) {
      const username = req.user.username;
      res.redirect(`http://localhost:3000/levels/login-success?username=${username}`)
    }
);

module.exports = router