# Vietlott Backend

Express + Sequelize + Neon backend for the Vietlott Keno frontend. See `../docs/spec 03.md` for the full design.

## Setup

```bash
npm install
cp .env.example .env
# edit .env: paste your Neon pooled connection string
npm run db:migrate
npm run db:seed
npm run dev
```

Server runs at `http://localhost:4000`. API base path: `/api/v1`.

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/draws?date=&drawNumbers=&fromDraw=&toDraw=&page=&pageSize=`
- `GET /api/v1/draws/range-options`

## Scripts

- `npm run dev` — hot-reload server via `tsx`
- `npm run build` — compile to `dist/`
- `npm start` — run compiled server
- `npm run db:migrate` / `db:migrate:undo` / `db:migrate:undo:all`
- `npm run db:seed` — idempotent (upserts 40 draws)
- `npm run db:reset` — undo all + migrate + seed (refuses to run when `NODE_ENV=production`)
- `npm run lint`
