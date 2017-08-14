const url = require("url");
const githubAPI = require("github");
const Promise = require("bluebird");
const GH_CLIENT_ID = process.env.GH_CLIENT_ID;
const GH_CLIENT_SECRET = process.env.GH_CLIENT_SECRET;

const github = new githubAPI({
  Promise,
  headers: {
    "user-agent": "andrewgrinko-gifcommits"
  }
});

github.authenticate({
  type: "oauth",
  key: GH_CLIENT_ID,
  secret: GH_CLIENT_SECRET
});

const service = {
  getRepoCommits: async repoUrl => {
    const parsedUrl = url.parse(repoUrl);
    const pathname = parsedUrl.pathname;
    const [owner, repo] = pathname.split("/").slice(1);

    const result = await github.repos.getCommits({ owner, repo });

    const link = result.meta && result.meta.link;

    return {
      repo: {
        name: repo,
        url: `https://github.com/${owner}/${repo}`
      },
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
    return Promise.resolve({
      hasNextPage: false,
      link: null
    });
  }
};

module.exports = service;
