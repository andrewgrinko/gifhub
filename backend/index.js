const express = require('express');
const bodyParser = require('body-parser');
const log = require('./providers/log');

const routes = require('./routes');

const port = process.env.port || 3000;
const app = express();

process.on('uncaughtException', function (e) {
	log.error('fatal', {error: e.message, stack: e.stack});
	process.exit(75);
});

process.on('unhandledRejection', function (e) {
	log.error('fatal', {error: e.message, stack: e.stack});
	process.exit(75);
});

app.use(bodyParser.json());
app.use('/', routes);

const server = app.listen(
	port,
	'0.0.0.0',
	() => log.info('gifhub started',
		{pid: process.pid, port: port}
	)
);

process.on('SIGINT', () => {
	server.close(e => {
		log.info('gifhub stopped', {error: e && e.message}, () => process.exit(e ? 1 : 0));
	});
});
