import { TrendingUp, Activity } from "lucide-react";

function StatCard({
  label,
  value,
  trend,
  color,
}: {
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-base font-semibold text-foreground">{value}</span>
        <span className={`text-[10px] font-medium ${color}`}>{trend}</span>
      </div>
    </div>
  );
}

function StatusRow({
  name,
  status,
  latency,
}: {
  name: string;
  status: "UP" | "DOWN";
  latency: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-[11px] text-foreground">{name}</span>
      <div className="flex items-center gap-3">
        <span
          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${status === "UP" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}
        >
          {status}
        </span>
        <span className="text-[10px] text-muted-foreground w-12 text-right">
          {latency}
        </span>
      </div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
        {/* Title bar */}
        <div className="bg-card px-4 py-2 flex items-center gap-2 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] text-muted-foreground">
              pulsewatch.app/dashboard
            </span>
          </div>
        </div>
        {/* Dashboard content */}
        <div className="bg-background p-4 space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            <StatCard
              label="Uptime"
              value="99.98%"
              trend="↑ 0.02%"
              color="text-success"
            />
            <StatCard
              label="Incidents"
              value="3"
              trend="this month"
              color="text-muted-foreground"
            />
            <StatCard
              label="Avg Response"
              value="124ms"
              trend="↓ 12ms"
              color="text-success"
            />
            <StatCard
              label="Monitors"
              value="48"
              trend="active"
              color="text-success"
            />
          </div>
          {/* Chart + Table row */}
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3 bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground">
                  Response Time (30d)
                </span>
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              <svg viewBox="0 0 300 60" className="w-full h-12">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.58 0.19 35)"
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.58 0.19 35)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0,40 Q30,35 60,30 T120,25 T180,20 T240,22 T300,15"
                  fill="none"
                  stroke="oklch(0.58 0.19 35)"
                  strokeWidth="2"
                />
                <path
                  d="M0,40 Q30,35 60,30 T120,25 T180,20 T240,22 T300,15 V60 H0Z"
                  fill="url(#chartGrad)"
                />
              </svg>
            </div>
            <div className="col-span-2 bg-card border border-border rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-muted-foreground">
                  Monitor Status
                </span>
              </div>
              <div>
                <StatusRow name="API Gateway" status="UP" latency="89ms" />
                <StatusRow name="Web App" status="UP" latency="124ms" />
                <StatusRow name="Database" status="UP" latency="45ms" />
                <StatusRow name="CDN" status="DOWN" latency="—" />
                <StatusRow name="Auth Service" status="UP" latency="67ms" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
