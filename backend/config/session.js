const MongoStore = require('connect-mongo');

const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60;

function createSessionConfig({
  mongoUrl = process.env.MONGO_URI,
  sessionSecret = process.env.SESSION_SECRET,
  nodeEnv = process.env.NODE_ENV,
  storeFactory = MongoStore,
} = {}) {
  if (!mongoUrl) {
    throw new Error('MONGO_URI is required to configure the session store');
  }

  return {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storeFactory.create({
      mongoUrl,
      ttl: SESSION_TTL_SECONDS,
    }),
    cookie: {
      secure: nodeEnv === 'production',
    },
  };
}

module.exports = {
  SESSION_TTL_SECONDS,
  createSessionConfig,
};
