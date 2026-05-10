import type { Request, Response, NextFunction } from 'express';
import { listDrawsQuerySchema } from '../schemas/draw.schema.js';
import * as drawService from '../services/drawService.js';

export async function listDraws(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = listDrawsQuerySchema.parse(req.query);
    const result = await drawService.listDraws(query);
    if (result.warning) {
      res.setHeader('X-Filter-Warning', result.warning);
    }
    const { warning: _warning, ...payload } = result;
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function listDrawRangeOptions(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await drawService.listDrawRangeOptions();
    res.json(result);
  } catch (err) {
    next(err);
  }
}
