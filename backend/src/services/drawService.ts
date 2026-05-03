import type { Draw } from '../models/Draw.js';
import * as drawRepository from '../repositories/drawRepository.js';
import type { ListDrawsQuery } from '../schemas/draw.schema.js';
import { formatDateRaw, formatDisplayDate, formatDisplayTime } from '../utils/date.js';

export interface DrawDto {
  id: number;
  drawNumber: number;
  date: string;
  time: string;
  dateRaw: string;
  numbers: number[];
  evenCount: number;
  oddCount: number;
  bigCount: number;
  smallCount: number;
  evenOddBadge: string;
  bigSmallBadge: string;
}

export interface ListDrawsResponse {
  data: DrawDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  warning?: string;
}

function toDto(draw: Draw): DrawDto {
  return {
    id: draw.drawNumber,
    drawNumber: draw.drawNumber,
    date: formatDisplayDate(draw.drawnAt),
    time: formatDisplayTime(draw.drawnAt),
    dateRaw: formatDateRaw(draw.drawnAt),
    numbers: draw.numbers,
    evenCount: draw.evenCount,
    oddCount: draw.oddCount,
    bigCount: draw.bigCount,
    smallCount: draw.smallCount,
    evenOddBadge: draw.evenOddBadge,
    bigSmallBadge: draw.bigSmallBadge,
  };
}

export async function listDraws(query: ListDrawsQuery): Promise<ListDrawsResponse> {
  let { fromDraw, toDraw } = query;
  let warning: string | undefined;

  if (fromDraw !== undefined && toDraw !== undefined && fromDraw > toDraw) {
    [fromDraw, toDraw] = [toDraw, fromDraw];
    warning = 'range-swapped';
  }

  const { rows, total } = await drawRepository.listDraws({
    date: query.date,
    drawNumbers: query.drawNumbers,
    fromDraw,
    toDraw,
    page: query.page,
    pageSize: query.pageSize,
  });

  return {
    data: rows.map(toDto),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    },
    warning,
  };
}

export async function listDrawRangeOptions(): Promise<{ data: number[] }> {
  const data = await drawRepository.listAllDrawNumbersDesc();
  return { data };
}
