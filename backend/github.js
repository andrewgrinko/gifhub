const url = require('url');
const githubAPI = require('github');
const Promise = require('bluebird');

const github = new githubAPI({ Promise });

module.exports.getRepoCommits = async function (repoUrl) {
	const parsedUrl = url.parse(repoUrl);
	const pathname = parsedUrl.pathname;
	const [ owner, repo ] = pathname.split('/').slice(1);

	const result = await github.repos.getCommits({ owner, repo });

	return result.data;
};
