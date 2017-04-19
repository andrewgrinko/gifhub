const winston = require('winston');
const moment = require('moment');

const transports = [
	new winston.transports.Console({
		handleExceptions: true,
		humanReadableUnhandledException: true,
		timestamp: () => moment().format()
	})
];

const logger = new winston.Logger({
	transports: transports,
	exitOnError: false
});

module.exports = logger;
