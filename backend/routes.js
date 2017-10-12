const Promise = require("bluebird");
const express = require("express");
const router = express.Router();
const memoizee = require("memoizee");
const { getRepoCommits, getNextPage } = require("./github");
const { getGif } = require("./giphy");

const fetchCommits = memoizee(link => getRepoCommits(link), {
  maxAge: 1000 * 60 * 60
}); // 1 hour

const fetchGif = memoizee(
  (message, repo, is_mobile) => getGif(message, is_mobile),
  {
    maxAge: 1000 * 60 * 60
  }
);

router.get("/api/repo", (req, res, next) => {
  let link = req.query.url;
  if (!link) {
    return res.status(400).send("No repo link provided!");
  }

  if (link.indexOf("github.com/") === -1) {
    return res.status(400).send("Please provide a valid link.");
  }

  fetchCommits(link)
    .then(commits => mapCommits(commits, req.is_mobile))
    .then(gifs => res.send(gifs))
    .catch(e => {
      if (e.message === `Didn't understand that link, sorry!`) {
        return res.status(400).send(e.message);
      }
      return next(e);
    });
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
    let gif = await fetchGif(commitObject.commit.message, repo, is_mobile);
    let { author } = commitObject;
    return gif
      ? {
          url: gif.url,
          message: gif.message,
          author: {
            name: author && author.login,
            url: author && author.html_url
          }
        }
      : null;
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
