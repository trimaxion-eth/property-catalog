import Link from "next/link";

const journeySteps = [
  { title: "Describe", description: "Answer simple questions about your property" },
  { title: "Generate", description: "AI writes content and lays out your pages" },
  { title: "Customize", description: "Review and tweak anything you like" },
  { title: "Publish", description: "Connect your domain and welcome guests" },
] as const;

const trustSignals = [
  "Mobile Responsive",
  "SEO Optimized",
  "Fast Loading",
  "Secure & SSL",
  "Ready for Guests",
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold text-brand-600">StaySite</span>
          <nav className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/builder" className="hover:text-text">
              Builder
            </Link>
            <span className="cursor-not-allowed opacity-50">Help</span>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-brand-600">
            AI builds it. You own it.
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text md:text-6xl">
            AI Websites for Hotels &amp; Rentals
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
            Answer a few questions. Get a beautiful, booking-ready website in
            minutes. No coding. No templates. Just your perfect website.
          </p>
          <Link
            href="/builder"
            className="mt-10 inline-flex items-center rounded-button bg-brand-600 px-8 py-3 text-base font-medium text-white transition hover:bg-brand-700"
          >
            Start Building
          </Link>
        </section>

        <section className="border-y border-border bg-surface-muted py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-4">
            {journeySteps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {index + 1}
                </div>
                <h2 className="font-medium text-text">{step.title}</h2>
                <p className="mt-2 text-sm text-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6 py-6 text-sm text-text-muted">
          {trustSignals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
