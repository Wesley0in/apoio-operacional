export function KontikLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* kontik word with lime accent above the k */}
      <div className="relative">
        {/* Lime curved accent mark above the k */}
        <svg
          className="absolute -top-3 left-0"
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 8 C5 2, 13 2, 16 8"
            stroke="#C2D82F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span
          className="text-3xl font-bold tracking-tight leading-none"
          style={{ color: "#404653", letterSpacing: "-0.02em" }}
        >
          kontik
        </span>
      </div>
      <span
        className="text-xs font-semibold tracking-widest uppercase mt-0.5"
        style={{ color: "#404653", letterSpacing: "0.22em", fontSize: "10px" }}
      >
        Business Travel
      </span>
    </div>
  )
}
