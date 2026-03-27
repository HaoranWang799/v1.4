/** 定制硬件图标 — Luna AI 互动杯 */
export default function LunaCupIcon({ size = 24, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6.5 7h11v11c0 2.5-1.5 4-5.5 4s-5.5-1.5-5.5-4V7z" />
      <rect x="5" y="3" width="14" height="4" rx="1" />
      <path d="M9 3v4" />
      <path d="M15 3v4" />
      <path d="M6.5 12c3.5 1.5 7.5 1.5 11 0" />
      <path d="M6.5 16c3.5 1.5 7.5 1.5 11 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
