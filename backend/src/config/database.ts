import { Sequelize } from 'sequelize';
import { env, isProduction } from './env.js';

const connectionUrl = env.DATABASE_URL;

export const sequelize = new Sequelize(connectionUrl, {
  dialect: 'postgres',
  logging: isProduction ? false : (msg) => {
    if (env.LOG_LEVEL === 'debug') console.log(msg);
  },
  define: {
    underscored: true,
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export async function testConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}
