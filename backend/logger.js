const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  const stackTrace = stack ? `\n${stack}` : '';
  return `${timestamp} ${level}: ${message}${stackTrace}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  transports: [
    new transports.Console({ format: combine(errors({ stack: true }), colorize(), timestamp(), logFormat) }),
  ],
});

module.exports = logger;
