const Promise = require("bluebird");
const express = require("express");
const router = express.Router();
const memoizee = require("memoizee");
const { getRepoCommits, getNextPage } = require("./github");
const { getGif } = require("./giphy");

const fetchCommits = memoizee(link => getRepoCommits(link), {
  maxAge: 1000 * 60 * 15
}); // 15 minutes

const fetchGif = memoizee((message, is_mobile) => getGif(message, is_mobile), {
  maxAge: 1000 * 60 * 15
});

router.get("/api/repo", (req, res, next) => {
  let link = req.query.url;
  if (!link) {
    res.status(400).send("No repo link provided!");
  }

  fetchCommits(link)
    .then(commits => mapCommits(commits, req.is_mobile))
    .then(gifs => res.send(gifs))
    .catch(next);
});

router.put("/api/repo", (req, res, next) => {
  let link = req.body.link;
  getNextPage(link)
    .then(commits => mapCommits(commits, req.is_mobile))
    .then(gifs => res.send(gifs))
    .catch(next);
});

const mapCommits = (data, is_mobile = false) => {
  let { repo, commits, hasNextPage, link } = data;
  return Promise.map(commits, async commitObject => {
    let gif = await fetchGif(commitObject.commit.message, is_mobile);
    let { author } = commitObject;
    return {
      url: gif.url,
      message: gif.message,
      author: {
        name: author && author.login,
        url: author && author.html_url
      },
      hasNextPage: commitObject.hasNextPage,
      link: commitObject.link
    };
  }).then(gifs => {
    return {
      repo,
      gifs,
      hasNextPage,
      link
    };
  });
};

module.exports = router;
