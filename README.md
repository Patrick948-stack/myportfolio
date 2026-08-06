# Patrick Mulikuza — Personal Portfolio

My personal corner of the internet. A Next.js 16 site covering what I've been working on with a self-service admin panel so I can update any of it without changing the source code.

## What's inside

- **Hero, About, Services, Portfolio, Contact** : editable from `/admin`, backed by Postgres. Change a headline, add an Experience entry, upload a new project thumbnail.
- **Personal Writing** : a rich-text article editor (Tiptap) at `/admin/writing`, plus support for simple link-out cards to articles hosted elsewhere. The section disappears entirely from the site when there are no published articles.
- **Research & Writing** : academic and personal papers, available to read as PDFs. Kept static and outside the CMS on purpose.
- **A 3D Everest elevation map, a WebGL hero scene, and generative UI sound** — Plotly, Three.js, and the Web Audio API, all lazy-loaded so they don't cost anything until they're actually on screen.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · PostgreSQL (via `pg`) · Zod · Tiptap · Vercel Blob · Vitest + React Testing Library


## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD_HASH, BLOB_READ_WRITE_TOKEN
npm run hash-password -- "your-chosen-password"   # paste the printed line into .env.local
npm run db:migrate            # creates the database tables
npm run db:seed-content       # seeds Hero/About/Services/Portfolio/Contact/Writing with their current content
npm run dev
```

Then visit `http://localhost:3000` for the site, or `http://localhost:3000/admin` to log in and edit it.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:migrate` | Apply any new SQL files in `db/migrations/` |
| `npm run db:seed-content` | Seed `site_content` rows that don't exist yet (safe to re-run) |
| `npm run hash-password -- "..."` | Print a bcrypt hash formatted for `.env.local` |

## Project structure

```
app/            Routes — the public site, the blog, and the /admin CMS
components/     UI components; components/admin/ is the CMS-only editor UI
lib/            Data access, auth/session, and validation — no React in here
content/blog/   Legacy Markdown blog posts (new writing goes through /admin instead)
data/           Research & Writing papers — the one section still a static array
db/migrations/  Plain, ordered .sql files
scripts/        One-off Node scripts (migrate, seed, password hashing)
tests/          Vitest + React Testing Library, mirroring the source layout
```
