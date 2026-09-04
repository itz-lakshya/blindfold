import PracticeConfig from "@/components/PracticeConfig";

// Illustrative widths for the "redacted" tag bars in the hero card.
// These are purely decorative — they represent the idea of hidden tags,
// not real Codeforces data. Real problems are fetched in a later task.
const REDACTED_TAG_WIDTHS = [72, 44, 96, 56];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-6">
          <span className="font-serif text-xl italic text-primary">
            Blindfold
          </span>
          <nav>
            <a
              href="#configure"
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              Set up a session
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ---------------------------------------------------------- */}
        {/* Hero                                                       */}
        {/* ---------------------------------------------------------- */}
        <section className="notebook-rule border-b border-border">
          <div className="container grid grid-cols-1 gap-14 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
            <div>
              <h1 className="max-w-lg font-serif text-4xl leading-[1.15] text-primary sm:text-5xl">
                Practice without knowing what you&apos;re practicing.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                Set a rating range and nudge a few tags toward the ones you
                want more of. Blindfold picks a Codeforces problem that
                fits. You&apos;ll see the problem — never the reasoning
                that chose it.
              </p>
              <a
                href="#configure"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-[#1d271f]"
              >
                Set up a session
              </a>
            </div>

            {/* Illustrative problem card — shows the mechanic, not real data */}
            <div className="rounded-lg border border-border bg-surface p-6 shadow-[0_1px_0_0_var(--color-border)] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-sm tabular text-primary">
                  1700
                </span>
                <span className="font-mono text-sm text-muted">
                  1829 · G
                </span>
              </div>

              <h2 className="mt-5 font-serif text-2xl text-ink">
                Two Arrays, One Sum
              </h2>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {REDACTED_TAG_WIDTHS.map((width, i) => (
                  <span
                    key={i}
                    className="h-2.5 rounded-full bg-primary"
                    style={{ width: `${width}px` }}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-1 font-serif text-sm italic text-muted">
                  tags hidden
                </span>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
                <span className="text-sm text-muted">
                  Open on Codeforces
                </span>
                <span className="text-sm text-muted">Skip</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Rationale                                                  */}
        {/* ---------------------------------------------------------- */}
        <section className="border-b border-border">
          <div className="container grid grid-cols-1 gap-8 py-16 lg:grid-cols-[1fr_1.4fr]">
            <p className="border-l-2 border-accent pl-3 text-sm text-muted">
              Why hide the tags
            </p>
            <p className="max-w-2xl font-serif text-2xl italic leading-snug text-primary sm:text-3xl">
              &ldquo;Dynamic programming&rdquo; on a problem is a spoiler.
              It tells you the shape of the solution before you&apos;ve
              earned it.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Configuration                                              */}
        {/* ---------------------------------------------------------- */}
        <section className="py-20">
          <div className="container">
            <div className="mb-10 max-w-xl">
              <h2 className="font-serif text-3xl text-primary">
                Set up your session
              </h2>
              <p className="mt-3 text-muted">
                Three steps. The problem is the only thing you&apos;ll
                see when it&apos;s done.
              </p>
            </div>

            <PracticeConfig />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container flex flex-col gap-2 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Blindfold</span>
          <span>
            Problems are sourced from{" "}
            <a
              href="https://codeforces.com"
              className="underline underline-offset-2 hover:text-primary"
            >
              Codeforces
            </a>
            . Ratings and tags belong to the problem setters.
          </span>
        </div>
      </footer>
    </div>
  );
}
