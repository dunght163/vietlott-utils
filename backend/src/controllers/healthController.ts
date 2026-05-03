import type { Request, Response } from 'express';
import { sequelize } from '../config/database.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  let dbOk = false;
  try {
    await sequelize.query('SELECT 1');
    dbOk = true;
  } catch {
    dbOk = false;
  }
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    db: dbOk ? 'ok' : 'down',
  });
}
