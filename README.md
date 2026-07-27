# TINT CSE 2026 — Our Story

Cinematic farewell website / digital yearbook for **Techno International New Town — CSE Batch 2022–2026**.

## Stack

- React + Vite + Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber (AR Hall of Memory)
- Vercel-ready static deploy

## Local

```bash
npm install
npm run dev
```

## Music

Farewell playlist lives in `public/audio/`. The speaker control plays tracks in order; AR Hall starts music when you enter.

## Deploy

Connected to GitHub → import on [Vercel](https://vercel.com) (Vite preset). Or:

```bash
npx vercel --prod
```

## Customize

Edit `src/data/content.js` for names, captions, and playlist.
