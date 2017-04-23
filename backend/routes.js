const Promise = require("bluebird");
const express = require("express");
const router = express.Router();
const { getRepoCommits } = require("./github");
const { getGif } = require("./giphy");

const cached = {};

const fetchCommits = async function(link) {
  if (cached[link]) {
    return cached[link];
  } else {
    return await getRepoCommits(link);
  }
};

router.get("/api/repo", (req, res, next) => {
  let link = req.query.url;
  if (!link) {
    res.status(400).send("No repo link provided!");
  }

  fetchCommits(link)
    .then(commitObjects => {
      cached[link] = commitObjects;
      return commitObjects;
    })
    .then(commitObjects => {
      return Promise.map(commitObjects, commitObject => {
        return getGif(commitObject.commit.message);
      });
    })
    .then(gifUrls => res.send(gifUrls))
    .catch(next);
});

module.exports = router;
