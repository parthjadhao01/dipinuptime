export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-3 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        © 2025 PulseWatch. All rights reserved.
      </span>
      <div className="flex gap-4">
        <a
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
