import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Stop guessing about uptime
        </h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Join thousands of teams that trust StatusVault to monitor their
          critical infrastructure. Get started in minutes with our 14-day free
          trial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 group"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-secondary/10 bg-transparent"
          >
            Schedule a Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          No credit card required • 14 days free • Cancel anytime
        </p>
      </div>
    </section>
  );
}
