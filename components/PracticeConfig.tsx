/**
 * The homepage configuration section.
 * Wraps the rating range, tag sliders, and CF sync into a cohesive step-by-step UI.
 */

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import RatingRange from "./RatingRange";
import TagBias from "./TagBias";
import CfHandleSync from "./CfHandleSync";
import { DifficultyPreference } from "@/lib/types";

export type PracticeConfigState = {
  minRating: number;
  maxRating: number;
  tagBiases: Record<string, number>;
  maxAgeContests?: number;
  difficulty?: DifficultyPreference;
};

const CONFIG_STORAGE_KEY = "blindfold_practice_config";

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 border-t border-border py-8 first:border-t-0 sm:grid-cols-[3rem_1fr]">
      <span className="font-mono text-sm text-muted">{number}</span>
      <div>
        <h3 className="mb-4 font-serif text-xl text-primary">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function PracticeConfig() {
  const [config, setConfig] = useState<PracticeConfigState>({
    minRating: 1500,
    maxRating: 1800,
    tagBiases: {
      "dp": 30,
      "graphs": 10,
    },
    maxAgeContests: undefined,
    difficulty: "balanced",
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load config from storage");
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever config changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      } catch (e) {
        console.error("Failed to save config to storage");
      }
    }
  }, [config, isLoaded]);

  const qs = new URLSearchParams();
  qs.set("minRating", config.minRating.toString());
  qs.set("maxRating", config.maxRating.toString());
  
  if (config.maxAgeContests !== undefined) {
    qs.set("maxAgeContests", config.maxAgeContests.toString());
  }

  if (config.difficulty && config.difficulty !== "balanced") {
    qs.set("difficulty", config.difficulty);
  }

  const active = Object.entries(config.tagBiases).filter(([_, v]) => v !== 0);
  if (active.length > 0) {
    qs.set("tags", JSON.stringify(Object.fromEntries(active)));
  }

  const startHref = `/practice?${qs.toString()}`;

  return (
    <div
      id="configure"
      className="rounded-lg border border-border bg-surface px-6 py-2 sm:px-10"
    >
      <Step number="01" title="Personalization">
        <p className="mb-4 max-w-prose text-sm text-muted">
          Provide your Codeforces handle to ensure Blindfold only recommends problems you haven't worked on.
        </p>
        <CfHandleSync />
      </Step>

      <Step number="02" title="Rating range">
        <RatingRange 
          min={config.minRating} 
          max={config.maxRating} 
          onChange={(min, max) => setConfig({ ...config, minRating: min, maxRating: max })} 
        />
      </Step>

      <Step number="03" title="Difficulty targeting">
        <div className="flex flex-wrap gap-2 mb-3">
          {(["balanced", "harder", "much_harder"] as const).map(d => (
            <button
              key={d}
              onClick={() => setConfig({ ...config, difficulty: d })}
              className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${
                (config.difficulty || "balanced") === d
                  ? "border-primary bg-primary text-surface"
                  : "border-border bg-surface text-ink hover:border-primary"
              }`}
            >
              {d === "balanced" ? "Balanced" : d === "harder" ? "Harder" : "Much Harder"}
            </button>
          ))}
        </div>
        <p className="text-sm italic text-muted max-w-prose">
          {(!config.difficulty || config.difficulty === "balanced") && "Keep difficulty broadly balanced across your rating range."}
          {config.difficulty === "harder" && "Favor problems closer to the top of your rating range."}
          {config.difficulty === "much_harder" && "Strongly favor the harder end of your range."}
        </p>
      </Step>

      <Step number="04" title="Recency limit">
        <p className="mb-4 max-w-prose text-sm text-muted">
          Only want modern problems? Restrict the pool to recent contests.
        </p>
        <select
          value={config.maxAgeContests || "any"}
          onChange={(e) => setConfig({ ...config, maxAgeContests: e.target.value === "any" ? undefined : parseInt(e.target.value, 10) })}
          className="rounded-md border border-border bg-surface px-4 py-2 text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-xs"
        >
          <option value="any">All contests</option>
          <option value="20">Last 20 contests</option>
          <option value="50">Last 50 contests</option>
          <option value="100">Last 100 contests</option>
          <option value="200">Last 200 contests</option>
        </select>
      </Step>

      <Step number="05" title="Tag emphasis">
        <p className="mb-4 max-w-prose text-sm text-muted">
          Nudge the tags you want to see more of. Leave the rest at zero —
          you won&apos;t be told which ones actually showed up.
        </p>
        <TagBias 
          value={config.tagBiases} 
          onChange={(tagBiases) => setConfig({ ...config, tagBiases })} 
        />
      </Step>

      <Step number="06" title="Begin">
        <p className="mb-4 max-w-prose text-sm text-muted">
          Blindfold picks one problem in range, weighted by what you set
          above. The tags stay hidden until you decide to look them up
          yourself.
        </p>
        <Link
          href={startHref}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-[#1d271f]"
        >
          Start practicing
        </Link>
      </Step>
    </div>
  );
}
