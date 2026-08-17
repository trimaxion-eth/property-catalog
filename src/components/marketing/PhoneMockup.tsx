import Image from "next/image";
import { picsumImageUrl } from "@/lib/images/picsum";

const heroImage = picsumImageUrl("halcyon-hero-mobile", 280, 420);

export function PhoneMockup() {
  return (
    <div className="marketing-phone relative w-[9.5rem] shrink-0 sm:w-[10.5rem]">
      <div className="rounded-[1.75rem] border-[3px] border-slate-800 bg-slate-800 p-1 shadow-2xl shadow-slate-900/25">
        <div className="overflow-hidden rounded-[1.35rem] bg-white">
          <div className="flex items-center justify-between px-2.5 py-2">
            <span className="font-display text-[7px] font-semibold tracking-wide text-text">
              HALCYON
            </span>
            <div className="flex flex-col gap-0.5" aria-hidden>
              <span className="h-0.5 w-3 rounded-full bg-text" />
              <span className="h-0.5 w-3 rounded-full bg-text" />
              <span className="h-0.5 w-3 rounded-full bg-text" />
            </div>
          </div>
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={heroImage}
              alt=""
              fill
              className="object-cover"
              sizes="120px"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-2 right-2 text-center">
              <p className="font-display text-[8px] font-semibold leading-tight text-white">
                Your peaceful escape by the sea
              </p>
              <div className="mx-auto mt-2 inline-block rounded bg-brand-600 px-2 py-1 text-[6px] font-bold text-white">
                BOOK YOUR STAY
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-slate-700" aria-hidden />
    </div>
  );
}
