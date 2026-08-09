"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Plus, X, Activity } from "lucide-react";
import useWebsite from "@/hooks/useWebsite";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

type UptickStatus = "up" | "down" | "unknown";

interface ProcessedMonitor {
  id: string;
  name: string;
  url: string;
  overall: "up" | "down" | "unknown";
  responseTime: string;
  uptimePct: string;
  ticks: UptickStatus[];
  lastChecked: string;
}

function processWebsite(website: {
  id: string;
  url: string;
  ticks: {
    id: string;
    createdAt: string;
    status: string;
    latency: number;
  }[];
}): ProcessedMonitor {
  const now = Date.now();
  const thirtyMinutesAgo = now - 30 * 60 * 1000;

  // Step 2: Get ticks within last 30 minutes
  const recentTicks = website.ticks
    .filter((t) => new Date(t.createdAt).getTime() >= thirtyMinutesAgo)
    // Step 3: Sort by time ascending
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  // Step 4: Aggregate into 10 windows of 3 minutes each
  const windowDuration = 3 * 60 * 1000; // 3 minutes in ms
  const windows: UptickStatus[] = Array.from({ length: 10 }, (_, i) => {
    const windowStart = thirtyMinutesAgo + i * windowDuration;
    const windowEnd = windowStart + windowDuration;

    const windowTicks = recentTicks.filter((t) => {
      const time = new Date(t.createdAt).getTime();
      return time >= windowStart && time < windowEnd;
    });

    // Step 5: Window is "up" when majority of ticks are up
    if (windowTicks.length === 0) return "unknown"; // no data = assume up
    const upCount = windowTicks.filter((t) => t.status === "up").length;
    return upCount > windowTicks.length / 2 ? "up" : "down";
  });

  // Step 6: Calculate overall status and uptime percentage
  const upWindows = windows.filter((w) => w === "up").length;
  const uptimePct =
    recentTicks.length === 0
      ? "N/A"
      : `${((upWindows / windows.length) * 100).toFixed(2)}%`;

  let overall: "up" | "down" | "unknown";

  if (recentTicks.length === 0) {
    overall = "unknown";
  } else {
    overall = upWindows >= windows.length / 2 ? "up" : "down";
  }

  // Step 7: Get most recent tick for response time
  const latestTick =
    recentTicks.length > 0
      ? recentTicks[recentTicks.length - 1]
      : (website.ticks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0] ?? null);

  const responseTime =
    latestTick && latestTick.status === "up" && latestTick.latency
      ? `${latestTick.latency}ms`
      : "—";

  // Step 8: Format last checked time
  const lastChecked = latestTick
    ? formatLastChecked(new Date(latestTick.createdAt))
    : "Never";

  // Extract display name from URL (strip protocol + www)
  const displayName = website.url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(".")[0];
  const name = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return {
    id: website.id,
    name,
    url: website.url.replace(/^https?:\/\//, ""),
    overall,
    responseTime,
    uptimePct,
    ticks: windows,
    lastChecked,
  };
}

function formatLastChecked(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function AddMonitorForm({
  onClose,
  refreshWebsite,
}: {
  onClose: () => void;
  refreshWebsite: () => void;
}) {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedUrl = url.trim();

    const token = session?.accessToken;
    if (!token) {
      setError("You must be logged in to add a monitor.");
      return; // stop here, don't even validate URL
    }

    if (!trimmedUrl) {
      setError("URL is required");
      return;
    }
    if (trimmedUrl.length > 255) {
      setError("URL must be under 255 characters");
      return;
    }
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedUrl) &&
      !/^https?:\/\/.+/.test(trimmedUrl)
    ) {
      setError("Enter a valid domain or URL");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/website`,
          { url: trimmedUrl },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then(() => {
          refreshWebsite();
        });
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch (err) {
      setError(
        `Failed to add monitor. Please try again. ${err instanceof Error ? err.message : ""}`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl w-full max-w-md mx-4 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">Add Monitor</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">
              URL / Domain
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              maxLength={255}
              className="w-full h-11 px-3 bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors rounded-sm"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && (
            <p className="text-xs text-green-600">Monitor added! Refreshing…</p>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-11 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add Monitor"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: "up" | "down" | "unknown" }) {
  return (
    <div
      className={`w-3 h-3 rounded-full flex-shrink-0 ${
        status === "up"
          ? "bg-green-500"
          : status === "down"
            ? "bg-red-500"
            : "bg-gray-500"
      }`}
    />
  );
}

function UptimeTicks({ ticks }: { ticks: UptickStatus[] }) {
  return (
    <div className="flex items-center gap-1">
      {ticks.map((tick, i) => (
        <div
          key={i}
          className={`w-1.5 h-6 rounded-sm ${
            tick === "up"
              ? "bg-green-500"
              : tick === "down"
                ? "bg-red-500"
                : "bg-gray-500"
          }`}
          title={`${(i + 1) * 3} min ago — ${tick.toUpperCase()}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-2">30 min</span>
    </div>
  );
}

function MonitorRow({ monitor }: { monitor: ProcessedMonitor }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-accent/50 transition-colors"
      >
        <StatusDot status={monitor.overall} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground text-sm">
            {monitor.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {monitor.url}
          </div>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            monitor.overall === "up"
              ? "bg-green-500/15 text-green-600"
              : monitor.overall === "down"
                ? "bg-red-500/15 text-red-600"
                : "bg-gray-500/15 text-gray-600"
          }`}
        >
          {monitor.overall === "up" ? "Operational" : "Down"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-5 pb-4 pt-0 border-t border-border">
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Last 30 minutes
              </span>
              <span className="text-xs text-muted-foreground">
                Response:{" "}
                <span className="text-foreground font-medium">
                  {monitor.responseTime}
                </span>
              </span>
            </div>
            <UptimeTicks ticks={monitor.ticks} />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                Uptime:{" "}
                <span className="text-foreground font-medium">
                  {monitor.uptimePct}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                Checked:{" "}
                <span className="text-foreground font-medium">
                  {monitor.lastChecked}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-1">
        No monitors yet
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Add your first website or endpoint to start tracking uptime and response
        times in real time.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add your first monitor
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="border border-border rounded-xl bg-card px-5 py-4 flex items-center gap-4 animate-pulse">
      <div className="w-3 h-3 rounded-full bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 bg-muted rounded" />
        <div className="h-2 w-48 bg-muted rounded" />
      </div>
      <div className="h-5 w-20 bg-muted rounded-full" />
      <div className="w-4 h-4 bg-muted rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const { websites, refreshWebsite } = useWebsite();
  const [showForm, setShowForm] = useState(false);

  const isLoading = websites === null;

  // Process all websites into display-ready monitors
  const monitors: ProcessedMonitor[] = useMemo(() => {
    if (!websites) return [];
    // useWebsite returns a single Website or array — normalise to array
    const list = Array.isArray(websites) ? websites : [websites];
    return list.map(processWebsite);
  }, [websites]);

  const upCount = monitors.filter((m) => m.overall === "up").length;
  const downCount = monitors.filter((m) => m.overall === "down").length;

  return (
    <div className="min-h-screen bg-background">
      {showForm && (
        <AddMonitorForm
          refreshWebsite={refreshWebsite}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground">PulseWatch</span>
        </div>
        <Button
          onClick={async () => {
            await signOut({
              callbackUrl: "/signin",
            });
          }}
        >
          Logout
        </Button>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitors</h1>
            {!isLoading && monitors.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">
                  {upCount} operational
                </span>
                {downCount > 0 && (
                  <span className="text-red-600 font-medium">
                    {" "}
                    · {downCount} down
                  </span>
                )}{" "}
                — {monitors.length} total monitors
              </p>
            )}
            {isLoading && (
              <p className="text-sm text-muted-foreground mt-1">
                Loading monitors…
              </p>
            )}
          </div>
          {!isLoading && monitors.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Monitor
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && monitors.length === 0 && (
          <EmptyState onAdd={() => setShowForm(true)} />
        )}

        {/* Monitor list */}
        {!isLoading && monitors.length > 0 && (
          <div className="space-y-3">
            {monitors.map((monitor) => (
              <MonitorRow key={monitor.id} monitor={monitor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
