"use client";

import Image from "next/image";
import type { SiteImage as SiteImageType } from "@/lib/types/site-content";

type SiteImageProps = {
  image: SiteImageType;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function SiteImage({
  image,
  className = "object-cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: SiteImageProps) {
  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      unoptimized
    />
  );
}
