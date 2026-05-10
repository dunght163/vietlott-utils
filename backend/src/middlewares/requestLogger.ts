import type { RequestHandler } from 'express';
import { env } from '../config/env.js';

export const requestLogger: RequestHandler = (req, res, next) => {
  if (env.LOG_LEVEL === 'error' || env.LOG_LEVEL === 'warn') {
    next();
    return;
  }
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
};
