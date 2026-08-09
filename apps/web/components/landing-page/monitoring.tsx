"use client";

export function Monitoring() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful dashboard
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
                at your fingertips
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our intuitive dashboard gives you a complete overview of your
              infrastructure health in real-time. Monitor all your services in
              one place with beautiful charts and instant notifications.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent-foreground">
                    ✓
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Real-time metrics</p>
                  <p className="text-sm text-muted-foreground">
                    See status updates as they happen
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent-foreground">
                    ✓
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Historical data</p>
                  <p className="text-sm text-muted-foreground">
                    90 days of data retention by default
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent-foreground">
                    ✓
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Incident reports</p>
                  <p className="text-sm text-muted-foreground">
                    Detailed analysis of every incident
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-border overflow-hidden flex items-center justify-center">
            {/* Dashboard background */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              ></div>
            </div>

            {/* Dashboard preview */}
            <div className="relative z-10 w-full p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Dashboard
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1 h-2 bg-secondary/50 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-background/40 rounded-lg border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-mono text-muted-foreground">
                      prod-api.service
                    </p>
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                      99.97%
                    </span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-1">
                    <div
                      className="bg-accent h-1 rounded-full"
                      style={{ width: "99.97%" }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-background/40 rounded-lg border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-mono text-muted-foreground">
                      cdn.static.io
                    </p>
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-1">
                    <div
                      className="bg-accent h-1 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-background/40 rounded-lg border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-mono text-muted-foreground">
                      db-primary.sql
                    </p>
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                      99.99%
                    </span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-1">
                    <div
                      className="bg-accent h-1 rounded-full"
                      style={{ width: "99.99%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
