export default function AcornIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Acorn"
    >
      {/* Cap */}
      <ellipse cx="14" cy="10" rx="8" ry="4" fill="#4B5A2A" />
      {/* Cap rim */}
      <rect x="6" y="12" width="16" height="2.5" rx="1.25" fill="#3a4520" />
      {/* Body */}
      <ellipse cx="14" cy="18" rx="6" ry="7" fill="#4B5A2A" />
      {/* Stem */}
      <line
        x1="14"
        y1="6"
        x2="16"
        y2="2"
        stroke="#4B5A2A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Shine */}
      <ellipse cx="11" cy="17" rx="1.5" ry="2.5" fill="#6b7f3a" opacity="0.5" />
    </svg>
  );
}
