function CuravelLogo({ height = 40 }) {
  // New tight width for the viewBox
  const viewBoxWidth = 460;
  const separatorX = 145; // Line placed right after the icon

  return (
    <svg 
      viewBox={`0 0 ${viewBoxWidth} 280`} 
      preserveAspectRatio="xMidYMid meet" 
      style={{ height, display: 'block' }}
    >
      <title>Curavel app logo</title>

      {/* Icon - No translation needed, it's at the start of the viewBox */}
      <g>
        <defs>
          <clipPath id="circle-clip">
            <circle cx="70" cy="140" r="72"/>
          </clipPath>
        </defs>
        <circle cx="70" cy="140" r="72" fill="#1A1A1A"/>
        <g clipPath="url(#circle-clip)" fill="none" stroke="#F7F6F3" strokeWidth="1" opacity="0.35">
          <ellipse cx="70" cy="140" rx="72" ry="22"/>
          <ellipse cx="70" cy="140" rx="72" ry="44"/>
          <ellipse cx="70" cy="140" rx="72" ry="64"/>
          <line x1="70" y1="68" x2="70" y2="212"/>
          <ellipse cx="70" cy="140" rx="24" ry="72"/>
          <ellipse cx="70" cy="140" rx="48" ry="72"/>
        </g>
        <circle cx="70" cy="140" r="72" fill="none" stroke="#F7F6F3" strokeWidth="1.5" opacity="0.5"/>
        <path d="M30 168 Q50 108 90 128 Q115 140 105 115" fill="none" stroke="#F7F6F3" strokeWidth="3" strokeLinecap="round" />
        <path d="M105 115 L98 108 M105 115 L112 110" fill="none" stroke="#F7F6F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="168" r="5" fill="#F7F6F3"/>
      </g>

      {/* Separator Line - Positioned after the icon */}
      <line x1={separatorX} y1="90" x2={separatorX} y2="190" stroke="#E8E6E0" strokeWidth="1"/>

      {/* Wordmark - Positioned after the separator */}
      <text x={separatorX + 25} y="126" fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontSize="64" fontWeight="500" fill="#1A1A1A" letterSpacing="-2">
        Curavel
      </text>
      <text x={separatorX + 27} y="162" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="400" fill="#6B6B6B" letterSpacing="0.5">
        Currency · Travel · Budget
      </text>
    </svg>
  );
}

export default CuravelLogo;