# 🌿 Liquid Garden

A beautifully crafted, offline-friendly **digital garden simulator** built with React, Vite and Tailwind CSS.  Nurture your virtual plants, watch them grow, and relax along the way.

---

## Features

- **Interactive Plant Care** – Water, sun-bathe, and talk to your plants; each action affects their health, love and growth.
- **Seasonal Plant Collection** – 9+ plant types spanning spring, summer, autumn and winter.
- **Dynamic ASCII Art** – Plants visually change as they progress through growth stages.
- **Gamification** – Achievement badges, confetti, sound effects 🎉
- **Multilingual** – Full UI in **English** and **日本語**.
- **PWA / Offline** – Service-worker powered; your garden lives even without the Internet.
- **Data Backup & Restore** – Export / import your garden as JSON.

## Tech Stack

| Layer | Libraries |
|-------|-----------|
| UI    | React 18, TypeScript, Tailwind CSS, Framer-Motion |
| State | Zustand |
| Tooling | Vite, Vitest, Playwright |
| PWA   | Workbox (service-worker) |

## Getting Started

```bash
# 1. Clone
$ git clone https://github.com/your-org/liquid-garden.git
$ cd liquid-garden

# 2. Install dependencies
$ npm install

# 3. Start dev server
$ npm run dev

# 4. Open
# Navigate to http://localhost:5173 in your browser
```

### Production Build

```bash
$ npm run build
$ npm run preview   # Local preview of the build output
```

### Testing

```bash
# Unit & component tests
$ npm run test

# End-to-end tests (Playwright)
$ npm run test:e2e
```

## Folder Structure (~/src)

```
components/   – Reusable UI & plant-related components
hooks/        – Custom React hooks (sound, confetti, etc.)
data/         – Static configs (plant stats, release notes)
stores/       – Zustand state stores
utils/        – Helper utilities (i18n, personalities …)
```

## Contributing

1. Fork the repo & create a feature branch.
2. Follow the ESLint + Prettier rules.
3. Add / update tests where appropriate.
4. Submit a PR.

## License

MIT
