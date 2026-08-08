"use client";

import { ChevronRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { DashboardMockup } from "../components/DashboardMockup";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-4 -mt-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-card border border-border rounded-full text-xs text-muted-foreground">
          <span>⚡</span>
          Trusted by 500+ engineering teams
        </div>
        {/* Heading */}
        <h1 className="text-center leading-[1.1]">
          <span className="block text-5xl font-light text-foreground tracking-tight">
            The Monitoring Platform for
          </span>
          <span className="block text-5xl font-light tracking-tight">
            <span className="text-primary font-semibold">Uptime</span>
            <span className="text-foreground"> & Reliability</span>
          </span>
        </h1>
        {/* Subheading */}
        <p className="text-center text-muted-foreground text-sm max-w-md leading-relaxed">
          Move beyond basic alerts—automatically detect, track, and resolve
          downtime before your users ever notice.
        </p>
        {/* CTAs */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-1 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Get Started
            <ChevronRight className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="inline-flex items-center px-6 py-2.5 border border-border text-sm font-medium text-foreground rounded-full hover:bg-accent transition-colors"
          >
            See Pricing
          </a>
        </div>
        {/* Dashboard mockup */}
        <div className="w-full max-w-3xl mt-2">
          <DashboardMockup />
        </div>
      </main>
      <Footer />
    </div>
  );
}
