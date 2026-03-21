"use client";

import { useEffect, useState } from "react";

type Settings = {
  id: string;
  businessId: string;
  isEnabled: boolean;
  autoReplyStarRatings: number[];
  delayMinutes: number;
  dailyReplyLimit: number;
  dryRunMode: boolean;
  createdAt: string;
  updatedAt: string;
};

const STAR_OPTIONS = [1, 2, 3, 4, 5];

export function AutoReplyToggle() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auto-reply/settings");
      const data = (await response.json().catch(() => null)) as
        | { settings?: Settings; error?: string }
        | null;

      if (!response.ok || !data?.settings) {
        throw new Error(data?.error ?? "Failed to load settings.");
      }

      setSettings(data.settings);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load settings.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (next: Settings) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auto-reply/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEnabled: next.isEnabled,
          autoReplyStarRatings: next.autoReplyStarRatings,
          delayMinutes: next.delayMinutes,
          dailyReplyLimit: next.dailyReplyLimit,
          dryRunMode: next.dryRunMode,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { settings?: Settings; error?: string }
        | null;

      if (!response.ok || !data?.settings) {
        throw new Error(data?.error ?? "Failed to save settings.");
      }

      setSettings(data.settings);
      setSuccess("Settings saved.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Failed to save settings.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="glass rounded-3xl p-6 text-white/70">Loading automation settings...</div>;
  }

  if (!settings) {
    return <div className="glass rounded-3xl p-6 text-rose-200">Automation settings unavailable.</div>;
  }

  const toggleStar = (star: number) => {
    const exists = settings.autoReplyStarRatings.includes(star);
    const nextStars = exists
      ? settings.autoReplyStarRatings.filter((value) => value !== star)
      : [...settings.autoReplyStarRatings, star].sort((a, b) => a - b);

    setSettings({
      ...settings,
      autoReplyStarRatings: nextStars.length > 0 ? nextStars : [4, 5],
    });
  };

  return (
    <section className="glass rounded-3xl border border-white/10 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Automation Settings</h2>
          <p className="mt-1 text-sm text-white/70">
            Control auto-reply behavior, delays, limits, and safe rollout with dry-run mode.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
          className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
            settings.isEnabled
              ? "border-emerald-300/40 bg-emerald-500/20 text-emerald-100"
              : "border-white/20 bg-white/10 text-white/80"
          }`}
        >
          {settings.isEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Auto-Reply Ratings</p>
          <p className="mt-1 text-xs text-white/60">Only these ratings can be auto-processed.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STAR_OPTIONS.map((star) => {
              const selected = settings.autoReplyStarRatings.includes(star);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => toggleStar(star)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    selected
                      ? "border-indigo-300/50 bg-indigo-500/20 text-indigo-100"
                      : "border-white/20 bg-white/10 text-white/75"
                  }`}
                >
                  {star}★
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Reply Delay</p>
          <p className="mt-1 text-xs text-white/60">Delay before queued jobs are processed.</p>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={settings.delayMinutes}
            onChange={(event) =>
              setSettings({ ...settings, delayMinutes: Number(event.target.value) })
            }
            className="mt-3 w-full"
          />
          <p className="mt-2 text-xs text-white/80">{settings.delayMinutes} minutes</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Daily Reply Limit</p>
          <p className="mt-1 text-xs text-white/60">Hard cap for automated sends per day.</p>
          <input
            type="number"
            min={1}
            max={1000}
            value={settings.dailyReplyLimit}
            onChange={(event) =>
              setSettings({
                ...settings,
                dailyReplyLimit: Math.max(1, Math.min(1000, Number(event.target.value) || 1)),
              })
            }
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Dry-Run Mode</p>
          <p className="mt-1 text-xs text-white/60">
            Generate and log replies without posting to Google.
          </p>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, dryRunMode: !settings.dryRunMode })}
            className={`mt-3 rounded-full border px-4 py-1.5 text-xs font-semibold ${
              settings.dryRunMode
                ? "border-amber-300/40 bg-amber-500/20 text-amber-100"
                : "border-emerald-300/40 bg-emerald-500/15 text-emerald-100"
            }`}
          >
            {settings.dryRunMode ? "Dry-Run Enabled" : "Live Publish Enabled"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => save(settings)}
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          disabled={saving}
          className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80"
        >
          Refresh
        </button>
      </div>

      {success ? <p className="mt-3 text-sm text-emerald-200">{success}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
    </section>
  );
}
