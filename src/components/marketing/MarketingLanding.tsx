import Link from "next/link";
import Image from "next/image";
import { picsumImageUrl } from "@/lib/images/picsum";
import { StaySiteLogo } from "@/components/marketing/StaySiteLogo";
import { MarketingHeroCopy } from "@/components/marketing/MarketingHeroCopy";
import { BuilderDashboardMockup } from "@/components/marketing/BuilderDashboardMockup";
import { PhoneMockup } from "@/components/marketing/PhoneMockup";
import { MarketingTrustBar } from "@/components/marketing/MarketingTrustBar";
import { SparkleIcon } from "@/components/marketing/MarketingIcons";

const backgroundImage = picsumImageUrl("staysite-marketing-bg", 1920, 1080);

export function MarketingLanding() {
  return (
    <div className="marketing-landing relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-white/55 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-brand-50/30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="px-6 py-4 md:px-10">
          <Link href="/" aria-label="StaySite home">
            <StaySiteLogo />
          </Link>
        </header>

        <main className="flex flex-1 flex-col px-6 pb-4 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 py-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-6 xl:gap-10">
            <MarketingHeroCopy />

            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="marketing-hero-visual relative w-full max-w-[44rem]">
                <div
                  className="absolute -right-2 top-6 z-20 hidden w-28 rounded-full bg-brand-600 px-3 py-4 text-center text-[10px] font-bold uppercase leading-snug tracking-wide text-white shadow-xl shadow-brand-600/35 sm:block lg:-right-6 lg:top-2"
                  aria-hidden
                >
                  <span className="block">AI builds it.</span>
                  <span className="mt-1 inline-flex items-center gap-0.5">
                    You own it.
                    <SparkleIcon className="h-2.5 w-2.5 opacity-90" />
                  </span>
                </div>

                <BuilderDashboardMockup />

                <div className="absolute -bottom-2 right-0 z-20 sm:right-2 lg:-right-6 lg:bottom-4">
                  <PhoneMockup />
                </div>
              </div>
            </div>
          </div>

          <MarketingTrustBar />
        </main>
      </div>
    </div>
  );
}
