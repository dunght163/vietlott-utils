import { z } from 'zod';

const drawNumberRegex = /^\d{6}$/;

const drawNumbersSchema = z
  .string()
  .optional()
  .transform((value, ctx) => {
    if (!value) return undefined;
    const tokens = value
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    if (tokens.length === 0) return undefined;
    if (tokens.length === 1 && tokens[0] === '0') return undefined;

    for (const token of tokens) {
      if (!drawNumberRegex.test(token)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid draw number: ${token}. Must be 6 digits.`,
        });
        return z.NEVER;
      }
    }

    return tokens.map((t) => Number(t));
  });

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'date is not a valid calendar date')
  .optional();

const drawNumberIntSchema = z
  .union([z.string().regex(drawNumberRegex), z.number().int()])
  .optional()
  .transform((v) => (v === undefined ? undefined : Number(v)));

export const listDrawsQuerySchema = z
  .object({
    date: dateSchema,
    drawNumbers: drawNumbersSchema,
    fromDraw: drawNumberIntSchema,
    toDraw: drawNumberIntSchema,
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  })
  .strict();

export type ListDrawsQuery = z.infer<typeof listDrawsQuerySchema>;
