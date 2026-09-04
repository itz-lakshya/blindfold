/**
 * Codeforces personalization UI component.
 * Allows users to enter their handle to sync and store their submission history.
 */

"use client";

import { useState, useEffect } from "react";
import { syncCodeforcesHistory } from "@/app/practice/actions";
import { saveCfHistory, getCfHistory, clearCfHistory } from "@/lib/history";

export default function CfHandleSync() {
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Load existing handle on mount
  useEffect(() => {
    const existing = getCfHistory();
    if (existing && existing.handle) {
      setHandle(existing.handle);
      setStatus("success");
      setMessage(`Synced. Solved: ${existing.solvedProblemIds.length}`);
    }
  }, []);

  const handleSync = async () => {
    if (!handle.trim()) {
      clearCfHistory();
      setStatus("idle");
      setMessage("");
      return;
    }

    setStatus("loading");
    setMessage("Syncing your Codeforces history...");

    try {
      const response = await syncCodeforcesHistory(handle);
      
      if (!response.success) {
        setStatus("error");
        setMessage(response.error);
        clearCfHistory();
      } else {
        saveCfHistory(response.data);
        setStatus("success");
        setMessage(`History synced. Solved: ${response.data.solvedProblemIds.length}`);
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred during sync.");
      clearCfHistory();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-ink">Codeforces handle (Optional)</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value);
            setStatus("idle");
            setMessage("");
          }}
          placeholder="e.g. tourist"
          className="flex-1 rounded-md border border-border bg-surface px-4 py-2 text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleSync}
          disabled={status === "loading"}
          className="rounded-md bg-surface-2 px-6 py-2 font-medium text-ink border border-border transition-colors hover:bg-border disabled:opacity-50"
        >
          {status === "loading" ? "Syncing..." : "Sync history"}
        </button>
      </div>
      
      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
