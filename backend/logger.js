const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console({ format: combine(colorize(), timestamp(), logFormat) }),
  ],
});

module.exports = logger;
