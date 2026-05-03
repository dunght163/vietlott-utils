// Config file consumed by sequelize-cli (CommonJS-only by design).
// Loads .env so DATABASE_URL / DATABASE_URL_DIRECT are visible to the CLI.
require('dotenv').config();

const url = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

if (!url) {
  throw new Error('DATABASE_URL (or DATABASE_URL_DIRECT) must be set for sequelize-cli');
}

const baseConfig = {
  url,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};
