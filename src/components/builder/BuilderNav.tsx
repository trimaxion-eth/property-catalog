import Link from "next/link";

export function BuilderNav() {
  return (
    <header className="shrink-0 border-b border-border bg-surface">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-brand-600">
          StaySite
        </Link>
        <nav className="flex items-center gap-6 text-sm text-text-muted">
          <span className="cursor-not-allowed opacity-50" title="Available after sign-in">
            Sites
          </span>
          <span className="cursor-not-allowed opacity-50">Help</span>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700"
            aria-hidden
          >
            U
          </span>
        </nav>
      </div>
    </header>
  );
}
