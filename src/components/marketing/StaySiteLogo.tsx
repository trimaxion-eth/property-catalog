type StaySiteLogoProps = {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: { icon: "h-7 w-7", text: "text-base" },
  md: { icon: "h-8 w-8", text: "text-lg" },
  lg: { icon: "h-9 w-9", text: "text-xl" },
} as const;

export function StaySiteLogo({
  className = "",
  showText = true,
  size = "lg",
}: StaySiteLogoProps) {
  const sizes = sizeClasses[size];

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex ${sizes.icon} shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white`}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="currentColor">
          <path d="M12 3 3 10.5V20a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-9.5L12 3zm0 2.3 6 5.25V19h-3v-6H9v6H6v-8.45L12 5.3z" />
          <circle cx="8.5" cy="8" r="0.65" />
          <circle cx="12" cy="7" r="0.65" />
          <circle cx="15.5" cy="8" r="0.65" />
        </svg>
      </span>
      {showText ? (
        <span className={`font-semibold tracking-tight text-text ${sizes.text}`}>
          StaySite
        </span>
      ) : null}
    </span>
  );
}
