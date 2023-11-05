const express = require('express');
const router = express.Router()
const { Octokit } = require('octokit')

function getOctokit(req) {
  return new Octokit({
    auth: req.user.accessToken,
  });
}

router.get('/create-codespace', (req, res) => {
  const octokit = getOctokit(req);

  octokit.rest.codespaces.createWithRepoForAuthenticatedUser({
    owner: 'rtwoo',
    repo: 'soda-roster-approval'
  }).then(response => {
    res.redirect(response.data.web_url)
  })

  // octokit.rest.users.getAuthenticated()
  //   .then(response => {
  //     console.log("userName sent")
  //     res.send(`Your GitHub username is ${response.data.login}`);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //     res.status(500).send('Failed to retrieve GitHub username');
  // });
});

router.get('/make-test-issue', (req, res) => {
    const octokit = getOctokit(req);
  
    octokit.rest.issues.create({
      owner: "rtwoo",
      repo: "soda-roster-approval",
      title: "Hello from Backend"
    }).then(response => {
      res.send(response);
    });
});

module.exports = router