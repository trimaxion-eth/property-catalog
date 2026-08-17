import Image from "next/image";
import { picsumImageUrl } from "@/lib/images/picsum";
import { StaySiteLogo } from "@/components/marketing/StaySiteLogo";
import { SparkleIcon } from "@/components/marketing/MarketingIcons";

const journeySteps = [
  { label: "Describe", detail: "Answer questions about your property" },
  { label: "Generate", detail: "AI creates your website" },
  { label: "Customize", detail: "Review and tweak any section" },
  { label: "Publish", detail: "Connect your domain" },
] as const;

const sidebarSteps = [
  "Property Details",
  "Rooms & Accommodation",
  "Amenities & Services",
  "Location",
  "Photos",
  "Contact & Branding",
  "Booking Settings",
] as const;

const previewRooms = [
  { name: "Deluxe Room", price: "€189" },
  { name: "Sea View Suite", price: "€285" },
  { name: "Honeymoon Suite", price: "€320" },
] as const;

const heroImage = picsumImageUrl("halcyon-hero", 900, 520);

function MockupCheckmark() {
  return (
    <svg className="h-3 w-3 text-brand-600" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M10.28 2.28a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L4.5 7.19l4.97-4.97a.75.75 0 0 1 1.06 0z" />
    </svg>
  );
}

export function BuilderDashboardMockup() {
  return (
    <div className="marketing-laptop relative mx-auto w-full max-w-[42rem]">
      <div className="rounded-t-xl bg-slate-800 px-3 pt-2 pb-1">
        <div className="mx-auto h-1 w-16 rounded-full bg-slate-600" />
      </div>
      <div className="overflow-hidden rounded-b-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <StaySiteLogo size="sm" />
          <div className="flex items-center gap-4 text-[10px] text-text-muted">
            <span>Sites</span>
            <span>Help</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[9px] font-medium text-brand-700">
              U
            </span>
          </div>
        </div>

        <div className="border-b border-border bg-surface-muted px-3 py-2">
          <div className="grid grid-cols-4 gap-1">
            {journeySteps.map((step, index) => (
              <div key={step.label} className="text-center">
                <div
                  className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold ${
                    index === 0
                      ? "bg-brand-600 text-white"
                      : "bg-white text-text-muted ring-1 ring-border"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-text">
                  {step.label}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[7px] leading-tight text-text-muted">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-h-[14rem] bg-surface-muted">
          <div className="w-[38%] shrink-0 border-r border-border bg-white p-2.5">
            <p className="text-[9px] font-semibold text-text">Tell us about your property</p>
            <ul className="mt-2 space-y-1">
              {sidebarSteps.map((step) => (
                <li
                  key={step}
                  className="flex items-center gap-1.5 rounded px-1 py-0.5 text-[7px] text-text-muted"
                >
                  <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-brand-50">
                    <MockupCheckmark />
                  </span>
                  <span className="leading-tight">{step}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-center gap-1 rounded-md bg-brand-600 px-2 py-1.5 text-[8px] font-semibold text-white">
              <SparkleIcon className="h-2.5 w-2.5" />
              Generate My Website
            </div>
          </div>

          <div className="min-w-0 flex-1 p-2">
            <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
                <span className="font-display text-[9px] font-semibold tracking-wide text-text">
                  HALCYON BOUTIQUE HOTEL
                </span>
                <span className="rounded bg-brand-600 px-1.5 py-0.5 text-[6px] font-bold text-white">
                  BOOK NOW
                </span>
              </div>
              <div className="flex gap-2 border-b border-border px-2 py-1 text-[6px] text-text-muted">
                <span>Rooms</span>
                <span>Gallery</span>
                <span>Location</span>
                <span>Contact</span>
              </div>
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="320px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="font-display text-[10px] font-semibold leading-tight text-white">
                    Your peaceful escape by the sea
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1.5">
                {previewRooms.map((room, index) => (
                  <div key={room.name} className="overflow-hidden rounded border border-border">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={picsumImageUrl(`halcyon-room-${index}`, 120, 90)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                    <div className="p-1">
                      <p className="text-[6px] font-medium leading-tight text-text">{room.name}</p>
                      <p className="text-[6px] text-text-muted">{room.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-2 w-[92%] rounded-b-lg bg-slate-300" />
      <div className="mx-auto mt-1 h-1 w-24 rounded-full bg-slate-400" />
    </div>
  );
}
