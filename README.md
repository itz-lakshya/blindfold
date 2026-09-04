# Blindfold

A Codeforces practice tool that gives you a random problem from your chosen rating range — while quietly giving more chances to the topics you actually want to practice.

The catch?

**You don't get to know what you're practicing.** 👀

No rating. No tags. Just the problem.

You can reveal them whenever you want.

---

## What makes Blindfold different?

Normally, when you open Codeforces and see:

```text
1700
dp, greedy, math
```

your brain already starts thinking about the solution before you've even properly read the problem.

Blindfold tries to remove that.

You choose what you want to practice, Blindfold does the selection in the background, and you just get the problem.

The recommendation isn't completely random either.

If you tell Blindfold:

```text
Bitmasks   +75%
DP         +50%
Greedy     -20%
```

then Bitmask problems become more likely to appear, while the system still keeps some randomness.

So you know **what you want to practice**, but you don't necessarily know **which problem was picked because of it**.

---

## V2 is here 🚀

**V2 builds on the V1 recommendation system and adds personalization.**

You can now connect your Codeforces handle and let Blindfold know what you've already worked on.

### V2 includes:

* 🎯 Rating-range based recommendations
* 🧠 Custom tag biasing from **-75% to +75%**
* 🎲 Weighted random problem selection
* 🏷️ Smarter handling of problems with multiple tags
* 🕐 Preference for newer Codeforces problems
* 🚫 Excludes problems you've already solved or attempted on Codeforces
* 🚫 Excludes problems *Blindfold has already shown you*
* 👤 Codeforces handle integration
* 🔄 Manual Codeforces history sync
* 👀 Rating hidden by default
* 🏷️ Tags hidden by default
* ⏭️ Skip and get another problem
* 💾 *Local Blindfold practice history*

---

## How the recommendation works

The basic idea is:

```text
All Codeforces problems
          ↓
   Your rating range
          ↓
 Remove solved problems
          ↓
Remove attempted problems
          ↓
Remove Blindfold-seen problems
          ↓
   Apply tag preferences
          ↓
     Add recency bias
          ↓
    Calculate weights
          ↓
    Weighted random pick
          ↓
       Your problem
```

The important part is the last step.

Blindfold **doesn't simply pick the problem with the highest weight**.

Instead, every problem gets a chance based on its weight.

So if one problem has a weight of `10` and another has a weight of `2`, the first one is much more likely to be picked — but it isn't guaranteed.

That's what lets Blindfold respect your preferences without turning every session into the exact same type of problem.

---

## Codeforces history

When you sync your Codeforces handle, Blindfold fetches your submission history and figures out which problems you've:

* solved
* attempted

That information is then used to avoid recommending problems you've already worked on.

Blindfold doesn't need to contact Codeforces every time you click **Find Problem** or **Skip**.

Your synced history is reused locally, and you can sync again whenever you want.

---

## V2 architecture

The recommendation logic is kept separate from the UI so we can keep improving it without turning the whole project into spaghetti.

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
│   ├── history.ts
│   └── types.ts
│
├── public/
└── README.md
```

---

## Getting started

Clone the repo and install everything:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
npm start
```

---

## The vision

Blindfold is intentionally being developed in versions rather than trying to build the entire system at once. So expect some more versions and cool features form us in near future.

**V1** was about getting the core idea working.

**V2** is about making those recommendations actually personal.

And yeah...

**this is still just the beginning.** ;)

More versions, more weird ideas, and hopefully a much smarter Blindfold coming soon.

### **MEET V2. 🥂**
