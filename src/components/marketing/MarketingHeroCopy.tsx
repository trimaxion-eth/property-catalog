import Link from "next/link";
import {
  CheckCircleIcon,
  LayersIcon,
  RocketIcon,
  WandIcon,
} from "@/components/marketing/MarketingIcons";

const heroFeatures = [
  {
    title: "Describe your property",
    description: "Answer simple questions about your property.",
    Icon: LayersIcon,
  },
  {
    title: "AI builds your website",
    description: "We write the content, design the pages, and organize your photos.",
    Icon: WandIcon,
  },
  {
    title: "Publish and go live",
    description: "Connect your domain and you're ready to welcome guests.",
    Icon: RocketIcon,
  },
] as const;

export function MarketingHeroCopy() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-text lg:text-[2.75rem] lg:leading-[1.12] xl:text-5xl">
        AI Websites for Hotels &amp; Rentals
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-text-muted md:text-xl">
        Answer a few questions. Get a beautiful, booking-ready website in minutes.
      </p>

      <ul className="mt-8 space-y-5">
        {heroFeatures.map(({ title, description, Icon }) => (
          <li key={title} className="flex gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600"
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-text">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700">
          <CheckCircleIcon className="h-4 w-4 shrink-0 text-brand-600" />
          No coding. No templates. Just your perfect website.
        </div>

        <Link
          href="/builder"
          className="inline-flex items-center justify-center rounded-button bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
        >
          Start Building
        </Link>
      </div>
    </div>
  );
}
