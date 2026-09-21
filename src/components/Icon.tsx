type IconName = "arrow" | "grid" | "document" | "chart" | "warning" | "chevron";

// A single local outline family, 24px canvas and 1.5px stroke.
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "arrow" && <path d="M4 12h16m-6-6 6 6-6 6" />}
      {name === "warning" && <><path d="m12 3 10 18H2L12 3Zm0 6v5" /><path d="M12 17h.01" /></>}
      {name === "chevron" && <path d="m6 9 6 6 6-6" />}
      {name === "grid" && <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>}
      {name === "document" && <><path d="M13 3H5v18h14V9l-6-6Zm0 0v6h6M8 13h4m-4 4h8" /></>}
      {name === "chart" && <><path d="M4 3v18h17M9 16v-5m5 5V7m5 9v-4" /></>}
    </svg>
  );
}
