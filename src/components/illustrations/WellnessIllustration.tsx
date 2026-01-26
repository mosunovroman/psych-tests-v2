export default function WellnessIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background elements */}
      <circle cx="320" cy="80" r="40" fill="#FEF3C7" opacity="0.6"/>
      <circle cx="80" cy="220" r="30" fill="#DBEAFE" opacity="0.6"/>

      {/* Main character */}
      <g transform="translate(120, 60)">
        {/* Body */}
        <ellipse cx="80" cy="190" rx="50" ry="12" fill="#E0E7FF" opacity="0.5"/>
        <path d="M50 140 C50 120 65 100 80 100 C95 100 110 120 110 140 L110 175 C110 185 95 190 80 190 C65 190 50 185 50 175 Z" fill="#818CF8"/>

        {/* Head */}
        <circle cx="80" cy="70" r="30" fill="#FCD5CE"/>

        {/* Hair */}
        <path d="M50 60 C50 35 65 25 80 25 C95 25 110 35 110 60 C105 50 90 45 80 45 C70 45 55 50 50 60Z" fill="#8B5A2B"/>

        {/* Happy face */}
        <circle cx="70" cy="65" r="3" fill="#5C4033"/>
        <circle cx="90" cy="65" r="3" fill="#5C4033"/>
        <path d="M70 80 Q80 90 90 80" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

        {/* Arms raised in celebration */}
        <path d="M50 120 L25 90 L30 85 L55 115" fill="#FCD5CE"/>
        <path d="M110 120 L135 90 L130 85 L105 115" fill="#FCD5CE"/>

        {/* Hands */}
        <circle cx="25" cy="88" r="8" fill="#FCD5CE"/>
        <circle cx="135" cy="88" r="8" fill="#FCD5CE"/>
      </g>

      {/* Floating hearts */}
      <path d="M100 100 C100 90 110 85 115 90 C120 85 130 90 130 100 C130 115 115 125 115 125 C115 125 100 115 100 100Z" fill="#F472B6" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.4;0.7" dur="2s" repeatCount="indefinite"/>
      </path>

      <path d="M280 130 C280 122 288 118 292 122 C296 118 304 122 304 130 C304 142 292 150 292 150 C292 150 280 142 280 130Z" fill="#FB7185" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2.5s" repeatCount="indefinite"/>
      </path>

      {/* Stars */}
      <polygon points="320,150 323,158 332,158 325,163 328,172 320,167 312,172 315,163 308,158 317,158" fill="#FBBF24" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
      </polygon>

      <polygon points="90,180 92,186 98,186 93,190 95,196 90,192 85,196 87,190 82,186 88,186" fill="#FCD34D" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
      </polygon>

      {/* Floating leaves/nature elements */}
      <ellipse cx="60" cy="140" rx="12" ry="6" fill="#86EFAC" opacity="0.6" transform="rotate(-30, 60, 140)"/>
      <ellipse cx="340" cy="200" rx="15" ry="7" fill="#6EE7B7" opacity="0.5" transform="rotate(20, 340, 200)"/>

      {/* Sparkles */}
      <circle cx="150" cy="50" r="3" fill="#A5B4FC">
        <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="260" cy="70" r="2" fill="#C4B5FD">
        <animate attributeName="r" values="2;4;2" dur="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="310" cy="240" r="3" fill="#F9A8D4">
        <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
      </circle>

      {/* Wellness aura around person */}
      <circle cx="200" cy="150" r="90" stroke="url(#wellness-gradient)" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="10 5">
        <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="20s" repeatCount="indefinite"/>
      </circle>

      <defs>
        <linearGradient id="wellness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8"/>
          <stop offset="50%" stopColor="#F472B6"/>
          <stop offset="100%" stopColor="#34D399"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
