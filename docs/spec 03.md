# Spec 03 - Backend API & Database for Vietlott Keno

> Continues from `spec 01.md` (frontend layout + mock data) and `spec 02.md` (row redesign + multi-draw & range filters). This spec **replaces the mock data layer** (`website/src/data/mockKenoData.js`) with a real backend and persistent database. Frontend layout, styling, and filter UX defined in spec 01 / 02 remain unchanged — only the data source changes.

---

## 1. Goals

1. Stand up a Node.js + TypeScript + Express backend that serves Keno draw data.
2. Persist draws in Neon (Serverless PostgreSQL) via Sequelize.
3. Expose REST endpoints that satisfy every filter introduced in spec 01 and spec 02:
   - Date filter (`Ngay`)
   - Multi-draw filter (`Ky`, semicolon-separated, see spec 02 §3a)
   - Draw range filter (`Tu ky` / `Den ky`, see spec 02 §3b)
   - Pagination at 20 results per page (spec 02 §2)
4. Seed the database from the same generator logic currently in `mockKenoData.js` so the UI renders identically the first time it talks to the API.
5. Wire the existing React app to call the API instead of importing the mock module.

Out of scope for spec 03: authentication, admin write endpoints, real-time draw ingestion, other lottery types (Mega/Power/Max3D), caching layer.

---

## 2. Tech Stack

### Backend
- **Runtime**: Node.js (LTS, >= 20)
- **Language**: TypeScript (strict mode)
- **Framework**: Express.js
- **ORM**: Sequelize (with `sequelize-typescript` decorators, or plain Sequelize + TS models — pick one and stay consistent)
- **Validation**: `zod` for request input parsing
- **Env management**: `dotenv`
- **Dev tooling**: `tsx` (or `ts-node-dev`) for hot reload, `eslint` + `prettier` matching the website's style

### Database
- **Neon Serverless PostgreSQL** (a single project + main branch is enough for spec 03)
- Use the pooled connection string (`-pooler` host) for the Express app — Sequelize opens many short connections and Neon's pooler handles that better than a direct connection.

---

## 3. Repository Layout

Add a sibling `backend/` directory next to the existing `website/`:

```
Vietlott-Utils-Web/
  website/          # existing React app (spec 01 + 02)
  backend/          # NEW
    src/
      config/
        env.ts            # parse + validate process.env
        database.ts       # Sequelize instance, Neon connection
      models/
        Draw.ts           # Sequelize model for keno_draws
        index.ts          # model registry
      repositories/
        drawRepository.ts # query builder for filters + pagination
      services/
        drawService.ts    # orchestration: validation -> repo -> DTO
      controllers/
        drawController.ts # Express handlers
      routes/
        index.ts
        draws.ts
      middlewares/
        errorHandler.ts
        requestLogger.ts
      schemas/
        draw.schema.ts    # zod request schemas
      seeds/
        seedDraws.ts      # ports mockKenoData generator
      migrations/
        20260503-init.ts  # creates keno_draws table + indexes
      utils/
        pagination.ts
        date.ts
      app.ts              # Express app factory (no listen)
      server.ts           # entrypoint, starts HTTP listener
    .env.example
    .sequelizerc
    package.json
    tsconfig.json
    eslint.config.js
  docs/
```

---

## 4. Database Schema

### Table `keno_draws`

Matches the shape returned by `generateDraws()` in `website/src/data/mockKenoData.js` so the frontend can keep its current shape (after a thin DTO step).

| Column            | Type            | Constraints                              | Notes |
|-------------------|-----------------|------------------------------------------|-------|
| `id`              | `BIGSERIAL`     | PRIMARY KEY                              | Surrogate PK. |
| `draw_number`     | `INTEGER`       | UNIQUE, NOT NULL                         | E.g. `278001`. This is the user-facing "Ky" value. |
| `drawn_at`        | `TIMESTAMPTZ`   | NOT NULL                                 | Single source of truth for date + time. |
| `numbers`         | `SMALLINT[]`    | NOT NULL, length = 20, sorted asc        | The 20 drawn numbers (1–80). Stored already sorted. |
| `even_count`      | `SMALLINT`      | NOT NULL, CHECK 0..20                    | Derived but persisted to keep filtering / stats cheap. |
| `odd_count`       | `SMALLINT`      | NOT NULL, CHECK 0..20                    | |
| `big_count`       | `SMALLINT`      | NOT NULL, CHECK 0..20                    | Numbers >= 41. |
| `small_count`     | `SMALLINT`      | NOT NULL, CHECK 0..20                    | |
| `even_odd_badge`  | `VARCHAR(8)`    | NOT NULL, CHECK IN ('chan','le','hoacl') | Same enum strings the frontend already uses. |
| `big_small_badge` | `VARCHAR(8)`    | NOT NULL, CHECK IN ('lon','be','hoalb')  | |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL DEFAULT now()                   | Sequelize-managed. |
| `updated_at`      | `TIMESTAMPTZ`   | NOT NULL DEFAULT now()                   | Sequelize-managed. |

### Indexes
- `UNIQUE (draw_number)` — needed for upsert + multi-draw lookups.
- `INDEX (drawn_at DESC)` — list endpoint orders newest-first.
- `INDEX (draw_number DESC)` — range filter scans.

### Why persist derived counts/badges
- The frontend currently consumes them directly. Computing them at query time is fine, but storing them keeps the API a thin pass-through and lets us add a check constraint guarding draws that fail the 20-number invariant.
- They are immutable per draw (a draw never changes after publication), so there is no consistency risk.

---

## 5. Sequelize Model

`backend/src/models/Draw.ts`:

```ts
// Sketch — actual decorators / imports depend on whether we use sequelize-typescript or plain Sequelize.
export interface DrawAttributes {
  id: number;
  drawNumber: number;
  drawnAt: Date;
  numbers: number[];          // length 20, ascending
  evenCount: number;
  oddCount: number;
  bigCount: number;
  smallCount: number;
  evenOddBadge: 'chan' | 'le' | 'hoacl';
  bigSmallBadge: 'lon' | 'be' | 'hoalb';
  createdAt: Date;
  updatedAt: Date;
}
```

Field naming convention: camelCase in JS, snake_case in DB (`underscored: true` on the model).

---

## 6. API Design

Base path: `/api/v1`

### 6.1 `GET /api/v1/draws`

List draws with filters and pagination. Supports every filter from spec 01 §2a and spec 02 §3.

#### Query parameters

| Param        | Type      | Spec ref          | Notes |
|--------------|-----------|-------------------|-------|
| `date`       | `YYYY-MM-DD` | spec 01 §2a    | Filter to draws whose `drawn_at` falls on that calendar day in Asia/Ho_Chi_Minh time. |
| `drawNumbers`| string    | spec 02 §3a       | Semicolon-separated list of draw numbers, e.g. `278001;278005`. Whitespace tolerated. Each must be 6 digits numeric. Empty or `0` = ignored. |
| `fromDraw`   | integer   | spec 02 §3b       | Inclusive lower bound for `draw_number`. |
| `toDraw`     | integer   | spec 02 §3b       | Inclusive upper bound. If `fromDraw > toDraw`, swap server-side and include a warning header `X-Filter-Warning: range-swapped`. |
| `page`       | integer   | spec 02 §2        | 1-based, default 1. |
| `pageSize`   | integer   |                   | Default 20, max 100. Frontend always sends 20. |

Filters combine with AND, matching spec 02 §3d.

The `Bo so` field (highlight-only) is **not** sent to the backend — it stays a client-side highlight as defined in spec 02 §3d.

#### Response `200 OK`

```json
{
  "data": [
    {
      "id": 278040,
      "drawNumber": 278040,
      "date": "27/04/2026",
      "time": "14:54",
      "dateRaw": "2026-04-27",
      "numbers": [1, 2, 11, 13, 18, 20, 22, 28, 33, 34, 35, 40, 41, 44, 51, 52, 53, 57, 62, 78],
      "evenCount": 10,
      "oddCount": 10,
      "bigCount": 8,
      "smallCount": 12,
      "evenOddBadge": "hoacl",
      "bigSmallBadge": "be"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 40,
    "totalPages": 2
  }
}
```

The DTO field names + formats (`date` as `dd/MM/yyyy`, `time` as `HH:mm`, `dateRaw` as `yyyy-MM-dd`) **must match** the existing `mockKenoData` shape so the frontend components (`ResultRow.jsx` etc.) keep working without prop changes.

Default ordering: `drawn_at DESC, draw_number DESC` — newest first, matching the current UI.

### 6.2 `GET /api/v1/draws/range-options`

Supplies values for the searchable `Tu ky` / `Den ky` dropdowns (spec 02 §3b). Returns the full list of draw numbers, newest first, so the frontend combobox can filter client-side.

```json
{
  "data": [278040, 278039, 278038, ...]
}
```

If the dataset grows beyond ~5k draws, switch this to a `?q=` server-side search; for spec 03's seed size (40 rows) the full list is fine.

### 6.3 `GET /api/v1/health`

Liveness probe. Returns `{ "status": "ok", "db": "ok" | "down" }` after a `SELECT 1` against Neon. Useful for Neon's cold-start behavior and for the deploy target's healthcheck.

### 6.4 Error format

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

Codes used in spec 03:
- `VALIDATION_ERROR` (400) — zod parse failure
- `NOT_FOUND` (404)
- `INTERNAL_ERROR` (500)

---

## 7. Validation Rules (zod)

`backend/src/schemas/draw.schema.ts` — request schemas:

- `date`: optional, regex `/^\d{4}-\d{2}-\d{2}$/`, must be a real calendar date.
- `drawNumbers`: optional, parsed by splitting on `;`, trimming, dropping empties; each remaining token must match `/^\d{6}$/`. After parsing, if the array is empty or equal to `["0"]`, treat the filter as absent.
- `fromDraw`, `toDraw`: optional integers, 6-digit range.
- `page`: optional, integer >= 1, default 1.
- `pageSize`: optional, integer in `[1, 100]`, default 20.

All unknown query params are rejected (`strict()`) so frontend bugs surface early.

---

## 8. Configuration & Secrets

`backend/.env.example`:

```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://<user>:<pass>@<project>-pooler.<region>.aws.neon.tech/<db>?sslmode=require
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
```

Rules:
- `.env` is gitignored. Only `.env.example` is committed.
- `DATABASE_URL` always uses the `-pooler` Neon host for the running app.
- Sequelize `dialectOptions.ssl = { require: true, rejectUnauthorized: false }` (Neon requires SSL).
- `CORS_ORIGIN` is enforced — only the Vite dev server (`5173`) and the deployed frontend origin are allowed.
- Migrations and seeds (one-shot scripts) may use the **direct** (non-pooled) connection string via `DATABASE_URL_DIRECT` to avoid pooler quirks; if not set, fall back to `DATABASE_URL`.

---

## 9. Migrations & Seeding

### Migrations
- Use `sequelize-cli` (`.sequelizerc` points to `src/migrations`, `src/models`, etc.).
- Initial migration `20260503-init.ts` creates the `keno_draws` table, the unique index, and the secondary indexes from §4.
- Migrations are TypeScript and compiled / run via `tsx`.

### Seed: `backend/src/seeds/seedDraws.ts`
- Port the generator from `website/src/data/mockKenoData.js` to TypeScript.
- Generate **40 draws** (matches spec 02 §4) with sequential `draw_number` starting at `278001` and timestamps spaced 10 minutes apart, ending at "now".
- Use `bulkCreate({ updateOnDuplicate: ['drawnAt', 'numbers', ...] })` so re-running the seed is idempotent.
- npm scripts:
  - `npm run db:migrate`
  - `npm run db:migrate:undo`
  - `npm run db:seed`
  - `npm run db:reset` — undo all + migrate + seed (dev only; refuses to run if `NODE_ENV=production`).

---

## 10. Frontend Integration

Changes in `website/`:

1. Add `VITE_API_BASE_URL` to a new `.env.local` (default `http://localhost:4000/api/v1`).
2. Create `website/src/api/drawsApi.js` (or `.ts` if TS gets adopted there) exposing:
   - `fetchDraws({ date, drawNumbers, fromDraw, toDraw, page, pageSize })`
   - `fetchDrawRangeOptions()`
3. Refactor `KenoResults` (the parent that currently imports `mockKenoData`) to:
   - Move filter state into URL query params or `useState` + `useEffect` that calls `fetchDraws` whenever filters change.
   - Show a lightweight loading state and an error banner on failure.
   - Keep `Bo so` as a purely client-side highlight (do not send to API).
4. Delete `website/src/data/mockKenoData.js` once the integration works end-to-end. The `menuData.js` file stays — it's static UI data, not Keno data.

The DTO contract in §6.1 is intentionally identical to the current mock shape so no `ResultRow.jsx` / `Pagination.jsx` props need to change.

---

## 11. Local Development Workflow

1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and paste the Neon pooled connection string.
3. `npm run db:migrate && npm run db:seed`
4. `npm run dev` — Express on `http://localhost:4000`
5. In another terminal: `cd website && npm run dev` — Vite on `http://localhost:5173`
6. Open the browser; the Keno page should now render data from Neon, with filters and pagination behaving as in spec 02.

A `Verify` checklist for the implementation to count as done:
- [ ] `GET /api/v1/health` returns `db: "ok"` against Neon.
- [ ] `GET /api/v1/draws?page=1&pageSize=20` returns 20 rows newest-first.
- [ ] `GET /api/v1/draws?drawNumbers=278001;278005;278010` returns exactly those 3 rows.
- [ ] `GET /api/v1/draws?fromDraw=278010&toDraw=278020` returns 11 rows.
- [ ] `GET /api/v1/draws?date=<today>` returns only draws whose `drawn_at` is today in Asia/Ho_Chi_Minh.
- [ ] Frontend page renders identically to spec 02 with the mock removed.
- [ ] Re-running `db:seed` does not duplicate rows.

---

## 12. Non-Goals / Future Specs

- **Spec 04 (likely)**: ingest real Vietlott Keno results on a schedule (cron + scraper or official feed) and dedupe against `keno_draws`.
- **Spec 05+**: stats endpoints (`Thong Ke`), other lottery types, admin authentication, caching layer, rate limiting.
