import { cn } from "@/lib/utils"

export function RithelpLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-10 h-10 transition-all duration-500", className)}
    >
      {/* The 'Supporting Hand' - Elegant Abstract Curve */}
      <path 
        d="M20 75C20 85 45 90 60 70C75 50 85 30 85 15" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round"
        className="text-primary/20"
      />
      
      {/* Main Growth Rhythm - Hand forming the Uptrend */}
      <path 
        d="M15 80C30 80 45 70 55 50C65 30 75 10 75 10" 
        stroke="currentColor" 
        strokeWidth="7" 
        strokeLinecap="round"
        className="text-primary"
      />

      {/* Analytical Candlesticks - Sharp and Integrated */}
      {/* Candle 1 */}
      <g className="text-primary">
        <rect x="35" y="55" width="6" height="14" rx="1.5" fill="currentColor" />
        <path d="M38 50V75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Candle 2 */}
      <g className="text-primary opacity-80">
        <rect x="52" y="35" width="6" height="20" rx="1.5" fill="currentColor" />
        <path d="M55 30V60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Candle 3 (Peak) */}
      <g className="text-primary">
        <rect x="69" y="15" width="6" height="28" rx="1.5" fill="currentColor" />
        <path d="M72 10V48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* High-Precision Data Point Glow */}
      <circle cx="72" cy="10" r="3" fill="#6CBD8F" className="animate-ping opacity-40" />
      <circle cx="72" cy="10" r="2.5" fill="#9CE2B4" />
    </svg>
  )
}
