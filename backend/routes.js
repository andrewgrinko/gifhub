const Promise = require("bluebird");
const express = require("express");
const router = express.Router();
const memoizee = require("memoizee");
const { getRepoCommits, getNextPage } = require("./github");
const { getGif } = require("./giphy");

const fetchCommits = memoizee(link => getRepoCommits(link), {
  maxAge: 1000 * 60 * 60 * 24
}); // 1 day

router.get("/api/repo", (req, res, next) => {
  let link = req.query.url;
  if (!link) {
    res.status(400).send("No repo link provided!");
  }

  fetchCommits(link).then(mapCommits).then(gifs => res.send(gifs)).catch(next);
});

router.put("/api/repo", (req, res, next) => {
  let link = req.body.link;
  getNextPage(link).then(mapCommits).then(gifs => res.send(gifs)).catch(next);
});

const mapCommits = data => {
  let { commits, hasNextPage, link } = data;
  return Promise.map(commits, async commitObject => {
    let gif = await getGif(commitObject.commit.message);
    let { author } = commitObject;
    return {
      url: gif.url,
      message: gif.message,
      author: {
        name: author.login,
        url: author.html_url
      },
      hasNextPage: commitObject.hasNextPage,
      link: commitObject.link
    };
  }).then(gifs => {
    return {
      gifs,
      hasNextPage,
      link
    };
  });
};

module.exports = router;
