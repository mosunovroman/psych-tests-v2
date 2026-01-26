export default function BrainIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <circle cx="200" cy="150" r="100" fill="url(#brain-glow)" opacity="0.15"/>

      {/* Brain outline - left hemisphere */}
      <path d="M130 150 C130 100 150 70 180 70 C200 70 210 85 210 100 C220 90 240 90 250 100 C270 100 285 120 285 150 C285 180 270 200 250 210 C240 220 220 225 200 225 C180 225 160 220 150 210 C135 200 130 180 130 150Z"
        fill="url(#brain-gradient)" stroke="#818CF8" strokeWidth="2"/>

      {/* Brain folds - decorative lines */}
      <path d="M150 120 Q170 130 160 150 Q150 170 170 180" stroke="#A5B4FC" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M180 100 Q200 120 190 140 Q180 160 200 175" stroke="#A5B4FC" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M220 105 Q240 125 230 145 Q220 165 240 180" stroke="#A5B4FC" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M250 130 Q265 145 255 165" stroke="#A5B4FC" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Neural connections - dots */}
      <circle cx="160" cy="130" r="4" fill="#F472B6"/>
      <circle cx="190" cy="115" r="4" fill="#34D399"/>
      <circle cx="220" cy="120" r="4" fill="#FBBF24"/>
      <circle cx="250" cy="140" r="4" fill="#60A5FA"/>
      <circle cx="175" cy="160" r="4" fill="#A78BFA"/>
      <circle cx="210" cy="155" r="4" fill="#F472B6"/>
      <circle cx="240" cy="165" r="4" fill="#34D399"/>
      <circle cx="185" cy="190" r="4" fill="#FBBF24"/>
      <circle cx="220" cy="195" r="4" fill="#60A5FA"/>

      {/* Connection lines */}
      <line x1="160" y1="130" x2="190" y2="115" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="190" y1="115" x2="220" y2="120" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="220" y1="120" x2="250" y2="140" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="175" y1="160" x2="210" y2="155" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="210" y1="155" x2="240" y2="165" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="190" y1="115" x2="175" y2="160" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="220" y1="120" x2="210" y2="155" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="185" y1="190" x2="220" y2="195" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="175" y1="160" x2="185" y2="190" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>
      <line x1="240" y1="165" x2="220" y2="195" stroke="#E0E7FF" strokeWidth="1" opacity="0.6"/>

      {/* Floating particles */}
      <circle cx="100" cy="100" r="6" fill="#C4B5FD" opacity="0.4">
        <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="300" cy="120" r="5" fill="#86EFAC" opacity="0.4">
        <animate attributeName="cy" values="120;130;120" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="120" cy="200" r="4" fill="#FCA5A5" opacity="0.4">
        <animate attributeName="cy" values="200;195;200" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="290" cy="190" r="6" fill="#FDE68A" opacity="0.4">
        <animate attributeName="cy" values="190;185;190" dur="2.8s" repeatCount="indefinite"/>
      </circle>

      <defs>
        <linearGradient id="brain-gradient" x1="130" y1="70" x2="285" y2="225">
          <stop offset="0%" stopColor="#E0E7FF"/>
          <stop offset="50%" stopColor="#C7D2FE"/>
          <stop offset="100%" stopColor="#A5B4FC"/>
        </linearGradient>
        <radialGradient id="brain-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#818CF8"/>
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  )
}
