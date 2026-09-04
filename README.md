# Blindfold

A Codeforces practice tool that recommends problems within a rating range while giving selected tags a higher or lower probability of being chosen — **without revealing the problem's rating or tags by default.**

The idea is simple:

> **Practice without knowing what you're practicing.**

Blindfold uses a **weighted recommendation engine** rather than simply picking a random problem. You choose a rating range and assign biases to topics you want to practice more or less. The recommendation engine then uses those preferences to influence which eligible problem gets selected while keeping the process probabilistic.

## Status

**V1 — Working**

The current V1 includes:

* Next.js App Router + TypeScript + Tailwind CSS
* Warm editorial visual design system
* Rating-range configuration
* Codeforces problem fetching and normalization
* Tag-bias configuration
* Weighted problem recommendation engine
* Rating-based filtering
* Tag-preference weighting
* Recency preference for newer Codeforces problems
* Weighted random selection
* Practice screen with hidden problem rating
* Optional rating reveal
* Optional tag reveal
* Skip/recommend-again functionality

### Recommendation flow

```text
User configuration
       │
       ├── Rating range
       └── Tag preferences
              │
              ▼
       Eligible problems
              │
              ▼
        Topic weighting
              │
              ▼
        Recency weighting
              │
              ▼
      Weighted random choice
              │
              ▼
       Selected problem
              │
              ▼
     Practice without spoilers
```

The recommendation engine lives separately from the UI in:

```text
lib/recommender.ts
```

Codeforces data fetching and normalization lives in:

```text
lib/codeforces.ts
```

Shared TypeScript types live in:

```text
lib/types.ts
```

This separation is intentional so the recommendation system can become more sophisticated in later versions without coupling it to the frontend.

## Getting started

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

To check the production build:

```bash
npm run build
npm start
```

## Design system

Blindfold intentionally avoids the typical developer-tool aesthetic of dark backgrounds, neon blue/purple gradients, glowing cards, and excessive glassmorphism.

The visual direction is inspired by:

* editorial design
* academic notebooks
* competitive programming tools
* warm paper/parchment
* restrained, premium interfaces

The primary palette uses:

* warm parchment/off-white backgrounds
* deep olive for structure
* espresso/dark brown for text
* muted terracotta for accents
* subtle warm borders

Typography pairs **Newsreader** for editorial headlines with **IBM Plex Sans** for interface text and **IBM Plex Mono** for actual data such as ratings, contest IDs, and percentages.

Colors and typography are defined through the project's global styling system.

## Project structure

```text
blindfold/
├── app/
│   ├── page.tsx
│   ├── practice/
│   │   └── page.tsx
│   └── globals.css
│
├── components/
│   ├── PracticeConfig.tsx
│   ├── RatingRange.tsx
│   ├── TagBias.tsx
│   └── ProblemCard.tsx
│
├── lib/
│   ├── codeforces.ts
│   ├── recommender.ts
│   └── types.ts
│
├── public/
├── package.json
└── README.md
```

## Vision

Blindfold is intentionally being developed in versions rather than trying to build the entire system at once.
So expect some more versions and cool features form us in near future bro. 

##### MEET V1 for now. 

Future versions will be built on this foundation with features such as personal Codeforces history, solved-problem filtering, better difficulty targeting, practice sessions, analytics, and adaptive recommendations.
