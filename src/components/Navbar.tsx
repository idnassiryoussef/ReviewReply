"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useAuth,
  useUser,
  UserButton,
} from "@clerk/nextjs";
import { isAdminEmail, parseAdminEmails } from "@/lib/admin";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

type PlanInfo = { plan: string; usagePercent: number };

const PLAN_LABEL: Record<string, string> = {
  free: "FREE",
  starter: "STARTER",
  growth: "GROWTH",
  agency: "AGENCY",
};

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);

  const signedInLinks = [
    { href: "/app", label: "Generator" },
    { href: "/dashboard/inbox", label: "Inbox" },
    { href: "/dashboard/auto-reply", label: "Auto-Reply" },
    { href: "/dashboard/analytics", label: "Analytics" },
  ];

  const adminEmails = parseAdminEmails(process.env.NEXT_PUBLIC_ADMIN_EMAILS);
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = isAdminEmail(userEmail, adminEmails);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/plan-info")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: PlanInfo | null) => { if (d) setPlanInfo(d); })
      .catch(() => null);
  }, [isSignedIn]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-sky-500 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/20">
            RR
          </span>
          <span className="font-semibold tracking-tight text-white">
            ReviewReply
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-1 transition-all duration-200 hover:text-purple-400 ${
                pathname === link.href ? "text-white" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn
            ? signedInLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 py-1 transition-all duration-200 hover:text-purple-400 ${
                    pathname === link.href ? "text-white" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))
            : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-white/15 hover:shadow-xl"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40"
              >
                Start Free
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  Admin
                </span>
              ) : null}
              {planInfo ? (
                planInfo.plan === "free" ? (
                  <Link
                    href="/pricing"
                    className="rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-3 py-1 text-xs font-bold text-white shadow hover:scale-105 transition"
                  >
                    Upgrade
                  </Link>
                ) : (
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                    {PLAN_LABEL[planInfo.plan] ?? planInfo.plan}
                  </span>
                )
              ) : null}
              <UserButton />
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/10 p-2 text-white/80 transition hover:bg-white/15 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/90 md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10 ${
                  pathname === link.href ? "bg-white/10" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn
              ? signedInLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10 ${
                      pathname === link.href ? "bg-white/10" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))
              : null}
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15"
                >
                  Start Free
                </Link>
              </>
            ) : (
              <div className="px-1 py-2">
                {isAdmin ? (
                  <span className="mb-2 inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                    Admin
                  </span>
                ) : null}
                {planInfo?.plan === "free" ? (
                  <Link
                    href="/pricing"
                    onClick={() => setOpen(false)}
                    className="mb-2 inline-flex rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-3 py-1 text-xs font-bold text-white"
                  >
                    Upgrade
                  </Link>
                ) : planInfo ? (
                  <span className="mb-2 inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                    {PLAN_LABEL[planInfo.plan] ?? planInfo.plan}
                  </span>
                ) : null}
                <UserButton />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
