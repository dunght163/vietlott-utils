import { sequelize } from '../config/database.js';
import { Draw, type EvenOddBadge, type BigSmallBadge } from '../models/Draw.js';

const TOTAL_DRAWS = 40;
const FIRST_DRAW_NUMBER = 278001;
const MINUTES_BETWEEN_DRAWS = 10;

interface SeedDraw {
  drawNumber: number;
  drawnAt: Date;
  numbers: number[];
  evenCount: number;
  oddCount: number;
  bigCount: number;
  smallCount: number;
  evenOddBadge: EvenOddBadge;
  bigSmallBadge: BigSmallBadge;
}

function pick20UniqueNumbers(): number[] {
  const used = new Set<number>();
  const numbers: number[] = [];
  while (numbers.length < 20) {
    const n = Math.floor(Math.random() * 80) + 1;
    if (!used.has(n)) {
      used.add(n);
      numbers.push(n);
    }
  }
  return numbers.sort((a, b) => a - b);
}

function generateDraws(): SeedDraw[] {
  const now = new Date();
  const draws: SeedDraw[] = [];

  for (let i = 0; i < TOTAL_DRAWS; i++) {
    const numbers = pick20UniqueNumbers();
    const evenCount = numbers.filter((n) => n % 2 === 0).length;
    const oddCount = 20 - evenCount;
    const bigCount = numbers.filter((n) => n >= 41).length;
    const smallCount = 20 - bigCount;

    const evenOddBadge: EvenOddBadge =
      evenCount > oddCount ? 'chan' : oddCount > evenCount ? 'le' : 'hoacl';
    const bigSmallBadge: BigSmallBadge =
      bigCount > smallCount ? 'lon' : smallCount > bigCount ? 'be' : 'hoalb';

    const drawnAt = new Date(now.getTime() - i * MINUTES_BETWEEN_DRAWS * 60_000);

    draws.push({
      drawNumber: FIRST_DRAW_NUMBER + (TOTAL_DRAWS - 1 - i),
      drawnAt,
      numbers,
      evenCount,
      oddCount,
      bigCount,
      smallCount,
      evenOddBadge,
      bigSmallBadge,
    });
  }

  return draws;
}

export async function seedDraws(): Promise<void> {
  const draws = generateDraws();

  await Draw.bulkCreate(draws, {
    updateOnDuplicate: [
      'drawnAt',
      'numbers',
      'evenCount',
      'oddCount',
      'bigCount',
      'smallCount',
      'evenOddBadge',
      'bigSmallBadge',
      'updatedAt',
    ],
  });

  console.log(`Seeded ${draws.length} keno draws.`);
}

async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    await seedDraws();
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    await sequelize.close().catch(() => {});
    process.exit(1);
  }
}

const invokedDirectly = process.argv[1]?.endsWith('seedDraws.ts') || process.argv[1]?.endsWith('seedDraws.js');
if (invokedDirectly) {
  void main();
}
