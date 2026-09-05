# Blindfold

A Codeforces practice tool that gives you a random problem from your chosen rating range — while quietly giving more chances to the topics and difficulty you actually want to practice.

The catch?

**You decides what you get but blindfolded.** 👀

You know the rating, tags but still you know nothing "JOHN SNOW".

You have the power to reveal them whenever you want although.

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

You can also tell Blindfold how difficult you want the problems to be within your selected rating range.

So you know **what you want to practice**, but you don't necessarily know **which problem was picked because of it**.

---

## What's here? 🚀

Blindfold includes:

* 🎯 Rating-range based recommendations
* 🧠 Custom tag biasing from **-75% to +75%**
* 🎯 Difficulty targeting within your selected rating range
* ⚖️ Balanced, Harder, and Much Harder difficulty preferences
* 🎲 Weighted random problem selection
* 🏷️ Smarter handling of problems with multiple tags
* 🕐 Preference for newer Codeforces problems
* 🚫 Excludes problems you've already solved or attempted on Codeforces
* 🚫 Excludes problems **Blindfold has already shown you**
* 👤 Codeforces handle integration
* 🔄 Manual Codeforces history sync
* 👀 Rating hidden by default
* 🏷️ Tags hidden by default
* ⏭️ Skip and get another problem
* 💾 **Local Blindfold practice history**
* 💾 Persistent user configuration

---

## Recommendation Algorithm

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

 Apply difficulty preference

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

### Difficulty targeting

Suppose you choose:

```text
Rating: 1500–1800
Difficulty: Harder
```

Blindfold will still only consider problems between **1500 and 1800**, but problems closer to the harder end of that range receive more weight.

With **Balanced**, the recommendation stays broadly distributed across the range.

With **Harder** or **Much Harder**, the probability gradually shifts toward higher-rated problems.

It is still weighted random selection though.

So even with **Much Harder**, an easier problem can still show up.

That's intentional.

---

## Codeforces history

When you sync your Codeforces handle, Blindfold fetches your submission history and figures out which problems you've:

* solved
* attempted

That information is then used to avoid recommending problems you've already worked on.

Blindfold doesn't need to contact Codeforces every time you click **Find Problem** or **Skip**.

Your synced history is reused locally, and you can sync again whenever you want.

---

## Blindfold history

Blindfold also keeps track of the problems it has already shown you.

If you skip a problem, it is added to your local Blindfold history so it won't keep coming back.

This history is stored locally in your browser.

So refreshing the page doesn't mean Blindfold suddenly forgets everything you've already seen.

---

## Architecture

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

Blindfold started with a pretty simple idea:

**What if Codeforces i could practise my weak topic but without without any spoiler of the problem's tags**

Since then, it's grown into something a little more personal — it remembers what you've already worked on, lets you control the topics and difficulty you want, and still keeps the actual recommendation unpredictable.

The goal isn't to remove control.

It's to move the control **one step away from the problem itself.**

You decide the kind of practice you want.

**You decides what you get but blindfolded.**

**### MEET BLINDFOLD. 🥂**
