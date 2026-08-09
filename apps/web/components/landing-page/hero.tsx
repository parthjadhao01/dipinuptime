import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Know when your sites
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
              {" "}
              go down
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
            Real-time uptime monitoring for your web infrastructure. Get instant
            alerts, detailed insights, and 99.9% SLA monitoring for peace of
            mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary/10 bg-transparent"
            >
              View Demo
            </Button>
          </div>
        </div>

        <div className="relative h-96 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-border flex items-center justify-center overflow-hidden">
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Status indicators */}
          <div className="relative z-10 space-y-4 w-full p-6">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">api.example.com</p>
                <p className="text-xs text-muted-foreground">99.98% uptime</p>
              </div>
              <span className="text-xs font-mono text-green-400">200ms</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">app.example.com</p>
                <p className="text-xs text-muted-foreground">100% uptime</p>
              </div>
              <span className="text-xs font-mono text-green-400">145ms</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">db.example.com</p>
                <p className="text-xs text-muted-foreground">98.5% uptime</p>
              </div>
              <span className="text-xs font-mono text-yellow-400">523ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
