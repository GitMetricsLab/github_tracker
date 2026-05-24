const morgan = require('morgan');
const logger = require('../logger');

const morganStream = {
    write: (message) => logger.info(message.trim()),
};

const httpLogger = morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
    { stream: morganStream }
);

module.exports = httpLogger;