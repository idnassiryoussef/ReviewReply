import Link from "next/link";

export function Footer() {
  const builtByName = process.env.NEXT_PUBLIC_BUILT_BY_NAME ?? "IDNASSIR";

  return (
    <footer className="border-t border-white/10 bg-slate-950/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-sky-500 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/20">
              RR
            </span>
            <span className="text-lg font-semibold text-white">ReviewReply</span>
          </Link>
          <p className="mt-4 text-sm text-white/70">
            Generate professional replies to Google reviews in seconds. Built for local
            businesses, by business owners.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-white/90">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <Link href="/app" className="transition-all duration-200 hover:text-purple-300">
                  Try it
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-all duration-200 hover:text-purple-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-all duration-200 hover:text-purple-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/90">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <Link href="/" className="transition-all duration-200 hover:text-purple-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-all duration-200 hover:text-purple-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-all duration-200 hover:text-purple-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/90">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <Link href="/privacy" className="transition-all duration-200 hover:text-purple-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-all duration-200 hover:text-purple-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-white/40 md:flex-row md:px-6">
        <p>© {new Date().getFullYear()} ReviewReply. Built for small businesses.</p>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
          Web built by {builtByName}
        </span>
      </div>
    </footer>
  );
}
