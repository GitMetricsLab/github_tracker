const express = require('express');
const request = require('supertest');
const session = require('express-session');

const { SESSION_TTL_SECONDS, createSessionConfig } = require('../backend/config/session');

class TestSessionStore extends session.Store {
  constructor() {
    super();
    this.sessions = new Map();
  }

  get(sid, callback) {
    const sessionData = this.sessions.get(sid);
    callback(null, sessionData ? JSON.parse(sessionData) : null);
  }

  set(sid, sessionData, callback) {
    this.sessions.set(sid, JSON.stringify(sessionData));
    callback(null);
  }

  destroy(sid, callback) {
    this.sessions.delete(sid);
    callback(null);
  }
}

function createStoreFactory(store = new TestSessionStore()) {
  const calls = [];

  return {
    calls,
    store,
    create(options) {
      calls.push(options);
      return store;
    },
  };
}

describe('Session configuration', () => {
  it('initializes connect-mongo with the configured Mongo URL and TTL', () => {
    const storeFactory = createStoreFactory();

    const config = createSessionConfig({
      mongoUrl: 'mongodb://127.0.0.1:27017/github_tracker_test',
      sessionSecret: 'test-secret',
      storeFactory,
    });

    expect(storeFactory.calls).toEqual([{
      mongoUrl: 'mongodb://127.0.0.1:27017/github_tracker_test',
      ttl: SESSION_TTL_SECONDS,
    }]);
    expect(config.store).toBe(storeFactory.store);
    expect(SESSION_TTL_SECONDS).toBe(14 * 24 * 60 * 60);
  });

  it('does not fall back to express-session MemoryStore', () => {
    const config = createSessionConfig({
      mongoUrl: 'mongodb://127.0.0.1:27017/github_tracker_test',
      sessionSecret: 'test-secret',
      storeFactory: createStoreFactory(),
    });

    expect(config.store).toBeDefined();
    expect(config.store instanceof session.MemoryStore).toBeFalse();
  });

  it('uses secure cookies in production only', () => {
    const productionConfig = createSessionConfig({
      mongoUrl: 'mongodb://127.0.0.1:27017/github_tracker_test',
      sessionSecret: 'test-secret',
      nodeEnv: 'production',
      storeFactory: createStoreFactory(),
    });
    const developmentConfig = createSessionConfig({
      mongoUrl: 'mongodb://127.0.0.1:27017/github_tracker_test',
      sessionSecret: 'test-secret',
      nodeEnv: 'development',
      storeFactory: createStoreFactory(),
    });

    expect(productionConfig.cookie.secure).toBeTrue();
    expect(developmentConfig.cookie.secure).toBeFalse();
  });

  it('requires MongoDB configuration for persistent sessions', () => {
    expect(() => createSessionConfig({
      mongoUrl: '',
      sessionSecret: 'test-secret',
      storeFactory: createStoreFactory(),
    })).toThrowError(/MONGO_URI/);
  });

  it('persists session data through the configured store', async () => {
    const app = express();

    app.use(session(createSessionConfig({
      mongoUrl: 'mongodb://127.0.0.1:27017/github_tracker_test',
      sessionSecret: 'test-secret',
      storeFactory: createStoreFactory(),
    })));
    app.get('/count', (req, res) => {
      req.session.views = (req.session.views || 0) + 1;
      res.json({ views: req.session.views });
    });

    const agent = request.agent(app);

    await agent.get('/count').expect(200, { views: 1 });
    await agent.get('/count').expect(200, { views: 2 });
  });
});
