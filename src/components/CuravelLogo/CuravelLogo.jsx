function CuravelLogo({ height = 40 }) {
  return (
    <svg width="100%" viewBox="0 0 680 280" role="img" style={{ height }}>
      <title>Curavel app logo</title>
      <desc>Curavel wordmark with a stylised globe and currency path icon</desc>

      <defs>
        <clipPath id="circle-clip">
          <circle cx="140" cy="140" r="72"/>
        </clipPath>
      </defs>

      {/* Icon background circle */}
      <circle cx="140" cy="140" r="72" fill="#1A1A1A"/>

      {/* Globe latitude and longitude lines */}
      <g clipPath="url(#circle-clip)" fill="none" stroke="#F7F6F3" strokeWidth="1" opacity="0.35">
        <ellipse cx="140" cy="140" rx="72" ry="22"/>
        <ellipse cx="140" cy="140" rx="72" ry="44"/>
        <ellipse cx="140" cy="140" rx="72" ry="64"/>
        <line x1="140" y1="68" x2="140" y2="212"/>
        <ellipse cx="140" cy="140" rx="24" ry="72"/>
        <ellipse cx="140" cy="140" rx="48" ry="72"/>
      </g>

      {/* Globe outer ring */}
      <circle cx="140" cy="140" r="72" fill="none" stroke="#F7F6F3" strokeWidth="1.5" opacity="0.5"/>

      {/* Currency travel route arc */}
      <path
        d="M100 168 Q120 108 160 128 Q185 140 175 115"
        fill="none"
        stroke="#F7F6F3"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Arrow tip at destination */}
      <path
        d="M175 115 L168 108 M175 115 L182 110"
        fill="none"
        stroke="#F7F6F3"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Origin dot */}
      <circle cx="100" cy="168" r="5" fill="#F7F6F3"/>

      {/* Separator line */}
      <line x1="225" y1="90" x2="225" y2="190" stroke="#E8E6E0" strokeWidth="1"/>

      {/* Wordmark */}
      <text
        x="240"
        y="126"
        fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
        fontSize="64"
        fontWeight="500"
        fill="#1A1A1A"
        letterSpacing="-2"
      >
        Curavel
      </text>

      {/* Tagline */}
      <text
        x="242"
        y="162"
        fontFamily="'Inter', sans-serif"
        fontSize="18"
        fontWeight="400"
        fill="#6B6B6B"
        letterSpacing="0.5"
      >
        Currency · Travel · Budget
      </text>
    </svg>
  );
}

export default CuravelLogo;
