const express = require('express');
const router = express.Router()
const { Octokit } = require('@octokit/rest')

function getOctokit(req) {
  return new Octokit({
    auth: req.user.accessToken,
  });
}

const levels = {
  'Level 0': {
    difficulty: 'Easy',
    template: {
      owner: 'rtwoo',
      repo: 'Level-0'
    }
  },
  'Level 1': {
    difficulty: 'Intermediate',
    template: {
      owner: 'rtwoo',
      repo: 'repo-name'
    }
  },
  'Level 2': {
    difficulty: 'Hard',
    template: {
      owner: 'rtwoo',
      repo: 'repo-name'
    }
  }
}

router.get('/', async (req, res) => {
  console.log(">>>>", levels)
  res.json(levels)
})

router.get('/create-codespace', (req, res) => {
  
  const octokit = new Octokit({
    auth: req.user.accessToken,
  });;

  const { query } = req

  if (!(query.level in levels)) {
    res.status(400).send('Invalid Level')
    return
  }
  
  octokit.rest.codespaces.createWithRepoForAuthenticatedUser(
    levels[query.level].template
  ).then(response => {
    res.json(response.data.web_url)
  })
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