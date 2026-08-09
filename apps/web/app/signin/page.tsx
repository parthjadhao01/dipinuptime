"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleEmailSignIn(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);

    const res = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (res?.error) {
      setError("Failed to send email. Please try again.");
      return;
    }

    setSent(true);
  }

  if (status === "loading" || status === "authenticated") return null;

  return (
    <div className="flex min-h-screen font-sans">
      {/* ── Left Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 bg-muted">
        {/* Hero image fills entire panel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/signincover.png"
          alt="PulseWatch monitoring illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Logo — on top of image */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary">
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

        {/* Bottom label */}
        <div className="relative z-10">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            [ 847 monitors active ]
          </span>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-background">
        <div className="w-full max-w-sm">
          {!sent ? (
            <>
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest mb-6 border border-border text-muted-foreground">
                Secure Access
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-bold mb-2 text-foreground">
                Sign in.
              </h1>
              <p className="text-sm mb-6 text-muted-foreground">
                Monitor your infrastructure. Own your uptime.
              </p>

              {/* Divider */}
              <div className="mb-6 border-t border-border" />

              {/* Form */}
              <form onSubmit={handleEmailSignIn}>
                <label className="block text-xs uppercase tracking-wider mb-1.5 text-muted-foreground">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") handleEmailSignIn();
                  }}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  placeholder="you@company.com"
                  className={`w-full h-[44px] px-3 text-sm rounded-none outline-none transition-colors bg-secondary text-foreground placeholder:text-muted-foreground border ${
                    focusedInput ? "border-primary" : "border-border"
                  }`}
                />
                {error && (
                  <p className="text-destructive text-xs mt-1.5">{error}</p>
                )}

                <SubmitButton loading={loading} />
              </form>

              {/* Fine print */}
              <p className="text-xs mt-6 text-muted-foreground">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="underline hover:text-foreground transition-colors"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </>
          ) : (
            /* ── Email Sent State ── */
            <>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase tracking-widest mb-6 border border-border text-muted-foreground">
                Check your inbox
              </div>

              <h1 className="text-4xl font-bold mb-2 text-foreground">
                Link sent.
              </h1>
              <p className="text-sm mb-1 text-muted-foreground">
                We sent a magic link to
              </p>
              <p className="text-sm font-medium mb-4 text-primary">{email}</p>
              <p className="text-sm mb-6 text-muted-foreground">
                Click the link in your email to sign in. It expires in 10
                minutes.
              </p>

              <div className="mb-6 border-t border-border" />

              <p className="text-xs text-muted-foreground">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                    setError("");
                  }}
                  className="underline text-primary hover:opacity-75 transition-opacity"
                >
                  Try again
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Extracted to avoid inline arrow fn returning non-ReactNode ── */
function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-[44px] rounded-sm text-sm font-medium mt-4 transition-colors disabled:opacity-60 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {loading ? "Sending link..." : "Continue with Email →"}
    </button>
  );
}
