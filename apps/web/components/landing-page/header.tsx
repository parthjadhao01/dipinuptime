"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">DU</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline">
            DipinUptime
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Status
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => signIn()}>
              Sign Out Sign In
            </Button>
          )}

          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block text-sm text-muted-foreground hover:text-foreground transition py-2"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-sm text-muted-foreground hover:text-foreground transition py-2"
            >
              Pricing
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground transition py-2"
            >
              Docs
            </a>
            <a
              href="#"
              className="block text-sm text-muted-foreground hover:text-foreground transition py-2"
            >
              Status
            </a>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
