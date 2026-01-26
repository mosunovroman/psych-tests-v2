export default function MeditationIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background gradient circle */}
      <circle cx="200" cy="150" r="120" fill="url(#meditation-gradient)" opacity="0.1"/>

      {/* Person meditating */}
      <ellipse cx="200" cy="240" rx="60" ry="15" fill="#E0E7FF" opacity="0.6"/>

      {/* Body */}
      <path d="M200 180 C160 180 140 210 140 230 C140 235 200 235 200 235 C200 235 260 235 260 230 C260 210 240 180 200 180Z" fill="#818CF8"/>

      {/* Head */}
      <circle cx="200" cy="140" r="35" fill="#FCD5CE"/>

      {/* Hair */}
      <path d="M165 130 C165 105 185 95 200 95 C215 95 235 105 235 130 C235 115 220 105 200 105 C180 105 165 115 165 130Z" fill="#5C4033"/>

      {/* Closed eyes */}
      <path d="M185 138 Q190 142 195 138" stroke="#5C4033" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M205 138 Q210 142 215 138" stroke="#5C4033" strokeWidth="2" strokeLinecap="round" fill="none"/>

      {/* Peaceful smile */}
      <path d="M192 152 Q200 158 208 152" stroke="#5C4033" strokeWidth="2" strokeLinecap="round" fill="none"/>

      {/* Arms in meditation pose */}
      <path d="M145 200 Q130 190 125 210 Q130 215 140 210" fill="#FCD5CE"/>
      <path d="M255 200 Q270 190 275 210 Q270 215 260 210" fill="#FCD5CE"/>

      {/* Floating elements - peaceful aura */}
      <circle cx="130" cy="100" r="8" fill="#A5B4FC" opacity="0.6"/>
      <circle cx="270" cy="110" r="6" fill="#C4B5FD" opacity="0.6"/>
      <circle cx="150" cy="70" r="5" fill="#FCA5A5" opacity="0.5"/>
      <circle cx="250" cy="80" r="7" fill="#86EFAC" opacity="0.5"/>
      <circle cx="120" cy="140" r="4" fill="#FDE68A" opacity="0.6"/>
      <circle cx="280" cy="150" r="5" fill="#A5B4FC" opacity="0.6"/>

      {/* Lotus flower base */}
      <ellipse cx="200" cy="235" rx="40" ry="8" fill="#EC4899" opacity="0.3"/>
      <path d="M180 235 Q200 220 220 235" fill="#F472B6" opacity="0.5"/>
      <path d="M170 235 Q200 215 230 235" fill="#EC4899" opacity="0.4"/>

      <defs>
        <linearGradient id="meditation-gradient" x1="80" y1="30" x2="320" y2="270">
          <stop offset="0%" stopColor="#818CF8"/>
          <stop offset="100%" stopColor="#C084FC"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
