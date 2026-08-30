# ZESCO Unit Calculator

A web-based calculator for estimating ZESCO prepaid electricity units in Zambia. It accounts for tiered tariff bands, previous consumption, and statutory taxes to give an accurate breakdown of how many kilowatt-hours (kWh) a given purchase amount will yield.

## Features

- **Tariff Schedules** — Residential, Commercial, and Social Services bands with per-kWh rates
- **Stepped Band Calculation** — Purchases are split across tariff bands based on previous monthly consumption, so the effective rate reflects real billing logic
- **Tax Breakdown** — Optional toggle for Zambia's 3% Excise Duty and 16% VAT on electricity purchases
- **Visual Band Indicator** — Color-coded bar showing current consumption position and the range covered by the new purchase
- **Cost Breakdown** — Itemized display of net energy charge, taxes, and per-band allocation
- **Responsive Layout** — Dashboard-style grid that adapts from mobile to desktop

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Framework    | Next.js 15 (App Router)           |
| Language     | TypeScript 5.9                    |
| UI           | React 19, Tailwind CSS 4          |
| Animation    | Motion (Framer Motion)            |
| Icons        | Lucide React                      |
| Fonts        | Inter, JetBrains Mono             |
| Deployment   | Standalone output (`output: 'standalone'`) |

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `npm run dev`  | Start development server                 |
| `npm run build`| Create production build                  |
| `npm start`    | Run production server (0.0.0.0:3000)     |
| `npm run lint` | Run ESLint                               |
| `npm run clean`| Clear Next.js cache                      |

## Tariff Bands (ZMW per kWh)

| Band       | Residential | Commercial | Social Services |
| ---------- | ----------- | ---------- | --------------- |
| 0–100      | K 0.35      | K 0.66     | K 0.69          |
| 101–200    | K 1.00      | K 1.35     | K 1.04          |
| 201–400    | K 2.42      | K 2.19     | K 1.11          |
| 401+       | K 3.45      | K 3.16     | K 1.25          |

> Rates are defined in the application source. Update `TARIFF_SCHEDULES` in `app/page.tsx` when ZERA adjusts tariffs.

## Project Structure

```
app/
  layout.tsx       # Root layout with font configuration
  page.tsx         # Calculator UI and tariff logic
  globals.css      # Tailwind imports and theme tokens
  not-found.tsx    # 404 page
hooks/
  use-mobile.ts    # Mobile viewport detection hook
assets/
  .aistudio/       # AI Studio configuration
```

## License

Private — not for redistribution.
