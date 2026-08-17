import {
  LockIcon,
  SearchIcon,
  SmartphoneIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/marketing/MarketingIcons";

const trustSignals = [
  { label: "Mobile Responsive", Icon: SmartphoneIcon },
  { label: "SEO Optimized", Icon: SearchIcon },
  { label: "Fast Loading", Icon: ZapIcon },
  { label: "Secure & SSL", Icon: LockIcon },
  { label: "Ready for Guests", Icon: UsersIcon },
] as const;

export function MarketingTrustBar() {
  return (
    <div className="marketing-trust-bar mx-auto w-full max-w-5xl px-4 pb-8 md:px-6">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 rounded-2xl border border-white/60 bg-white/80 px-6 py-4 shadow-lg shadow-slate-900/5 backdrop-blur-md md:gap-x-10 md:px-10">
        {trustSignals.map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-text-muted">
            <Icon className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            <span className="whitespace-nowrap font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
