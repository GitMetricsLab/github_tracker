const logger = require('../logger');

const validateEnv = () => {
    const requiredVars = [
        'MONGO_URI',
        'PORT',
        'SESSION_SECRET',
        'CLIENT_URL',
        'NODE_ENV',
    ];

    const missingVars = requiredVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
        logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }

    logger.info('Environment variables validated ✓');
};

module.exports = { validateEnv };