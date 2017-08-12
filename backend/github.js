const url = require("url");
const githubAPI = require("github");
const Promise = require("bluebird");

const github = new githubAPI({ Promise });

const service = {
  getRepoCommits: async repoUrl => {
    const parsedUrl = url.parse(repoUrl);
    const pathname = parsedUrl.pathname;
    const [owner, repo] = pathname.split("/").slice(1);

    const result = await github.repos.getCommits({ owner, repo });

    const link = result.meta && result.meta.link;

    return {
      commits: result.data,
      hasNextPage: github.hasNextPage(link),
      link
    };
  },

  getNextPage: link => {
    if (link && github.hasNextPage(link)) {
      return github.getNextPage(link).then(result => {
        return {
          commits: result.data,
          hasNextPage: result.meta && result.meta.link
            ? github.hasNextPage(result.meta.link)
            : false,
          link: result.meta && result.meta.link
        };
      });
    }
    return Promise.resolve(null);
  }
};

module.exports = service;
