import { Op, type WhereOptions } from 'sequelize';
import { Draw } from '../models/Draw.js';
import { dayBoundsUtc } from '../utils/date.js';

export interface ListDrawsFilter {
  date?: string;
  drawNumbers?: number[];
  fromDraw?: number;
  toDraw?: number;
  page: number;
  pageSize: number;
}

export interface ListDrawsResult {
  rows: Draw[];
  total: number;
}

export async function listDraws(filter: ListDrawsFilter): Promise<ListDrawsResult> {
  const where: WhereOptions = {};

  if (filter.date) {
    const { start, end } = dayBoundsUtc(filter.date);
    Object.assign(where, { drawnAt: { [Op.gte]: start, [Op.lt]: end } });
  }

  const drawNumberConditions: Record<symbol, unknown> = {};
  if (filter.drawNumbers && filter.drawNumbers.length > 0) {
    drawNumberConditions[Op.in] = filter.drawNumbers;
  }
  if (filter.fromDraw !== undefined) {
    drawNumberConditions[Op.gte] = filter.fromDraw;
  }
  if (filter.toDraw !== undefined) {
    drawNumberConditions[Op.lte] = filter.toDraw;
  }
  if (Object.getOwnPropertySymbols(drawNumberConditions).length > 0) {
    Object.assign(where, { drawNumber: drawNumberConditions });
  }

  const offset = (filter.page - 1) * filter.pageSize;

  const { rows, count } = await Draw.findAndCountAll({
    where,
    order: [
      ['drawnAt', 'DESC'],
      ['drawNumber', 'DESC'],
    ],
    offset,
    limit: filter.pageSize,
  });

  return { rows, total: count };
}

export async function listAllDrawNumbersDesc(): Promise<number[]> {
  const rows = await Draw.findAll({
    attributes: ['drawNumber'],
    order: [['drawNumber', 'DESC']],
  });
  return rows.map((r) => r.drawNumber);
}
